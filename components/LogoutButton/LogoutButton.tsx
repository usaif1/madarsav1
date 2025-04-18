import {Pressable} from 'react-native';
import React from 'react';

// assets
import LogoutMadarsa from '@/assets/logout.svg';

const LogoutButton = () => {
  return (
    <Pressable>
      <LogoutMadarsa />
    </Pressable>
  );
};

export default LogoutButton;
