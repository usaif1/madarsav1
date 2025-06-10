import axios, { AxiosInstance } from 'axios';
import { Platform } from 'react-native';
import { MADRASA_API_ENDPOINTS } from '@/api/config/madrasaApiConfig';

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

class ImageUploadClient {
  private static instance: AxiosInstance;

  static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: process.env.API_BASE_URL || 'https://api.madrasaapp.com',
        timeout: 60000, // 60 seconds timeout for uploads
        headers: {
          'Accept': 'application/json',
        },
      });
    }
    return this.instance;
  }
}

export const uploadFile = async (userId: string, file: FormData): Promise<FileUploadResponse> => {
  try {
    console.log('📤 Uploading file for userId:', userId);
    
    // Log FormData entries for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('📦 FormData in service:', {
        userId,
        url: MADRASA_API_ENDPOINTS.UPLOAD_FILE
      });
    }
    
    const client = ImageUploadClient.getInstance();
    const response = await client.post<FileUploadResponse>(
      MADRASA_API_ENDPOINTS.UPLOAD_FILE,
      file,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 60000,
      }
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
    throw error;
  }
};

export const prepareImageForUpload = async (imageFile: ImageFile): Promise<FormData> => {
  const formData = new FormData();
  
  // Add required fields
  formData.append('fileRequestType', 'PROFILE_IMAGE');
  
  // Handle file based on platform
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    const fileUri = Platform.OS === 'android' && !imageFile.uri.startsWith('file://') 
      ? `file://${imageFile.uri}` 
      : imageFile.uri;

    // Fetch the file content and convert to blob
    const fetchResponse = await fetch(fileUri);
    const blob = await fetchResponse.blob();

    const fileName = imageFile.fileName || imageFile.uri.split('/').pop() || 'profile.jpg';
    const effectiveType = (blob.type && blob.type !== 'application/octet-stream') 
      ? blob.type 
      : (imageFile.type || 'image/jpeg');
    
    // Create a File object from the blob
    const fileToAppend = new File([blob], fileName, { type: effectiveType });
    formData.append('file', fileToAppend);
  } else {
    // Web browser File/Blob handling
    formData.append('file', imageFile as any);
  }

  return formData;
}; 