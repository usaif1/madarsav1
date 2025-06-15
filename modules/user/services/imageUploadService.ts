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
    (formData as any).append('fileRequestType', 'TEST');
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
    
    // Simplified request configuration for FormData uploads
    const requestConfig = {
      timeout: 120000, // 2 minutes for file uploads
      headers: {
        // Only set Accept header - let React Native handle Content-Type for FormData
        'Accept': 'application/json',
      },
      // Disable any transformations that might interfere with FormData
      transformRequest: [],
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`📊 Upload progress: ${percentCompleted}% (${progressEvent.loaded}/${progressEvent.total} bytes)`);
        }
      },
    };
    
    console.log('📤 Step 5: Request config prepared:', {
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
    
    console.log('📤 Step 6: Making API call through authService.executeWithTokenRefresh...');
    
    // Use executeWithTokenRefresh to handle token expiration automatically
    const response = await authService.executeWithTokenRefresh(() => {
      console.log('📤 Step 7: Inside executeWithTokenRefresh callback, making actual HTTP request...');
      return madrasaClient.post<FileUploadResponse>(
        MADRASA_API_ENDPOINTS.UPLOAD_FILE,
        file,
        requestConfig
      );
    });
    
    console.log('✅ === FILE UPLOAD SUCCESSFUL ===');
    console.log('✅ Step 8: Response received:', {
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
      console.log('🔧 Step 6: Processing for mobile platform - converting to binary...');
      
      // Mobile platform - convert file to binary
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
        console.log('🔧 Step 8: Fetching file content and converting to binary...');
        
        // Fetch the file content
        const response = await fetch(fileUri);
        console.log('🔧 Step 8b: Fetch response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }
        
        // Get blob directly from response (React Native friendly)
        const binaryBlob = await response.blob();
        console.log('🔧 Step 9: File converted to binary blob:', {
          size: binaryBlob.size,
          type: binaryBlob.type,
          constructor: binaryBlob.constructor.name
        });
        
        // Create a new blob with correct MIME type if needed
        const finalBlob = binaryBlob.type ? binaryBlob : new Blob([binaryBlob as any], { type: mimeType });
        console.log('🔧 Step 10: Final binary blob prepared:', {
          size: finalBlob.size,
          type: finalBlob.type,
          constructor: finalBlob.constructor.name
        });
        
        // Append the binary blob to FormData (React Native FormData.append supports 3 parameters)
        (formData as any).append('file', finalBlob, fileName);
        console.log('✅ Step 11: Binary file appended to FormData successfully');
        
        // Log exactly what we are sending
        console.log('📤 === THIS IS WHAT WE ARE SENDING: ===');
        console.log('📤 Field 1 - fileRequestType:', 'PROFILE_IMAGE');
        console.log('📤 Field 2 - userId:', userId);
        console.log('📤 Field 3 - file:', {
          data: `Binary Blob (${finalBlob.size} bytes)`,
          type: finalBlob.type,
          name: fileName,
          format: 'Binary Blob from fetch response',
          constructor: finalBlob.constructor.name
        });
        console.log('📤 === END OF WHAT WE ARE SENDING ===');
        
      } catch (fetchError: any) {
        console.error('❌ Error fetching/processing file:', fetchError);
        throw new Error(`Failed to process image file: ${fetchError.message}`);
      }
      
    } else {
      console.log('🔧 Step 6: Processing for web platform...');
      
      // Web platform - handle File/Blob objects as binary
      if (imageFile instanceof File || imageFile instanceof Blob) {
        // Use the file/blob directly for web platform
        const finalBlob = imageFile;
        
        (formData as any).append('file', finalBlob, fileName);
        console.log('✅ Step 7: Web binary file appended to FormData');
        
        // Log exactly what we are sending
        console.log('📤 === THIS IS WHAT WE ARE SENDING: ===');
        console.log('📤 Field 1 - fileRequestType:', 'PROFILE_IMAGE');
        console.log('📤 Field 2 - userId:', userId);
        console.log('📤 Field 3 - file:', {
          data: `Binary Blob (${finalBlob.size} bytes)`,
          type: finalBlob.type,
          name: fileName,
          format: 'Direct File/Blob'
        });
        console.log('📤 === END OF WHAT WE ARE SENDING ===');
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
      platform: Platform.OS,
      format: 'Binary Blob'
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