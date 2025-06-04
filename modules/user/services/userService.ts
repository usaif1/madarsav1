// src/modules/user/services/userService.ts
import madrasaClient from '@/api/clients/madrasaClient';
import { MADRASA_API_ENDPOINTS } from '@/api/config/madrasaApiConfig';
import authService from '@/modules/auth/services/authService';

// User profile interfaces
export interface UserDetails {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number | null;
  gender: string;
  dob: string;
  profileImage: string;
  city: string;
  country: string;
  athanNotification: boolean;
  pushNotification: boolean;
}

export interface FileUploadResponse {
  fileExtension: string;
  fileLink: string;
  fileType: string;
}

export interface UserUpdateDTO {
  userId: string;
  firstName: string;
  lastName: string;
  dob?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: number;
  profileImage?: string;
}

export interface UserNotificationUpdateDTO {
  userId: string;
  athanNotification: boolean;
  pushNotification: boolean;
}

/**
 * Get user details by user ID
 * @param userId - The ID of the user
 * @returns Promise with user details
 */
export const getUserDetails = async (userId: string): Promise<UserDetails> => {
  try {
    console.log('🔍 Fetching user details for userId:', userId);
    const url = MADRASA_API_ENDPOINTS.GET_USER_DETAILS.replace('{userId}', userId);
    
    // Use executeWithTokenRefresh to handle token expiration
    const response = await authService.executeWithTokenRefresh(() => 
      madrasaClient.get<UserDetails>(url)
    );
    
    console.log('✅ User details fetched successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get user details:', error);
    throw error;
  }
};

/**
 * Update user details
 * @param userData - User data to update
 * @returns Promise with updated user details
 */
export const updateUserDetails = async (userData: UserUpdateDTO): Promise<UserDetails> => {
  try {
    console.log('🔄 Updating user details:', userData);
    
    // Use executeWithTokenRefresh to handle token expiration
    const response = await authService.executeWithTokenRefresh(() => 
      madrasaClient.put<UserDetails>(MADRASA_API_ENDPOINTS.UPDATE_USER_DETAILS, userData)
    );
    
    console.log('✅ User details updated successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to update user details:', error);
    throw error;
  }
};

/**
 * Update user notification settings
 * @param notificationData - User notification settings to update
 * @returns Promise with updated user details
 */
export const updateUserNotifications = async (notificationData: UserNotificationUpdateDTO): Promise<UserDetails> => {
  try {
    console.log('🔔 Updating user notification settings:', notificationData);
    
    // Use executeWithTokenRefresh to handle token expiration
    const response = await authService.executeWithTokenRefresh(() => 
      madrasaClient.put<UserDetails>(MADRASA_API_ENDPOINTS.UPDATE_USER_NOTIFICATIONS, notificationData)
    );
    
    console.log('✅ User notification settings updated successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to update user notification settings:', error);
    throw error;
  }
};

/**
 * Upload file to server
 * @param userId - The ID of the user
 * @param file - The file to upload
 * @returns Promise with file upload response
 */
export const uploadFile = async (userId: string, file: FormData): Promise<FileUploadResponse> => {
  try {
    console.log('📤 Uploading file for userId:', userId);
    
    // Use executeWithTokenRefresh to handle token expiration
    const response = await authService.executeWithTokenRefresh(() => 
      madrasaClient.post<FileUploadResponse>(
        `${MADRASA_API_ENDPOINTS.UPLOAD_FILE}?userId=${userId}`,
        file,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
    );
    
    console.log('✅ File uploaded successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to upload file:', error);
    throw error;
  }
};

export default {
  getUserDetails,
  updateUserDetails,
  updateUserNotifications,
  uploadFile,
};
