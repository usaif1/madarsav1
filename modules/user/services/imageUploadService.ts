import { Platform } from 'react-native';
import { MADRASA_API_ENDPOINTS } from '@/api/config/madrasaApiConfig';
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

export const uploadFile = async (userId: string, file: FormData): Promise<FileUploadResponse> => {
  try {
    console.log('📤 Uploading file for userId:', userId);
    
    // Log FormData entries for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('📦 FormData in service:', {
        userId,
        url: MADRASA_API_ENDPOINTS.UPLOAD_FILE,
        hasFormData: !!file
      });
    }
    
    // Use executeWithTokenRefresh to handle token expiration
    const response = await authService.executeWithTokenRefresh(() => 
      madrasaClient.post<FileUploadResponse>(
        MADRASA_API_ENDPOINTS.UPLOAD_FILE,
        file,
        {
          headers: {
            'Accept': 'application/json',
          },
          transformRequest: (data) => data, // Don't transform FormData
          timeout: 60000,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            console.log(`Upload progress: ${percentCompleted}%`);
          },
        }
      )
    );
    
    console.log('✅ File uploaded successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to upload file:', {
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });

    // Provide more specific error messages
    if (error.response) {
      switch (error.response.status) {
        case 404:
          throw new Error('Upload endpoint not found. Please check the API configuration.');
        case 401:
          throw new Error('Unauthorized. Please make sure you are logged in.');
        case 413:
          throw new Error('File is too large. Please choose a smaller image.');
        case 400:
          throw new Error('Invalid file format or request. Please check the file and try again.');
        default:
          throw new Error(error.response.data?.message || 'Failed to upload file. Please try again.');
      }
    } else if (error.request) {
      throw new Error('No response from server. Please check your internet connection.');
    } else {
      throw new Error('Error preparing upload. Please try again.');
    }
  }
};

export const prepareImageForUpload = async (imageFile: ImageFile, userId: string): Promise<FormData> => {
  const formData = new FormData();
  
  // Add required fields with exact parameter names from API docs
  formData.append('fileRequestType', 'PROFILE_IMAGE');
  formData.append('userId', userId);
  
  // Handle file based on platform
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    const fileUri = Platform.OS === 'android' && !imageFile.uri.startsWith('file://') 
      ? `file://${imageFile.uri}` 
      : imageFile.uri;

    try {
      // Fetch the file content
      const fetchResponse = await fetch(fileUri);
      const blob = await fetchResponse.blob();

      const fileName = imageFile.fileName || imageFile.uri.split('/').pop() || 'profile.jpg';
      const effectiveType = (blob.type && blob.type !== 'application/octet-stream') 
        ? blob.type 
        : (imageFile.type || 'image/jpeg');
      
      // Log file details for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('📁 File details:', {
          uri: fileUri,
          type: effectiveType,
          name: fileName
        });
      }
      
      // Create a new file object that matches the API's expectations
      const fileToUpload = {
        uri: fileUri,
        type: effectiveType,
        name: fileName,
      };

      // Append the file directly to FormData
      formData.append('file', fileToUpload as any);
    } catch (error) {
      console.error('Error preparing file for upload:', error);
      throw new Error('Failed to prepare file for upload');
    }
  } else {
    // Web browser File/Blob handling
    formData.append('file', imageFile as any);
  }

  // Log the final FormData for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('📦 Final FormData contents:', {
      fileRequestType: 'PROFILE_IMAGE',
      userId,
      hasFile: true
    });
  }

  return formData;
};