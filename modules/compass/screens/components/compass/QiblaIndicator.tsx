import React from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

interface QiblaIndicatorProps {
  angle: number; // Angle in degrees where to position the indicator
  compassRadius: number; // Radius of the compass in pixels
}

const QiblaIndicator: React.FC<QiblaIndicatorProps> = ({ angle, compassRadius }) => {
  // Calculate the position on the edge of the circle
  // We need to convert angle to radians for Math.cos and Math.sin
  const radians = (angle * Math.PI) / 180;
  
  // Calculate the position for the indicator
  // The indicator should be positioned on the edge of the compass
  // We need to adjust for the indicator size (48px) to center it on the edge
  const indicatorSize = 48;
  const halfIndicatorSize = indicatorSize / 2;
  
  // Calculate position from center of compass
  const posX = compassRadius * Math.sin(radians);
  const posY = -compassRadius * Math.cos(radians);
  
  // Adjust to position the center of the indicator on the edge
  const centerX = posX - halfIndicatorSize;
  const centerY = posY - halfIndicatorSize;
  
  console.log('Qibla Indicator Position:', { angle, posX, posY, centerX, centerY });

  return (
    <View
      style={[
        styles.container,
        {
          left: compassRadius, // Position relative to compass center
          top: compassRadius,  // Position relative to compass center
          transform: [
            { translateX: centerX },
            { translateY: centerY },
          ],
        },
      ]}
    >
      <FastImage
        source={require('@/assets/compass/Kaaba.png')}
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
