// src/modules/user/hooks/useUserProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { getUserDetails, updateUserDetails, updateUserNotifications, uploadFile, UserDetails, UserUpdateDTO, UserNotificationUpdateDTO, FileUploadResponse } from '../services/userService';
import { useAuthStore } from '@/modules/auth/store/authStore';

// Query keys
export const USER_QUERY_KEYS = {
  USER_DETAILS: 'userDetails',
  FILE_UPLOAD: 'fileUpload',
};

/**
 * Hook to fetch user details
 * @param userId - The user ID to fetch details for
 * @returns Query result with user details
 */
export const useUserDetails = (userId?: string) => {
  // Get the current user ID from auth store if not provided
  const { user } = useAuthStore();
  const currentUserId = userId || user?.id;

  const query = useQuery<UserDetails, Error>({
    queryKey: [USER_QUERY_KEYS.USER_DETAILS, currentUserId],
    queryFn: () => {
      if (!currentUserId) {
        throw new Error('User ID is required to fetch user details');
      }
      return getUserDetails(currentUserId);
    },
    enabled: !!currentUserId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Update the user in auth store when data changes, but only if the data actually changed
  useEffect(() => {
    const data = query.data;
    if (data && user) {
      // Check if data actually changed before updating the store
      const newName = `${data.firstName} ${data.lastName}`.trim();
      const newEmail = data.email;
      const newPhoto = data.profileImage;
      
      // Only update if something actually changed
      if (newName !== user.name || 
          newEmail !== user.email || 
          newPhoto !== user.photoUrl ||
          data.phone?.toString() !== user.phone ||
          data.gender !== user.gender ||
          data.dob !== user.dob ||
          data.city !== user.city ||
          data.country !== user.country) {
            
        useAuthStore.getState().setUser({
          ...user,
          name: newName,
          email: newEmail,
          photoUrl: newPhoto,
          // Add additional fields to the user object
          phone: data.phone?.toString(),
          gender: data.gender,
          dob: data.dob,
          city: data.city,
          country: data.country,
        });
      }
    }
  }, [query.data]);
  
  return query;
};

/**
 * Hook to update user details
 * @returns Mutation for updating user details
 */
export const useUpdateUserDetails = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation<UserDetails, Error, UserUpdateDTO>({
    mutationFn: updateUserDetails,
    onSuccess: (data) => {
      // Invalidate and refetch user details query
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEYS.USER_DETAILS, user?.id] });
      
      // Update the user in auth store with the new data, but only if necessary
      if (data && user) {
        // Check if data actually changed before updating the store
        const newName = `${data.firstName} ${data.lastName}`.trim();
        const newEmail = data.email;
        const newPhoto = data.profileImage;
        
        // Only update if something actually changed
        if (newName !== user.name || 
            newEmail !== user.email || 
            newPhoto !== user.photoUrl ||
            data.phone?.toString() !== user.phone ||
            data.gender !== user.gender ||
            data.dob !== user.dob ||
            data.city !== user.city ||
            data.country !== user.country) {
              
          useAuthStore.getState().setUser({
            ...user,
            name: newName,
            email: newEmail,
            photoUrl: newPhoto,
            // Add additional fields to the user object
            phone: data.phone?.toString(),
            gender: data.gender,
            dob: data.dob,
            city: data.city,
            country: data.country,
          });
        }
      }
    },
  });
};

/**
 * Hook to update user notification settings
 * @returns Mutation for updating user notification settings
 */
/**
 * Hook to upload file
 * @returns Mutation for uploading file
 */
export const useUploadFile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation<FileUploadResponse, Error, { userId: string; file: File | Blob }>({    
    mutationFn: async ({ userId, file }) => {
      // Log the incoming file details
      console.log('📤 Upload file details:', {
        fileType: file.type,
        fileSize: file.size,
        fileName: (file as File).name,
        isBlob: file instanceof Blob,
        isFile: file instanceof File
      });

      const formData = new FormData();
      
      // Add required parameters according to API docs
      formData.append('fileRequestType', 'PROFILE_IMAGE'); // Assuming this is for profile image
      formData.append('userId', userId);
      
      // For React Native, we need to properly structure the file object
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // Assuming file is from react-native-image-picker or similar
        const fileDetails = file as any; // Type assertion for mobile file object
        
        // Log mobile file details
        console.log('📱 Mobile file details:', {
          uri: fileDetails.uri,
          type: fileDetails.type,
          fileName: fileDetails.fileName,
          assets: fileDetails.assets
        });
        
        // If we have assets array (from image picker), use the first asset
        if (fileDetails.assets && fileDetails.assets[0]) {
          const asset = fileDetails.assets[0];
          formData.append('file', {
            uri: asset.uri,
            type: asset.type || 'image/jpeg',
            name: asset.fileName || 'profile.jpg',
          });
        } else {
          // Fallback to direct file details
          formData.append('file', {
            uri: fileDetails.uri,
            type: fileDetails.type || 'image/jpeg',
            name: fileDetails.fileName || 'profile.jpg',
          });
        }
      } else {
        // Web browser File/Blob handling
        formData.append('file', file);
      }

      // Log the FormData contents (for debugging)
      console.log('📦 FormData entries:');
      for (const [key, value] of (formData as any).entries()) {
        console.log(`${key}:`, value);
      }

      try {
        const response = await uploadFile(userId, formData);
        console.log('✅ Upload successful:', response);
        return response;
      } catch (error: any) {
        console.error('❌ Upload failed:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('🔄 Upload success, invalidating queries');
      // Invalidate and refetch user details query to get updated profile image
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEYS.USER_DETAILS, user.id] });
      }
    },
  });
};

/**
 * Hook to update user notification settings
 * @returns Mutation for updating user notification settings
 */
export const useUpdateUserNotifications = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation<UserDetails, Error, UserNotificationUpdateDTO>({
    mutationFn: updateUserNotifications,
    onSuccess: (data) => {
      // Invalidate and refetch user details query
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEYS.USER_DETAILS, user?.id] });
      
      // Update the user in auth store with the new notification settings
      if (data && user) {
        // We don't need to update the auth store with notification settings
        // as they're not part of the User interface, but we still want to
        // invalidate the query cache to ensure fresh data
      }
    },
  });
};
