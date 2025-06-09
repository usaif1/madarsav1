import {Pressable, StyleSheet, View, Alert, Platform} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {useUploadFile} from '@/modules/user/hooks/useUserProfile';
import React from 'react';
import {useThemeStore} from '@/globalStore';

// assets
import { CdnSvg } from '@/components/CdnSvg';
import FastImage from 'react-native-fast-image';

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
  const {mutate: uploadFile, isPending} = useUploadFile();

  const handleImageSelection = () => {
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.7,
    };

    Alert.alert(
      'Update Profile Picture',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => {
            ImagePicker.launchCamera(options, handleImageResponse);
          },
        },
        {
          text: 'Choose from Library',
          onPress: () => {
            ImagePicker.launchImageLibrary(options, handleImageResponse);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  const handleImageResponse = (response: ImagePicker.ImagePickerResponse) => {
    if (response.didCancel || response.errorCode || !response.assets?.[0]) {
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      }
      return;
    }

    const selectedImage = response.assets[0];
    
    // Create file object for upload
    const fileToUpload = {
      uri: Platform.OS === 'ios' ? selectedImage.uri?.replace('file://', '') : selectedImage.uri,
      type: selectedImage.type || 'image/jpeg',
      name: selectedImage.fileName || 'image.jpg',
    } as any;

    // Upload image
    uploadFile(
      { userId, file: fileToUpload },
      {
        onSuccess: (data) => {
          onImageUploaded?.(data.fileLink);
        },
        onError: (error: Error) => {
          Alert.alert('Error', error.message);
        },
      },
    );
  };

  return (
    <View style={[styles.avatar, shadows.md1]}>
      <FastImage
  source={imageUrl 
    ? { uri: imageUrl } 
    : { 
        uri: 'https://cdn.madrasaapp.com/assets/profile/face.png',
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable,
      }
  }
  resizeMode={FastImage.resizeMode.contain}
  style={[styles.avatar, {width: 100, height: 100}]}
/>
      <Pressable 
        style={[styles.cameraBtn, isPending && styles.disabledBtn]}
        onPress={handleImageSelection}
        disabled={isPending}>
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
    borderWidth:4,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:'lightgrey'
  },

  cameraBtn: {
    width: CAMERA_SIZE,
    height: CAMERA_SIZE,
    borderRadius: 100,
    backgroundColor: '#8A57DC',
    position: 'absolute',
    bottom: -CAMERA_SIZE / 2 ,
    left: '50%',
    transform: [{translateX: -CAMERA_SIZE / 2}],
    right: 0,
    margin: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
