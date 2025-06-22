import {Pressable} from 'react-native';
import React from 'react';

// components
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';

const ShareButton = () => {
  return (
    <Pressable>
      <CdnSvg path={DUA_ASSETS.COMPASS_SHARE} width={24} height={24} />
    </Pressable>
  );
};

export default ShareButton;
