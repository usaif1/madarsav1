import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { scale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body1Title2Bold } from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';

interface BubbleIndexProps {
  number: number;
}

// Fixed size bubble with dynamic text size
const BubbleIndex = memo(({ number }: BubbleIndexProps) => {
  const numberStr = number.toString();
  const digitCount = numberStr.length;
  
  // Fixed bubble size - always the same
  const bubbleSize = 26;
  
  // Dynamic font size based on digit count - decreases as digits increase
  const getFontSize = (digits: number): number => {
    switch (digits) {
      case 1: return 12;  // Single digit (1-9)
      case 2: return 10;  // Double digit (10-99)
      case 3: return 8;   // Triple digit (100-999)
      default: return 7;  // 4+ digits (very rare but handled)
    }
  };
  
  const fontSize = getFontSize(digitCount);
  
  return (
    <View style={[styles.bubbleContainer, { 
      width: scale(bubbleSize),
      height: scale(bubbleSize) 
    }]}>
      <CdnSvg 
        path={DUA_ASSETS.BUBBLE}
        width={scale(bubbleSize)}
        height={scale(bubbleSize)}
      />
      <Body1Title2Bold style={[
        styles.bubbleNumber, 
        { 
          fontSize: scale(fontSize),
        }
      ]}>
        {number}
      </Body1Title2Bold>
    </View>
  );
});

const styles = StyleSheet.create({
  bubbleContainer: {
    position: 'relative',
    marginTop: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleNumber: {
    position: 'absolute',
    color: ColorPrimary.primary600,
    fontWeight: '700',
    textAlign: 'center',
    // Perfect centering for the fixed bubble size
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -scale(6) }, // Half of approximate text width
      { translateY: -scale(6) }  // Half of approximate text height
    ],
  },
});

export { BubbleIndex };