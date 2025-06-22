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
  onImageUploaded?: (imageUrl: string) => Promise<void>;
  isUploading?: boolean;
}

const Camera = () => (
  <CdnSvg path="/assets/profile/camera.svg" width={24} height={24} />
);

const Avatar = ({imageUrl, userId, onImageUploaded, isUploading = false}: AvatarProps) => {
  const {shadows} = useThemeStore();

  const handleImageSelection = async () => {
    console.log('🖼️ === AVATAR IMAGE SELECTION STARTED ===');
    console.log('🖼️ Avatar camera button tapped');
    
    try {
      // Just call the parent's image selection handler
      if (onImageUploaded) {
        await onImageUploaded(imageUrl);
      }
    } catch (error: any) {
      console.error('❌ Avatar image selection failed:', error);
      Alert.alert('Selection Error', error.message || 'Failed to select image. Please try again.');
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
        resizeMode={FastImage.resizeMode.cover}
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
          {/* Loading indicator overlay when uploading */}
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