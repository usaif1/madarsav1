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
        // For file uploads, only set Accept header - NO Content-Type for FormData
        'Accept': 'application/json',
        // FormData will automatically set: Content-Type: multipart/form-data; boundary=...
      },
      // CRITICAL: Completely disable Axios default transforms for FormData
      transformRequest: [(data: any, headers: any) => {
        console.log('📤 Step 5: Upload service transform - data type:', typeof data);
        console.log('📤 Step 5b: Upload service transform - Is FormData?', data instanceof FormData);
        
        if (data instanceof FormData) {
          console.log('📤 Step 5c: Processing FormData in upload service transform');
          
          // Remove Content-Type to let FormData set proper boundary
          if (headers) {
            console.log('📤 Step 5d: Headers before Content-Type removal:', headers);
            delete headers['Content-Type'];
            delete headers['content-type'];
            console.log('📤 Step 5e: Headers after Content-Type removal:', headers);
          }
        }
        
        return data; // Don't transform FormData
      }],
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
    
    // Add detailed FormData inspection
    console.log('🔍 DETAILED FORMDATA INSPECTION:');
    console.log('🔍 FormData instanceof check:', file instanceof FormData);
    console.log('🔍 FormData constructor:', file.constructor.name);
    console.log('🔍 FormData toString:', file.toString());
    
    // Try to log FormData entries if possible
    try {
      if (file instanceof FormData) {
        console.log('🔍 FormData entries:');
        // Use a safer approach to iterate FormData
        const formDataEntries = (file as any).entries;
        if (typeof formDataEntries === 'function') {
          for (const [key, value] of formDataEntries.call(file)) {
            console.log(`🔍   ${key}:`, typeof value, value instanceof File ? `File(${value.name}, ${value.size}b, ${value.type})` : value);
          }
        } else {
          console.log('🔍 FormData.entries() not available, using alternative inspection');
          // Alternative: try to access known keys
          const knownKeys = ['fileRequestType', 'userId', 'file'];
          knownKeys.forEach(key => {
            try {
              const value = (file as any).get(key);
              if (value !== null) {
                console.log(`🔍   ${key}:`, typeof value, value instanceof File ? `File(${value.name}, ${value.size}b, ${value.type})` : value);
              }
            } catch (e) {
              console.log(`🔍   ${key}: Could not access`);
            }
          });
        }
      }
    } catch (entriesError) {
      console.log('🔍 Could not iterate FormData entries:', entriesError);
    }
    
    // Log the exact URL being called
    const fullUrl = `${MADRASA_API_URL}${MADRASA_API_ENDPOINTS.UPLOAD_FILE}`;
    console.log('🔍 FULL REQUEST URL:', fullUrl);
    console.log('🔍 BASE URL:', MADRASA_API_URL);
    console.log('🔍 ENDPOINT:', MADRASA_API_ENDPOINTS.UPLOAD_FILE);
    
    console.log('📤 Step 7: Making API call through authService.executeWithTokenRefresh...');
    
    // Add a test to see if we can make a simple request first
    console.log('🧪 NETWORK TEST: Testing basic connectivity...');
    try {
      // Test basic connectivity with a simple GET request
      const testResponse = await madrasaClient.get('/api/v1/health-check', { timeout: 5000 }).catch(testError => {
        console.log('🧪 Basic connectivity test failed:', testError.message);
        return null;
      });
      console.log('🧪 Basic connectivity test result:', testResponse ? 'SUCCESS' : 'FAILED');
    } catch (testError) {
      console.log('🧪 Basic connectivity test error:', testError);
    }
    
    console.log('📤 Step 8: Proceeding with actual upload request...');
    
    // Use executeWithTokenRefresh to handle token expiration automatically
    const response = await authService.executeWithTokenRefresh(() => {
      console.log('📤 Step 9: Inside executeWithTokenRefresh callback, making actual HTTP request...');
      console.log('📤 Step 9a: About to call madrasaClient.post with:', {
        endpoint: MADRASA_API_ENDPOINTS.UPLOAD_FILE,
        dataType: file instanceof FormData ? 'FormData' : typeof file,
        configHeaders: requestConfig.headers,
        configTimeout: requestConfig.timeout
      });
      
      return madrasaClient.post<FileUploadResponse>(
        MADRASA_API_ENDPOINTS.UPLOAD_FILE,
        file,
        requestConfig
      );
    });
    
    console.log('✅ === FILE UPLOAD SUCCESSFUL ===');
    console.log('✅ Step 10: Response received:', {
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
 * Test function to isolate network connectivity issues
 * @param userId - User ID for testing
 * @returns Promise<void>
 */
export const testNetworkConnectivity = async (userId: string): Promise<void> => {
  console.log('🧪 === NETWORK CONNECTIVITY TEST ===');
  
  try {
    // Get access token
    const accessToken = await tokenService.getAccessToken();
    console.log('🧪 Step 1: Access token available:', !!accessToken);
    
    // Test 1: Basic HTTP request
    console.log('🧪 Step 2: Testing basic HTTP request...');
    const basicResponse = await fetch('https://httpbin.org/get');
    console.log('🧪 Basic HTTP test result:', {
      status: basicResponse.status,
      ok: basicResponse.ok
    });
    
    // Test 2: Server connectivity
    console.log('🧪 Step 3: Testing server connectivity...');
    const serverResponse = await fetch(`${MADRASA_API_URL}/api/v1/health-check`);
    console.log('🧪 Server connectivity test result:', {
      status: serverResponse.status,
      ok: serverResponse.ok
    });
    
    // Test 3: Authenticated request
    if (accessToken) {
      console.log('🧪 Step 4: Testing authenticated request...');
      const authResponse = await fetch(`${MADRASA_API_URL}/api/v1/user-details/${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      console.log('🧪 Auth test result:', {
        status: authResponse.status,
        ok: authResponse.ok
      });
    }
    
    // Test 4: Simple POST request
    console.log('🧪 Step 5: Testing simple POST request...');
    const postResponse = await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: 'data' })
    });
    console.log('🧪 POST test result:', {
      status: postResponse.status,
      ok: postResponse.ok
    });
    
    console.log('✅ All network tests passed');
    
  } catch (error) {
    console.error('❌ Network test failed:', error);
    throw error;
  }
};

/**
 * Upload file using native fetch API to bypass Axios Content-Type issues
 * @param userId - User ID for the upload
 * @param file - FormData containing the file
 * @returns Promise<FileUploadResponse> - Upload response
 */
export const uploadFileWithFetch = async (userId: string, file: FormData): Promise<FileUploadResponse> => {
  console.log('🚀 === STARTING NATIVE FETCH UPLOAD ===');
  console.log('📤 Step 1: Upload initiated for userId:', userId);
  
  try {
    // Get access token
    const accessToken = await tokenService.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }
    
    // Prepare URL
    const url = `${MADRASA_API_URL}${MADRASA_API_ENDPOINTS.UPLOAD_FILE}`;
    console.log('📤 Step 2: Upload URL:', url);
    
    // Log FormData details
    logFormData(file, 'uploadFileWithFetch');
    
    // Prepare headers - CRITICAL: Don't set Content-Type for FormData
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      // DO NOT set Content-Type - let FormData handle it automatically
    };
    
    console.log('📤 Step 3: Request headers:', headers);
    
    // Make the fetch request
    console.log('📤 Step 4: Making native fetch request...');
    
    // Add detailed debugging before the request
    console.log('🔍 PRE-REQUEST DEBUGGING:');
    console.log('🔍 URL:', url);
    console.log('🔍 Method: POST');
    console.log('🔍 Headers:', JSON.stringify(headers, null, 2));
    console.log('🔍 Body type:', file.constructor.name);
    console.log('🔍 FormData size estimate:', file.toString().length);
    
    // Test basic connectivity first
    console.log('🧪 Testing basic connectivity to server...');
    try {
      const testResponse = await fetch(`${MADRASA_API_URL}/api/v1/health-check`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      console.log('🧪 Basic connectivity test result:', {
        status: testResponse.status,
        ok: testResponse.ok
      });
    } catch (connectivityError) {
      console.error('🧪 Basic connectivity test failed:', connectivityError);
      throw new Error('Cannot reach server. Please check your internet connection.');
    }
    
    console.log('📤 Step 4b: Basic connectivity OK, proceeding with upload...');
    
    // Test authenticated request without FormData
    console.log('🧪 Testing authenticated request without FormData...');
    try {
      const authTestResponse = await fetch(`${MADRASA_API_URL}/api/v1/user-details/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      console.log('🧪 Auth test result:', {
        status: authTestResponse.status,
        ok: authTestResponse.ok
      });
    } catch (authError) {
      console.error('🧪 Auth test failed:', authError);
      throw new Error('Authentication failed. Please log in again.');
    }
    
    console.log('📤 Step 4c: Authentication OK, proceeding with FormData upload...');
    
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error('⏰ Upload request timed out after 60 seconds');
    }, 60000);
    
    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: file, // FormData will automatically set Content-Type with boundary
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error('❌ Fetch request failed:', {
        name: fetchError.name,
        message: fetchError.message,
        stack: fetchError.stack,
        code: fetchError.code
      });
      
      if (fetchError.name === 'AbortError') {
        throw new Error('Upload timed out. Please try again with a smaller image.');
      }
      
      // Check if it's a network error
      if (fetchError.message.includes('Network request failed')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      throw fetchError;
    }
    
    console.log('📤 Step 5: Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Upload failed with status:', response.status, errorText);
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    console.log('✅ === NATIVE FETCH UPLOAD SUCCESSFUL ===');
    console.log('✅ Response data:', responseData);
    
    return responseData;
    
  } catch (error: any) {
    console.error('❌ === NATIVE FETCH UPLOAD FAILED ===');
    console.error('❌ Error details:', error);
    throw error;
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