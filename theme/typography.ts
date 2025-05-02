// src/design-system/typography.ts
import {TextStyle} from 'react-native';
import {responsiveFontSize} from './responsive';

// Utility function to convert percentage to line height
const percentageToLineHeight = (
  fontSize: number,
  percentageString: string = '120%',
): number => {
  const percentage = parseInt(percentageString, 10) / 100;
  return fontSize * percentage;
};

// Font family mappings
const fontFamilies = {
  regular: 'Geist-Regular',
  medium: 'Geist-Medium',
  bold: 'Geist-Bold',
} as const;

// Base font sizes and line heights
const BASE_STYLES = {
  h1: 42,
  h2: 35,
  h3: 29,
  h4: 24,
  h5: 20,
  title1: 17,
  title2_body1: 14,
  title3: 17,
  body2: 12,
  caption: 10,
} as const;

// Generate base typography with responsive sizes
type TypographyBase = {
  [Key in keyof typeof BASE_STYLES]: {
    fontSize: number;
    lineHeight: number;
  };
};

const createTypographyBase = (): TypographyBase =>
  (Object.entries(BASE_STYLES) as [keyof TypographyBase, number][]).reduce(
    (acc, [key, size]) => ({
      ...acc,
      [key]: {
        fontSize: responsiveFontSize(size),
        lineHeight: percentageToLineHeight(responsiveFontSize(size)),
      },
    }),
    {} as TypographyBase,
  );

const typographyBase = createTypographyBase();

// Generate variant types programmatically
type VariantKeys = keyof typeof BASE_STYLES;
type WeightSuffix = 'Regular' | 'Medium' | 'Bold';
type Typography = {
  [Key in VariantKeys as `${Key}${WeightSuffix}`]: TextStyle;
};

export enum TypographyColor {
  'heading' = '#171717',
  'sub-heading' = '#737373',
  'black' = '#000000',
  'grey' = '#171C22',
  'primary' = '#8A57DC',
  'secondary' = '#808080',
  'white' = '#FFFFFF',
  'yellow-700' = '#9A7E2A',
  'yellow-800' = '#6D591D',
  'warning' = '#DC6803',
  'accent-yellow-900' = '#5E4B1C',
}

export type TypographyColorKeys =
  | 'heading'
  | 'sub-heading'
  | 'black'
  | 'grey'
  | 'primary'
  | 'white'
  | 'secondary'
  | 'yellow-700'
  | 'yellow-800'
  | 'warning'
  | 'accent-yellow-900'

// Factory function to create typography variants
const createTypographyVariants = (): Typography =>
  (Object.entries(typographyBase) as [VariantKeys, TextStyle][]).reduce(
    (acc, [baseKey, baseStyle]) => {
      const variants = {
        [`${baseKey}Regular`]: {
          ...baseStyle,
          fontFamily: fontFamilies.regular,
        },
        [`${baseKey}Medium`]: {
          ...baseStyle,
          fontFamily: fontFamilies.medium,
        },
        [`${baseKey}Bold`]: {
          ...baseStyle,
          fontFamily: fontFamilies.bold,
        },
      };
      return {...acc, ...variants};
    },
    {} as Typography,
  );

export const typography = createTypographyVariants();
