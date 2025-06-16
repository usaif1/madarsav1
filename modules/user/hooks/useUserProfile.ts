// src/modules/user/hooks/useUserProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { getUserDetails, updateUserDetails, updateUserNotifications, uploadFile, UserDetails, UserUpdateDTO, UserNotificationUpdateDTO, FileUploadResponse } from '../services/userService';
import { useAuthStore } from '@/modules/auth/store/authStore';

// Type for React Native image picker response
type ImageFile = {
  uri: string;
  type?: string;
  fileName?: string;
};

// Type for form data file value
type FormDataFileValue = {
  uri: string;
  type: string;
  name: string;
};

// Type guard to check if a value is an ImageFile
const isImageFile = (value: any): value is ImageFile => {
  return value && typeof value.uri === 'string';
};

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
// Type for React Native image picker response (already defined, ensure it's available or define if not)
// type ImageFile = {
//   uri: string;
//   type?: string;
//   fileName?: string;
// };

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation<FileUploadResponse, Error, { userId: string; file: File | Blob | ImageFile }>({    
    mutationFn: async ({ userId, file }) => {
      // Log the incoming file details safely
      let fileDetailsForLog: any = {
        isBlob: file instanceof Blob,
        isFile: file instanceof File,
        isImageFile: isImageFile(file),
      };
      if (file instanceof File) {
        fileDetailsForLog.fileType = file.type;
        fileDetailsForLog.fileSize = file.size;
        fileDetailsForLog.fileName = file.name;
      } else if (file instanceof Blob) { // Blob but not File
        fileDetailsForLog.fileType = file.type;
        fileDetailsForLog.fileSize = file.size;
      } else if (isImageFile(file)) { // ImageFile
        fileDetailsForLog.fileType = file.type;
        fileDetailsForLog.fileName = file.fileName;
        fileDetailsForLog.uri = file.uri;
      }
      console.log('📤 Upload file details:', fileDetailsForLog);

      try {
        // Create FormData instance
        const formData = new FormData();
        
        const fileRequestType = 'PUBLIC_PROFILE_PHOTO';
        const currentUserId = userId;

        if (process.env.NODE_ENV === 'development') {
          console.log('📦 Logging FormData parts before appending (useUserProfile.ts):');
          console.log(`  fileRequestType to append: ${fileRequestType}`);
          console.log(`  userId to append: ${currentUserId}`);
        }

        // Add required fields first
        formData.append('fileRequestType', fileRequestType);
        formData.append('userId', currentUserId);
        
        // For React Native, we need to properly structure the file object
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          const imageFile = file as ImageFile; // 'file' is ImageFile on mobile

          if (!isImageFile(imageFile)) {
            throw new Error('Invalid file format for mobile upload. Expected ImageFile.');
          }
          
          console.log('📱 Mobile file details:', {
            uri: imageFile.uri,
            type: imageFile.type,
            fileName: imageFile.fileName
          });
          
          const fileUri = Platform.OS === 'android' && !imageFile.uri.startsWith('file://') 
            ? `file://${imageFile.uri}` 
            : imageFile.uri;

          // Fetch the file content and convert to blob
          const fetchResponse = await fetch(fileUri);
          const blob = await fetchResponse.blob();

          const fileName = imageFile.fileName || imageFile.uri.split('/').pop() || 'profile.jpg';
          const effectiveType = (blob.type && blob.type !== 'application/octet-stream') ? blob.type : (imageFile.type || 'image/jpeg');
          
          // Create a File object from the blob to ensure name and type are correctly set
          const fileToAppend = new File([blob], fileName, { type: effectiveType });

          if (process.env.NODE_ENV === 'development') {
            console.log(`  Mobile file to append: [File] name="${fileToAppend.name}" type="${fileToAppend.type}" size=${fileToAppend.size}`);
          }
          formData.append('file', fileToAppend);

        } else {
          // Web browser File/Blob handling
          if (!(file instanceof File || file instanceof Blob)) {
            throw new Error('Invalid file format for web upload. Expected File or Blob.');
          }
          const webFileToAppend = file as File | Blob;
          if (process.env.NODE_ENV === 'development') {
            if (webFileToAppend instanceof File) {
              console.log(`  Web file to append: [File] name="${webFileToAppend.name}" type="${webFileToAppend.type}" size=${webFileToAppend.size}`);
            } else {
              console.log(`  Web file to append: [Blob] type="${webFileToAppend.type}" size=${webFileToAppend.size}`);
            }
          }
          formData.append('file', webFileToAppend);
        }

        // Log FormData contents safely
        console.log('📦 FormData contents:', {
          fileRequestType: 'PUBLIC_PROFILE_PHOTO',
          userId,
          file: Platform.OS === 'web' ? (file as File | Blob) : {
            uri: isImageFile(file) ? file.uri : 'unknown',
            type: isImageFile(file) ? file.type || 'image/jpeg' : 'unknown',
            name: isImageFile(file) ? file.fileName || 'profile.jpg' : 'unknown'
          }
        });

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
        console.error('❌ Upload failed error:', error);
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
