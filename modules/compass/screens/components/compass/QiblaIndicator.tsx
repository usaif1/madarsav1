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
  
  // Calculate the center position of the indicator
  // The indicator should be positioned on the edge of the compass
  // We subtract half the indicator size to center it
  const centerX = compassRadius * Math.sin(radians) - 24;
  const centerY = -compassRadius * Math.cos(radians) - 24;

  return (
    <View
      style={[
        styles.container,
        {
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
    borderRadius: 96.65,
    borderWidth: 2.9,
    borderColor: '#FFFFFF',
    padding: 9.67,
    backgroundColor: '#FEF0C7', // Warning-200 color
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for the top light effect
    shadowColor: 'var(--Tokensborder-light)',
    shadowOffset: { width: 0, height: -0.97 },
    shadowOpacity: 1,
    shadowRadius: 5.8,
    // Shadow for the bottom effect
    elevation: 10, // For Android
    // We can't directly apply two shadows in React Native, so we use elevation for the second shadow on Android
  },
  image: {
    width: 34,
    height: 28,
  },
});

export default QiblaIndicator;
