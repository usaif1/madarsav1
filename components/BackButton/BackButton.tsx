import {Pressable} from 'react-native';
import React from 'react';

// assets
import ArrowLeft from '@/assets/arrow-left.svg';

const BackButton = () => {
  return (
    <Pressable>
      <ArrowLeft />
    </Pressable>
  );
};

export default BackButton;
