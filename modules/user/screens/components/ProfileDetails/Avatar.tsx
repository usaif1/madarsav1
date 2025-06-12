import {Pressable, StyleSheet, View, Alert, Platform} from 'react-native';
import React from 'react';
import {useThemeStore} from '@/globalStore';
import { CdnSvg } from '@/components/CdnSvg';
import FastImage from 'react-native-fast-image';
import { ImagePickerHelper } from '@/modules/user/utils/imagePickerHelper';
import { uploadFile, prepareImageForUpload } from '@/modules/user/services/imageUploadService';
import { Linking } from 'react-native';

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
    try {
      // First check if we have necessary permissions
      const hasCameraPermission = await ImagePickerHelper.requestCameraPermissions();
      const hasStoragePermission = await ImagePickerHelper.requestStoragePermissions();

      if (!hasCameraPermission || !hasStoragePermission) {
        Alert.alert(
          'Permissions Required',
          'Camera and storage permissions are required to update your profile picture. Please enable them in your device settings.',
          [
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
        return;
      }

      // Now that we have permissions, show image picker options
      const selectedImage = await ImagePickerHelper.showImagePickerOptions();
      
      if (!selectedImage) {
        return;
      }

      setIsUploading(true);
      
      try {
        // Prepare form data
        const formData = await prepareImageForUpload(selectedImage, userId);

        // Upload image
        const response = await uploadFile(userId, formData);
        
        // Call success callback
        onImageUploaded?.(response.fileLink);
      } catch (error: any) {
        console.error('Upload error:', error);
        Alert.alert('Error', error.message || 'Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    } catch (error: any) {
      console.error('Image selection error:', error);
      Alert.alert('Error', error.message || 'Failed to select image');
      setIsUploading(false);
    }
  };

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
});