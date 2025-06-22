import { Platform } from 'react-native';
import { MADRASA_API_ENDPOINTS, MADRASA_API_URL } from '@/api/config/madrasaApiConfig';
import madrasaClient from '@/api/clients/madrasaClient';
import authService from '@/modules/auth/services/authService';
import tokenService from '@/modules/auth/services/tokenService';

export interface FileUploadResponse {
  fileExtension: string;
  fileLink: string;
  fileType: string;
}

export interface ImageFile {
  uri: string;
  type?: string;
  fileName?: string;
}

/**
 * Log FormData contents in a safe way
 */
const logFormData = (formData: FormData, context: string) => {
  if (!__DEV__) return;
  
  console.log(`📦 FormData contents (${context}):`);
  try {
    // For React Native, we can't iterate over FormData directly
    // So we'll log what we know we added
    console.log('  - Fields added to FormData:');
    console.log('    • fileRequestType: PUBLIC_PROFILE_PHOTO');
    console.log('    • userId: [provided]');
    console.log('    • file: [binary data]');
  } catch (error) {
    console.log('  - Could not iterate FormData:', error);
  }
};

/**
 * Create a proper CURL command representation for logging
 */
const logCurlEquivalent = (url: string, formData: FormData, headers: any) => {
  if (!__DEV__) return;
  
  console.log('🌐 Equivalent CURL command:');
  console.log(`curl -X POST "${url}" \\`);
  
  // Log headers
  Object.keys(headers || {}).forEach(key => {
    if (headers[key]) {
      console.log(`  -H "${key}: ${headers[key]}" \\`);
    }
  });
  
  console.log('  -F "fileRequestType=PUBLIC_PROFILE_PHOTO" \\');
  console.log('  -F "userId=[USER_ID]" \\');
  console.log('  -F "file=@[IMAGE_FILE]"');
};

/**
 * Simple test function to verify API connectivity
 */
export const testApiConnectivity = async (): Promise<boolean> => {
  console.log('🧪 === TESTING API CONNECTIVITY ===');
  
  try {
    const result = await authService.executeWithTokenRefresh(async () => {
      console.log('🧪 Making simple GET request to test connectivity...');
      
      // Make a simple request to a known endpoint
      const response = await madrasaClient.get('/api/v1/user/profile'); // or any simple endpoint
      
      console.log('🧪 Test request successful:', {
        status: response.status,
        statusText: response.statusText,
        hasData: !!response.data
      });
      
      return response;
    });
    
    console.log('✅ API connectivity test PASSED');
    return true;
    
  } catch (error) {
    console.log('❌ API connectivity test FAILED:', error);
    return false;
  }
};

/**
 * Simple FormData test without file upload
 */
export const testFormDataSubmission = async (userId: string): Promise<boolean> => {
  console.log('🧪 === TESTING FORMDATA SUBMISSION ===');
  
  try {
    const formData = new FormData();
    (formData as any).append('fileRequestType', 'PUBLIC_PROFILE_IMAGE');
    (formData as any).append('userId', userId);
    (formData as any).append('testField', 'test-value');
    
    console.log('🧪 Test FormData created with basic fields');
    
    const result = await authService.executeWithTokenRefresh(async () => {
      console.log('🧪 Making FormData test request...');
      
      const response = await madrasaClient.post('/api/v1/upload-file-to-s3', formData, {
        timeout: 60000, // 1 minute timeout for test
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('🧪 FormData test successful:', {
        status: response.status,
        statusText: response.statusText
      });
      
      return response;
    });
    
    console.log('✅ FormData test PASSED');
    return true;
    
  } catch (error) {
    console.log('❌ FormData test FAILED:', error);
    return false;
  }
};

/**
 * Upload file to S3 using native fetch with proper FormData handling
 * @param userId - User ID for the upload
 * @param formData - FormData containing the file and metadata
 * @returns Promise<FileUploadResponse> - Upload response with file details
 */
export const uploadFile = async (userId: string, formData: FormData): Promise<FileUploadResponse> => {
  console.log('🚀 === STARTING FILE UPLOAD PROCESS (FETCH API) ===');
  console.log('📤 Upload initiated for userId:', userId);
  console.log('📤 API Endpoint:', `${MADRASA_API_URL}${MADRASA_API_ENDPOINTS.UPLOAD_FILE}`);
  
  try {
    // Get access token
    const accessToken = await tokenService.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available. Please log in again.');
    }
    
    console.log('📤 Preparing fetch request with FormData...');
    
    // Use native fetch API which handles FormData properly in React Native
    const response = await fetch(`${MADRASA_API_URL}${MADRASA_API_ENDPOINTS.UPLOAD_FILE}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        // Note: Do NOT set Content-Type for FormData - let fetch set it with proper boundary
      },
      body: formData,
    });
    
    console.log('📤 Fetch response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      console.error('❌ HTTP Error Response:', { status: response.status, data: errorData });
      
      switch (response.status) {
        case 400:
          throw new Error(errorData?.message || 'Invalid file format or missing required fields.');
        case 401:
          throw new Error('Authentication failed. Please log in again.');
        case 403:
          throw new Error('You do not have permission to upload files.');
        case 413:
          throw new Error('File is too large. Please choose a smaller image (max 10MB).');
        case 415:
          throw new Error('Unsupported file type. Please use JPG, PNG, or GIF format.');
        default:
          throw new Error(errorData?.message || `Upload failed with status ${response.status}.`);
      }
    }
    
    const responseData = await response.json();
    
    console.log('✅ === FILE UPLOAD SUCCESSFUL ===');
    console.log('✅ Response data:', responseData);
    
    return responseData;
    
  } catch (error: any) {
    console.error('❌ === FILE UPLOAD FAILED ===');
    console.error('❌ Error details:', error);

    // Handle specific error types
    if (error.name === 'TypeError' || error.message.includes('Network')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    } else if (error.message.includes('timeout')) {
      throw new Error('Upload timeout. Please check your internet connection and try again.');
    } else {
      throw new Error(error.message || 'Failed to upload image. Please try again.');
    }
  }
};

/**
 * Prepare image file for upload by creating proper FormData with actual File object
 * @param imageFile - Image file object with uri, type, and fileName
 * @param userId - User ID for the upload
 * @returns Promise<FormData> - Prepared FormData for upload
 */
export const prepareImageForUpload = async (imageFile: ImageFile, userId: string): Promise<FormData> => {
  console.log('🔧 === PREPARING IMAGE FOR UPLOAD ===');
  console.log('🔧 Input details:', {
    imageUri: imageFile.uri,
    imageType: imageFile.type,
    imageFileName: imageFile.fileName,
    userId: userId,
    platform: Platform.OS
  });

  if (!imageFile?.uri) {
    throw new Error('Image file URI is required');
  }
  
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const formData = new FormData();
    
    // Add required API fields as strings (not objects)
    formData.append('fileRequestType', 'PUBLIC_PROFILE_PHOTO');
    formData.append('userId', userId.toString());
    
    // Determine file details
    const fileName = imageFile.fileName || 
                    imageFile.uri.split('/').pop() || 
                    `profile_${Date.now()}.jpg`;
    
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = imageFile.type || getMimeTypeFromExtension(fileExtension);
    
    console.log('🔧 File processing details:', {
      fileName,
      mimeType,
      fileExtension,
      platform: Platform.OS
    });
    
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      // Mobile platform - create proper file object
      let fileUri = imageFile.uri;
      
      // Ensure proper file:// prefix for Android
      if (Platform.OS === 'android' && !fileUri.startsWith('file://')) {
        fileUri = `file://${fileUri}`;
      }

      // For React Native, append as an object that looks like a File
      const fileObject = {
        uri: fileUri,
        type: mimeType,
        name: fileName,
      };
      
      // Append the file object directly (React Native FormData handles this)
      (formData as any).append('file', fileObject);
      
      console.log('✅ Mobile file object appended to FormData:', fileObject);
      
          } else {
        // Web platform - handle File/Blob objects
        if (imageFile instanceof File || imageFile instanceof Blob) {
          (formData as any).append('file', imageFile, fileName);
          console.log('✅ Web file appended to FormData');
        } else {
          throw new Error('Invalid file format for web platform');
        }
      }

    console.log('🔧 FormData preparation completed with fields:');
    console.log('  - fileRequestType: PUBLIC_PROFILE_PHOTO');
    console.log('  - userId:', userId);
    console.log('  - file: [File object]');
    console.log('  - fileName:', fileName);
    console.log('  - mimeType:', mimeType);

    console.log('✅ === IMAGE PREPARATION SUCCESSFUL ===');
    return formData;
    
  } catch (error: any) {
    console.error('❌ === IMAGE PREPARATION FAILED ===');
    console.error('❌ Error preparing FormData:', error);
    throw new Error(`Failed to prepare file for upload: ${error.message}`);
  }
};

/**
 * Get MIME type from file extension
 * @param extension - File extension (without dot)
 * @returns string - MIME type
 */
const getMimeTypeFromExtension = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'svg': 'image/svg+xml',
  };
  
  return mimeTypes[extension] || 'image/jpeg';
};

/**
 * Validate image file before upload
 * @param imageFile - Image file to validate
 * @returns boolean - True if valid
 */
export const validateImageFile = (imageFile: ImageFile): boolean => {
  console.log('🔍 Validating image file:', imageFile);
  
  // Check if file exists
  if (!imageFile?.uri) {
    console.log('❌ Validation failed: No URI');
    return false;
  }
  
  // Check file extension
  const fileName = imageFile.fileName || imageFile.uri.split('/').pop() || '';
  const extension = fileName.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  
  const isValid = allowedExtensions.includes(extension || '');
  console.log('🔍 Validation result:', {
    fileName,
    extension,
    isValid,
    allowedExtensions
  });
  
  return isValid;
};