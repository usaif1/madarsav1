import React from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, ScrollView } from 'react-native';
import { Body1Title2Medium, Divider } from '@/components';
import { scale } from '@/theme/responsive';
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
      
      {/* Spacing */}
      <Divider height={scale(4)} />
      
      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {/* Salam Image */}
        <Image 
          source={require('@/assets/maktab/maktab-salam.png')} 
          style={styles.salamImage} 
          resizeMode="contain"
        />
        
        {/* Spacing */}
        <Divider height={scale(4)} />
        
        {/* Welcome Text */}
        <Body1Title2Medium style={styles.welcomeText}>
          Find the perfect tutor on Maktab! Choose by course, availability, and gender. As the learning hub of the Madrasa App, Maktab offers two modes: Deen and Duniya, together building a balanced path to succeed in this world and earn rewards in the Hereafter.
        </Body1Title2Medium>
        
        {/* Spacing */}
        <Divider height={scale(16)} />
        
        {/* Learning Modes Container */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.learningModesContainer}
        >
          {/* Deen Learning Box */}
          <View style={styles.learningBox}>
            <View style={styles.textContainer}>
              <View style={styles.innerTextContainer}>
                <Text style={styles.learningHeading}>Deen Learning</Text>
                <Text style={styles.learningDescription}>
                  Learn the Quran, Hadith, Arabic, and Islamic Studies through live, one-on-one classes with qualified teachers. Build a strong foundation in Deen with structured, age-appropriate, and spiritually enriching lessons.
                </Text>
              </View>
            </View>
          </View>
          
          {/* Skill Learning Box */}
          <View style={styles.learningBox}>
            <View style={styles.textContainer}>
              <View style={styles.innerTextContainer}>
                <Text style={styles.learningHeading}>Skill Learning</Text>
                <Text style={styles.learningDescription}>
                  Explore practical, future-ready skills such as AI, Digital Marketing, Personal Finance, Investment, and Social Media management etc. — all taught with Islamic values at the core. Prepare to succeed in today's world without compromising your Deen.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingBottom: scale(20),
  },
  salamImage: {
    width: scale(262),
    height: scale(70),
    marginTop: scale(16),
  },
  welcomeText: {
    width: scale(343),
    fontSize: scale(14),
    lineHeight: scale(14 * 1.45),
    textAlign: 'center',
    color: '#666666',
  },
  learningModesContainer: {
    marginVertical: scale(20),
    paddingLeft: scale(20),
    gap: scale(16),
  },
  learningBox: {
    width: scale(265),
    height: scale(239),
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: '#F3F3F3',
    backgroundColor: '#FFFCF3',
  },
  textContainer: {
    width: scale(265),
    height: scale(189),
    padding: scale(16),
  },
  innerTextContainer: {
    width: scale(233),
    height: scale(157),
    gap: scale(4),
  },
  learningHeading: {
    width: scale(233),
    height: scale(21),
    fontFamily: 'Poltawski Nowy',
    fontWeight: '700',
    fontSize: scale(16),
    lineHeight: scale(16),
    letterSpacing: 0,
    color: '#101010',
    marginBottom: scale(8),
  },
  learningDescription: {
    width: scale(233),
    height: scale(132),
    fontFamily: 'Geist',
    fontWeight: '400',
    fontSize: scale(14),
    lineHeight: scale(22),
    letterSpacing: -0.01 * scale(14),
    color: '#595959',
  },
});

export default MaktabScreen;
