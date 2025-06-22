import React from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';

interface QiblaIndicatorProps {
  angle: number; // Angle in degrees where to position the indicator
  compassRadius: number; // Radius of the compass in pixels
}

const QiblaIndicator: React.FC<QiblaIndicatorProps> = ({ angle, compassRadius }) => {
  // Calculate the position on the edge of the circle
  // We need to convert angle to radians for Math.cos and Math.sin
  const radians = (angle * Math.PI) / 180;
  
  // The compass frame is 280x280, so its radius is 140
  // The frame is positioned at (10, 10) within the 300x300 wrapper
  // So the center of the frame is at (150, 150) relative to the wrapper
  const actualCompassRadius = 140; // Half of 280px frame size
  const compassCenterX = 210; // 10 + 140 (frame position + frame radius)
  const compassCenterY = 230; // 10 + 140 (frame position + frame radius)
  
  // Calculate position on the circumference of the actual compass frame
  const posX = actualCompassRadius * Math.sin(radians);
  const posY = -actualCompassRadius * Math.cos(radians);
  
  // The indicator should be positioned on the edge of the compass
  // We need to adjust for the indicator size (48px) to center it on the edge
  const indicatorSize = 48;
  const halfIndicatorSize = indicatorSize / 2;
  
  // Adjust to position the center of the indicator on the edge
  const centerX = posX - halfIndicatorSize;
  const centerY = posY - halfIndicatorSize;
  
  console.log('Qibla Indicator Position:', { 
    angle, 
    actualCompassRadius,
    compassCenterX, 
    compassCenterY,
    posX, 
    posY, 
    centerX, 
    centerY 
  });

  return (
    <View
      style={[
        styles.container,
        {
          // Position relative to the actual center of the compass frame
          left: compassCenterX,
          top: compassCenterY,
          transform: [
            { translateX: centerX },
            { translateY: centerY },
          ],
        },
      ]}
    >
      <FastImage
        source={{ uri: getCdnUrl(DUA_ASSETS.COMPASS_KAABA) }}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2.9,
    borderColor: '#FFFFFF',
    padding: 9.67,
    backgroundColor: '#FEF0C7', // Warning-200 color
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow properties that work on both iOS and Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android
    // Make sure the indicator is visible on top of other elements
    zIndex: 10,
  },
  image: {
    width: 34,
    height: 28,
  },
});

export default QiblaIndicator;
