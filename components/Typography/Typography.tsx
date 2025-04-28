// src/components/typography/TextComponents.tsx
import React from 'react';
import {Text as RNText, TextProps} from 'react-native';
import {
  typography,
  TypographyColor,
  TypographyColorKeys,
} from '@/theme/typography';

type TypographyProps = TextProps & {
  children: React.ReactNode;
  style?: TextProps['style'];
  color?: TypographyColorKeys;
};

// Enhanced component factory with proper typing
const createTextComponent = (
  variant: keyof typeof typography,
): React.ComponentType<TypographyProps> => {
  return React.memo(
    React.forwardRef<RNText, TypographyProps>(
      ({children, style, color = 'heading', ...props}, ref) => (
        <RNText
          ref={ref}
          style={[typography[variant], {color: TypographyColor[color]}, style]}
          {...props}>
          {children}
        </RNText>
      ),
    ),
  );
};

// Heading Components
export const H1Regular = createTextComponent('h1Regular');
export const H1Medium = createTextComponent('h1Medium');
export const H1Bold = createTextComponent('h1Bold');

export const H2Regular = createTextComponent('h2Regular');
export const H2Medium = createTextComponent('h2Medium');
export const H2Bold = createTextComponent('h2Bold');

export const H3Regular = createTextComponent('h3Regular');
export const H3Medium = createTextComponent('h3Medium');
export const H3Bold = createTextComponent('h3Bold');

export const H4Regular = createTextComponent('h4Regular');
export const H4Medium = createTextComponent('h4Medium');
export const H4Bold = createTextComponent('h4Bold');

export const H5Regular = createTextComponent('h5Regular');
export const H5Medium = createTextComponent('h5Medium');
export const H5Bold = createTextComponent('h5Bold');

// Title Components
export const Title1Regular = createTextComponent('title1Regular');
export const Title1Medium = createTextComponent('title1Medium');
export const Title1Bold = createTextComponent('title1Bold');
export const Title3Bold = createTextComponent('title3Bold');

export const Body1Title2Regular = createTextComponent('title2_body1Regular');
export const Body1Title2Medium = createTextComponent('title2_body1Medium');
export const Body1Title2Bold = createTextComponent('title2_body1Bold');

// Body Components
export const Body2Regular = createTextComponent('body2Regular');
export const Body2Medium = createTextComponent('body2Medium');
export const Body2Bold = createTextComponent('body2Bold');

// Caption Components
export const CaptionRegular = createTextComponent('captionRegular');
export const CaptionMedium = createTextComponent('captionMedium');
export const CaptionBold = createTextComponent('captionBold');
