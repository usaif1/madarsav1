import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {useThemeStore} from '@/globalStore';

// assets
import Camera from '@/assets/profile/camera.svg';

const Avatar = () => {
  const {shadows} = useThemeStore();

  return (
    <View style={[styles.avatar, shadows.md1]}>
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
    justifyContent: 'center',
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
