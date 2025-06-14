import { Platform } from 'react-native';
import { MADRASA_API_ENDPOINTS, MADRASA_API_URL } from '@/api/config/madrasaApiConfig';
import madrasaClient from '@/api/clients/madrasaClient';
import authService from '@/modules/auth/services/authService';

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
    console.log('    • fileRequestType: PROFILE_IMAGE');
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
  
  console.log('  -F "fileRequestType=PROFILE_IMAGE" \\');
  console.log('  -F "userId=[USER_ID]" \\');
  console.log('  -F "file=@[IMAGE_FILE]"');
};

/**
 * Upload file to S3 using the Madrasa API
 * @param userId - User ID for the upload
 * @param file - FormData containing the file and metadata
 * @returns Promise<FileUploadResponse> - Upload response with file details
 */
export const uploadFile = async (userId: string, file: FormData): Promise<FileUploadResponse> => {
  console.log('🚀 === STARTING FILE UPLOAD PROCESS ===');
  console.log('📤 Step 1: Upload initiated for userId:', userId);
  console.log('📤 Step 2: API Endpoint:', MADRASA_API_ENDPOINTS.UPLOAD_FILE);
  console.log('📤 Step 3: Full URL:', `${MADRASA_API_URL}${MADRASA_API_ENDPOINTS.UPLOAD_FILE}`);
  
  try {
    // Log FormData details
    logFormData(file, 'uploadFile');
    
    console.log('📤 Step 4: Preparing request configuration...');
    
    // Prepare request configuration
    const requestConfig = {
      timeout: 60000, // 60 seconds for large files
      headers: {
        // For file uploads, we need to be careful with headers
        // Don't set Content-Type - let FormData/browser handle it with boundary
        'Accept': 'application/json',
      },
      // Override the default transform to ensure FormData is not modified
      transformRequest: (data: any) => {
        console.log('📤 Step 5: Transform request called with data type:', typeof data);
        console.log('📤 Step 5b: Is FormData?', data instanceof FormData);
        return data; // Don't transform FormData
      },
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`📊 Upload progress: ${percentCompleted}% (${progressEvent.loaded}/${progressEvent.total} bytes)`);
        }
      },
    };
    
    console.log('📤 Step 6: Request config prepared:', {
      timeout: requestConfig.timeout,
      headers: requestConfig.headers,
      hasFormData: file instanceof FormData,
    });
    
    // Log equivalent CURL command
    logCurlEquivalent(
      `${MADRASA_API_URL}${MADRASA_API_ENDPOINTS.UPLOAD_FILE}`,
      file,
      requestConfig.headers
    );
    
    console.log('�� Step 7: Making API call through authService.executeWithTokenRefresh...');
    
    // Use executeWithTokenRefresh to handle token expiration automatically
    const response = await authService.executeWithTokenRefresh(() => {
      console.log('📤 Step 8: Inside executeWithTokenRefresh callback, making actual HTTP request...');
      return madrasaClient.post<FileUploadResponse>(
        MADRASA_API_ENDPOINTS.UPLOAD_FILE,
        file,
        requestConfig
      );
    });
    
    console.log('✅ === FILE UPLOAD SUCCESSFUL ===');
    console.log('✅ Step 9: Response received:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    
    return response.data;
    
  } catch (error: any) {
    console.error('❌ === FILE UPLOAD FAILED ===');
    console.error('❌ Step X: Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout,
        headers: error.config?.headers
      },
      code: error.code,
      stack: error.stack
    });

    // Enhanced error handling with specific messages
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error('❌ Server Error Response:', { status, data });
      
      switch (status) {
        case 400:
          throw new Error(data?.message || 'Invalid file format or missing required fields. Please check the file and try again.');
        case 401:
          throw new Error('Authentication failed. Please log in again.');
        case 403:
          throw new Error('You do not have permission to upload files.');
        case 404:
          throw new Error('Upload endpoint not found. Please contact support.');
        case 413:
          throw new Error('File is too large. Please choose a smaller image (max 10MB).');
        case 415:
          throw new Error('Unsupported file type. Please use JPG, PNG, or GIF format.');
        case 429:
          throw new Error('Too many upload attempts. Please wait a moment before trying again.');
        case 500:
          throw new Error('Server error occurred. Please try again later.');
        default:
          throw new Error(data?.message || `Upload failed with status ${status}. Please try again.`);
      }
    } else if (error.request) {
      // Network error - no response received
      console.error('❌ Network Error - No Response:', error.request);
      if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timeout. Please check your internet connection and try again.');
      }
      throw new Error('Network error. Please check your internet connection and try again.');
    } else {
      // Error in request preparation
      console.error('❌ Request Setup Error:', error.message);
      throw new Error('Failed to prepare upload request. Please try again.');
    }
  }
};

/**
 * Prepare image file for upload by creating proper FormData
 * @param imageFile - Image file object with uri, type, and fileName
 * @param userId - User ID for the upload
 * @returns Promise<FormData> - Prepared FormData for upload
 */
export const prepareImageForUpload = async (imageFile: ImageFile, userId: string): Promise<FormData> => {
  console.log('🔧 === PREPARING IMAGE FOR UPLOAD ===');
  console.log('🔧 Step 1: Input validation...');
  
  if (!imageFile?.uri) {
    throw new Error('Image file URI is required');
  }
  
  if (!userId) {
    throw new Error('User ID is required');
  }

  console.log('🔧 Step 2: Input details:', {
    imageUri: imageFile.uri,
    imageType: imageFile.type,
    imageFileName: imageFile.fileName,
    userId: userId,
    platform: Platform.OS
  });

  const formData = new FormData();
  
  try {
    console.log('🔧 Step 3: Adding required API fields...');
    
    // Add required API fields as per documentation
    formData.append('fileRequestType', 'PROFILE_IMAGE');
    formData.append('userId', userId);
    
    console.log('🔧 Step 4: Added fields - fileRequestType: PROFILE_IMAGE, userId:', userId);
    
    // Determine file details
    const fileName = imageFile.fileName || 
                    imageFile.uri.split('/').pop() || 
                    `profile_${Date.now()}.jpg`;
    
    console.log('🔧 Step 5: Determined fileName:', fileName);
    
    // Handle platform-specific file preparation
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      console.log('🔧 Step 6: Processing for mobile platform...');
      
      // Mobile platform - handle native file URI
      let fileUri = imageFile.uri;
      
      // Ensure proper file:// prefix for Android
      if (Platform.OS === 'android' && !fileUri.startsWith('file://')) {
        fileUri = `file://${fileUri}`;
      }

      // Determine MIME type
      const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
      const mimeType = imageFile.type || getMimeTypeFromExtension(fileExtension);
      
      console.log('🔧 Step 7: File processing details:', {
        originalUri: imageFile.uri,
        processedUri: fileUri,
        fileName: fileName,
        mimeType: mimeType,
        fileExtension: fileExtension,
        platform: Platform.OS
      });
      
      try {
        console.log('🔧 Step 8: Fetching file content from URI...');
        
        // Fetch the file content to convert to blob
        const response = await fetch(fileUri);
        console.log('🔧 Step 8b: Fetch response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }
        
        const blob = await response.blob();
        console.log('🔧 Step 9: File converted to blob:', {
          size: blob.size,
          type: blob.type
        });
        
        // Ensure we have a proper MIME type
        const finalMimeType = (blob.type && blob.type !== 'application/octet-stream') 
          ? blob.type 
          : mimeType;
        
        // Create a File object with proper name and type
        const fileObject = new File([blob], fileName, { 
          type: finalMimeType 
        });
        
        console.log('🔧 Step 10: Created File object:', {
          name: fileObject.name,
          size: fileObject.size,
          type: fileObject.type,
          lastModified: fileObject.lastModified
        });
        
        // Append the file to FormData
        formData.append('file', fileObject);
        console.log('🔧 Step 11: File appended to FormData successfully');
        
      } catch (fetchError: any) {
        console.error('❌ Error fetching/processing file:', fetchError);
        throw new Error(`Failed to process image file: ${fetchError.message}`);
      }
      
    } else {
      console.log('🔧 Step 6: Processing for web platform...');
      
      // Web platform - handle File/Blob objects
      if (imageFile instanceof File || imageFile instanceof Blob) {
        formData.append('file', imageFile as any);
        console.log('🔧 Step 7: Web file appended to FormData');
      } else {
        throw new Error('Invalid file format for web platform');
      }
    }

    // Log final FormData state
    console.log('🔧 Step 12: FormData preparation completed:', {
      fileRequestType: 'PROFILE_IMAGE',
      userId,
      fileName,
      hasFile: true,
      platform: Platform.OS
    });

    logFormData(formData, 'prepareImageForUpload - final');

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