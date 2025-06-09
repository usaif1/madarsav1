// components/CdnSvg.tsx
import React from 'react';
import { SvgProps } from 'react-native-svg';
import { SvgUri } from 'react-native-svg';
import { scale } from '@/theme/responsive';

const CDN_BASE_URL = 'https://cdn.madrasaapp.com';

interface CdnSvgProps extends SvgProps {
  path: string;
  width?: number;
  height?: number;
}

export const CdnSvg = ({ path, width = 24, height = 24, ...props }: CdnSvgProps) => {
  return (
    <SvgUri
      width={scale(width)}
      height={scale(height)}
      uri={`${CDN_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`}
      {...props}
    />
  );
};