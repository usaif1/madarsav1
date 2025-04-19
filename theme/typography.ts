// // dependencies
// import {TextStyle} from 'react-native';

// // utils
// import {responsiveFontSize} from './responsive';

// // Utility function to convert percentage to line height
// const percentageToLineHeight = (
//   fontSize: number,
//   percentageString: string,
// ): number => {
//   const percentage = parseInt(percentageString, 10) / 100;
//   return fontSize * percentage;
// };

// type TypographyBase = {
//   h1: TextStyle;
//   h2: TextStyle;
//   h3: TextStyle;
//   h4: TextStyle;
//   h5: TextStyle;
//   title1: TextStyle;
//   title2_body1: TextStyle;
//   body2: TextStyle;
//   caption: TextStyle;
// };

// type Typography = {
//   // Heading 1
//   h1Regular: TextStyle;
//   h1Medium: TextStyle;
//   h1Bold: TextStyle;

//   // Heading 2
//   h2Regular: TextStyle;
//   h2Medium: TextStyle;
//   h2Bold: TextStyle;

//   // Heading 3
//   h3Regular: TextStyle;
//   h3Medium: TextStyle;
//   h3Bold: TextStyle;

//   // Heading 4
//   h4Regular: TextStyle;
//   h4Medium: TextStyle;
//   h4Bold: TextStyle;

//   // Heading 5
//   h5Regular: TextStyle;
//   h5Medium: TextStyle;
//   h5Bold: TextStyle;

//   // Title 1
//   title1Regular: TextStyle;
//   title1Medium: TextStyle;
//   title1Bold: TextStyle;

//   // Title 2 / Body 1
//   title2_body1Regular: TextStyle;
//   title2_body1Medium: TextStyle;
//   title2_body1Bold: TextStyle;

//   // Body 2
//   body2Regular: TextStyle;
//   body2Medium: TextStyle;
//   body2Bold: TextStyle;

//   // Caption
//   captionRegular: TextStyle;
//   captionMedium: TextStyle;
//   captionBold: TextStyle;
// };

// const typographyBase: TypographyBase = {
//   h1: {
//     fontSize: responsiveFontSize(42),
//     lineHeight: percentageToLineHeight(42, '120%'),
//   },
//   h2: {
//     fontSize: responsiveFontSize(35),
//     lineHeight: percentageToLineHeight(35, '120%'),
//   },
//   h3: {
//     fontSize: responsiveFontSize(29),
//     lineHeight: percentageToLineHeight(29, '120%'),
//   },
//   h4: {
//     fontSize: responsiveFontSize(24),
//     lineHeight: percentageToLineHeight(24, '120%'),
//   },
//   h5: {
//     fontSize: responsiveFontSize(20),
//     lineHeight: percentageToLineHeight(20, '120%'),
//   },
//   title1: {
//     fontSize: responsiveFontSize(17),
//     lineHeight: percentageToLineHeight(17, '120%'),
//   },
//   title2_body1: {
//     fontSize: responsiveFontSize(14),
//     lineHeight: percentageToLineHeight(14, '120%'),
//   },
//   body2: {
//     fontSize: responsiveFontSize(12),
//     lineHeight: percentageToLineHeight(12, '120%'),
//   },
//   caption: {
//     fontSize: responsiveFontSize(10),
//     lineHeight: percentageToLineHeight(10, '120%'),
//   },
// };

// export const typography: Typography = {
//   // H1 Variants
//   h1Regular: {
//     ...typographyBase.h1,
//     fontFamily: 'Geist-Regular',
//   },
//   h1Medium: {
//     ...typographyBase.h1,
//     fontFamily: 'Geist-Medium',
//   },
//   h1Bold: {
//     ...typographyBase.h1,
//     fontFamily: 'Geist-Bold',
//   },

//   // H2 Variants
//   h2Regular: {
//     ...typographyBase.h2,
//     fontFamily: 'Geist-Regular',
//   },
//   h2Medium: {
//     ...typographyBase.h2,
//     fontFamily: 'Geist-Medium',
//   },
//   h2Bold: {
//     ...typographyBase.h2,
//     fontFamily: 'Geist-Bold',
//   },

//   // H3 Variants
//   h3Regular: {
//     ...typographyBase.h3,
//     fontFamily: 'Geist-Regular',
//   },
//   h3Medium: {
//     ...typographyBase.h3,
//     fontFamily: 'Geist-Medium',
//   },
//   h3Bold: {
//     ...typographyBase.h3,
//     fontFamily: 'Geist-Bold',
//   },

//   // H4 Variants
//   h4Regular: {
//     ...typographyBase.h4,
//     fontFamily: 'Geist-Regular',
//   },
//   h4Medium: {
//     ...typographyBase.h4,
//     fontFamily: 'Geist-Medium',
//   },
//   h4Bold: {
//     ...typographyBase.h4,
//     fontFamily: 'Geist-Bold',
//   },

//   // H5 Variants
//   h5Regular: {
//     ...typographyBase.h5,
//     fontFamily: 'Geist-Regular',
//   },
//   h5Medium: {
//     ...typographyBase.h5,
//     fontFamily: 'Geist-Medium',
//   },
//   h5Bold: {
//     ...typographyBase.h5,
//     fontFamily: 'Geist-Bold',
//   },

//   // Title1 Variants
//   title1Regular: {
//     ...typographyBase.title1,
//     fontFamily: 'Geist-Regular',
//   },
//   title1Medium: {
//     ...typographyBase.title1,
//     fontFamily: 'Geist-Medium',
//   },
//   title1Bold: {
//     ...typographyBase.title1,
//     fontFamily: 'Geist-Bold',
//   },

//   // Title2/Body1 Variants
//   title2_body1Regular: {
//     ...typographyBase.title2_body1,
//     fontFamily: 'Geist-Regular',
//   },
//   title2_body1Medium: {
//     ...typographyBase.title2_body1,
//     fontFamily: 'Geist-Medium',
//   },
//   title2_body1Bold: {
//     ...typographyBase.title2_body1,
//     fontFamily: 'Geist-Bold',
//   },

//   // Body2 Variants
//   body2Regular: {
//     ...typographyBase.body2,
//     fontFamily: 'Geist-Regular',
//   },
//   body2Medium: {
//     ...typographyBase.body2,
//     fontFamily: 'Geist-Medium',
//   },
//   body2Bold: {
//     ...typographyBase.body2,
//     fontFamily: 'Geist-Bold',
//   },

//   // Caption Variants
//   captionRegular: {
//     ...typographyBase.caption,
//     fontFamily: 'Geist-Regular',
//   },
//   captionMedium: {
//     ...typographyBase.caption,
//     fontFamily: 'Geist-Medium',
//   },
//   captionBold: {
//     ...typographyBase.caption,
//     fontFamily: 'Geist-Bold',
//   },
// };

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
}

export type TypographyColorKeys =
  | 'heading'
  | 'sub-heading'
  | 'black'
  | 'grey'
  | 'primary'
  | 'secondary';

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