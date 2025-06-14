import {Pressable, StyleSheet, View, Alert} from 'react-native';
import React from 'react';
import {useThemeStore} from '@/globalStore';
import { CdnSvg } from '@/components/CdnSvg';
import FastImage from 'react-native-fast-image';
import { ImagePickerHelper } from '@/modules/user/utils/imagePickerHelper';
import { uploadFile, prepareImageForUpload, validateImageFile } from '@/modules/user/services/imageUploadService';

interface AvatarProps {
  imageUrl: string;
  userId: string;
  onImageUploaded?: (fileUrl: string) => void;
}

const Camera = () => (
  <CdnSvg path="/assets/profile/camera.svg" width={24} height={24} />
);

const Avatar = ({imageUrl, userId, onImageUploaded}: AvatarProps) => {
  const {shadows} = useThemeStore();
  const [isUploading, setIsUploading] = React.useState(false);

  const handleImageSelection = async () => {
    console.log('🖼️ === AVATAR IMAGE SELECTION STARTED ===');
    console.log('🖼️ Step 1: User tapped camera button');
    console.log('🖼️ Step 2: Current userId:', userId);
    
    try {
      console.log('🖼️ Step 3: Showing image picker options...');
      
      // Show image picker options
      const selectedImage = await ImagePickerHelper.showImagePickerOptions();
      
      if (!selectedImage) {
        console.log('🖼️ Step 4: User cancelled image selection');
        return;
      }

      console.log('🖼️ Step 4: Image selected successfully:', {
        uri: selectedImage.uri,
        type: selectedImage.type,
        name: selectedImage.name
      });

      console.log('🖼️ Step 5: Validating selected image...');
      
      // Validate the selected image
      const imageFile = {
        uri: selectedImage.uri,
        type: selectedImage.type,
        fileName: selectedImage.name
      };
      
      if (!validateImageFile(imageFile)) {
        console.error('❌ Image validation failed');
        Alert.alert('Error', 'Invalid image format. Please select a JPG, PNG, GIF, or WebP image.');
        return;
      }
      
      console.log('✅ Image validation passed');
      console.log('🖼️ Step 6: Setting upload state to loading...');
      setIsUploading(true);
      
      try {
        console.log('🖼️ Step 7: Preparing FormData for upload...');
        
        // Prepare form data
        const formData = await prepareImageForUpload(imageFile, userId);
        
        console.log('🖼️ Step 8: FormData prepared, starting upload...');

        // Upload image
        const response = await uploadFile(userId, formData);
        
        console.log('✅ === AVATAR UPLOAD SUCCESSFUL ===');
        console.log('🖼️ Step 9: Upload response:', response);
        
        // Call success callback
        console.log('🖼️ Step 10: Calling success callback with file URL:', response.fileLink);
        onImageUploaded?.(response.fileLink);
        
        Alert.alert('Success', 'Profile image updated successfully!');
        
      } catch (error: any) {
        console.error('❌ === AVATAR UPLOAD FAILED ===');
        console.error('❌ Upload error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        
        Alert.alert('Upload Error', error.message || 'Failed to upload image. Please try again.');
      } finally {
        console.log('🖼️ Step 11: Resetting upload state...');
        setIsUploading(false);
      }
    } catch (error: any) {
      console.error('❌ === IMAGE SELECTION FAILED ===');
      console.error('❌ Image selection error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      Alert.alert('Selection Error', error.message || 'Failed to select image. Please try again.');
      setIsUploading(false);
    }
  };

  console.log('🖼️ Avatar component rendered:', {
    hasImageUrl: !!imageUrl,
    userId: userId,
    isUploading
  });

  return (
    <View style={[styles.avatar, shadows.md1]}>
      <FastImage
        source={imageUrl 
          ? { uri: imageUrl } 
          : { 
              uri: 'https://cdn.madrasaapp.com/assets/home/blank-profile-picture.png',
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }
        }
        resizeMode={FastImage.resizeMode.contain}
        style={[styles.avatar, {width: 100, height: 100}]}
      />
      <Pressable 
        style={[styles.cameraBtn, isUploading && styles.disabledBtn]}
        onPress={handleImageSelection}
        disabled={isUploading}>
        <Camera />
      </Pressable>
      {isUploading && (
        <View style={styles.uploadingOverlay}>
          {/* You could add a loading spinner here if desired */}
        </View>
      )}
    </View>
  );
};

export default Avatar;

const AVATAR_SIZE = 100;
const CAMERA_SIZE = 38;

const styles = StyleSheet.create({
  disabledBtn: {
    opacity: 0.7,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderWidth: 4,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'lightgrey'
  },
  cameraBtn: {
    width: CAMERA_SIZE,
    height: CAMERA_SIZE,
    borderRadius: 100,
    backgroundColor: '#8A57DC',
    position: 'absolute',
    bottom: -CAMERA_SIZE / 2,
    left: '50%',
    transform: [{translateX: -CAMERA_SIZE / 2}],
    right: 0,
    margin: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(138, 87, 220, 0.1)',
    borderRadius: 50,
  },
});