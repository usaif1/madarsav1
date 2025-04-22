import {Pressable} from 'react-native';
import React from 'react';

// assets
import Share from '@/assets/share-light.svg';

const ShareButton = () => {
  return (
    <Pressable>
      <Share />
    </Pressable>
  );
};

export default ShareButton;
