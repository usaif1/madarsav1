import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {useThemeStore} from '@/globalStore';

// assets
import Camera from '@/assets/profile/camera.svg';
import FastImage from 'react-native-fast-image';

const Avatar = ({imageUrl}: {imageUrl: string}) => {
  const {shadows} = useThemeStore();

  return (
    <View style={[styles.avatar, shadows.md1]}>
      <FastImage
        source={imageUrl ? {uri: imageUrl} : require('@/assets/profile/face.png')}
        resizeMode={FastImage.resizeMode.contain}
        style={{width: 100, height: 100}}
      />
      <Pressable style={styles.cameraBtn}>
        <Camera />
      </Pressable>
    </View>
  );
};

export default Avatar;

const AVATAR_SIZE = 100;
const CAMERA_SIZE = 38;

const styles = StyleSheet.create({
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  cameraBtn: {
    width: CAMERA_SIZE,
    height: CAMERA_SIZE,
    borderRadius: 100,
    backgroundColor: '#8A57DC',
    position: 'absolute',
    bottom: -CAMERA_SIZE / 2 + 8,
    left: '50%',
    transform: [{translateX: -CAMERA_SIZE / 2}],
    right: 0,
    margin: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
