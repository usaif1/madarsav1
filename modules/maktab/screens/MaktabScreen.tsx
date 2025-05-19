import React from 'react';
import { View, StyleSheet, Text, Image, ImageBackground } from 'react-native';
import { Body1Title2Bold, Body1Title2Medium } from '@/components';
import { scale, verticalScale } from '@/theme/responsive';
import LinearGradient from 'react-native-linear-gradient';

// Import assets
import MaktabTopDesign from '@/assets/maktab/maktab-top-design.svg';

const MaktabScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Top header with background image */}
      <ImageBackground 
        source={require('@/assets/maktab/maktab-header-image.png')} 
        style={styles.headerImage}
        imageStyle={{ opacity: 0.5 }}
      >
        {/* SVG Top Design - rotated 90 degrees */}
        <View style={styles.topDesignContainer}>
          <MaktabTopDesign width={scale(190)} height={scale(95)} style={styles.topDesign} />
        </View>
        
        {/* Circle with calendar icon */}
        <View style={styles.circleContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F2DEFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.circle}
          >
            <Image 
              source={require('@/assets/maktab/maktab-calendar.png')} 
              style={styles.calendarIcon} 
              resizeMode="contain"
            />
          </LinearGradient>
        </View>
      </ImageBackground>
      
      {/* Content */}
      <View style={styles.contentContainer}>
        <Body1Title2Bold style={styles.title}>Maktab Module</Body1Title2Bold>
        <Text style={styles.description}>
          This is a placeholder for the Maktab module content.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerImage: {
    width: '100%',
    height: scale(164),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  topDesignContainer: {
    width: '100%',
    height: scale(95),
    overflow: 'hidden',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topDesign: {
    position: 'absolute',
    top: -scale(47.5),
    left: -scale(47.5),
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: scale(89),
    height: scale(89),
    borderRadius: scale(89/2),
    borderWidth: scale(3.47),
    borderColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  calendarIcon: {
    width: scale(50),
    height: scale(50),
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  title: {
    fontSize: scale(24),
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  description: {
    fontSize: scale(16),
    textAlign: 'center',
    color: '#666666',
  },
});

export default MaktabScreen;
