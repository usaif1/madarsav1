// src/design-system/responsive.ts
import {Dimensions, PixelRatio} from 'react-native';

const BASE_WIDTH = 375; // Base iPhone width
const BASE_HEIGHT = 812; // Base iPhone height

export const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} =
  Dimensions.get('window');

// Width-based scaling
export const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

// Height-based scaling
export const verticalScale = (size: number) =>
  (SCREEN_HEIGHT / BASE_HEIGHT) * size;

// Moderate scaling
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Responsive font size
export const responsiveFontSize = (size: number) => {
  const scaledSize = scale(size);
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};
