import React from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Body1Title2Medium, Body1Title2Bold, Divider } from '@/components';
import { scale } from '@/theme/responsive';
import LinearGradient from 'react-native-linear-gradient';
import { ColorPrimary } from '@/theme/lightColors';
import FastImage from 'react-native-fast-image';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';

const MaktabScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
      {/* Top header with background image */}
      <View style={styles.headerContainer}>
        <ImageBackground 
          source={{ uri: getCdnUrl(DUA_ASSETS.MAKTAB_HEADER) }}
          style={styles.headerImage}
          imageStyle={{ opacity: 0.2 }}
        >
          {/* Gradient overlay for smooth transition */}
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
            style={styles.gradientOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          
          {/* Shadow overlay */}
          <FastImage
            source={{ uri: getCdnUrl(DUA_ASSETS.MAKTAB_HEADER_SHADOW) }}
            style={styles.headerShadow}
            resizeMode={FastImage.resizeMode.cover}
          />
          
          {/* SVG Top Design - centered and larger */}
          <View style={styles.topDesignContainer}>
            <CdnSvg 
              path={DUA_ASSETS.MAKTAB_TOP_DESIGN} 
              width={scale(280)} 
              height={scale(150)} 
              style={styles.topDesign} 
            />
          </View>
        
          {/* Circle with calendar icon */}
          <View style={styles.circleContainer}>
            <LinearGradient
              colors={['#FFFFFF', '#F2DEFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.circle}
            >
              <FastImage 
                source={{ uri: getCdnUrl(DUA_ASSETS.MAKTAB_CALENDAR) }}
                style={styles.calendarIcon} 
                resizeMode={FastImage.resizeMode.contain}
              />
            </LinearGradient>
          </View>
        </ImageBackground>
      </View>
      
      {/* Spacing */}
      <Divider height={scale(4)} />
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {/* Salam Image */}
        <FastImage 
          source={{ uri: getCdnUrl(DUA_ASSETS.MAKTAB_SALAM) }}
          style={styles.salamImage} 
          resizeMode={FastImage.resizeMode.contain}
        />
        
        {/* Spacing */}
        <Divider height={scale(4)} />
        
        {/* Welcome Text */}
        <Body1Title2Medium style={styles.welcomeText}>
          Find the perfect tutor on Maktab! Choose by course, availability, and gender. As the learning hub of the Madrasa App, Maktab offers two modes: Deen and Duniya, together building a balanced path to succeed in this world and earn rewards in the Hereafter.
        </Body1Title2Medium>
        </View>
        
        {/* Spacing */}
        <Divider height={scale(16)} />
        


          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.learningModesScrollContent}
            style={styles.learningModesOuterContainer} 
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
        
        {/* Spacing */}
        <Divider height={scale(20)} />
        
        {/* Pre-Register Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLSdi5S4j8hRDsBSzsCe2eSMy0fXkp2yUzUJBxFZqHDWGAPzxkA/viewform')}
          >
            <Body1Title2Bold style={styles.buttonText}>Pre-Register as a Tutor</Body1Title2Bold>
          </TouchableOpacity>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerContent: {
    flexGrow: 1,
  },
  headerContainer: {
    position: 'relative',
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: scale(164),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: scale(32),
    zIndex: 2,
  },
  headerShadow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.5,
    zIndex: 1,
  },
  topDesignContainer: {
    width: '100%',
    height: scale(90),
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  topDesign: {
    position: 'absolute',
    top: -scale(75),
    left: '45%',
    transform: [{ translateX: -scale(150) }],
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
    zIndex: 4,
  },
  calendarIcon: {
    width: scale(50),
    height: scale(50),
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
  learningModesOuterContainer: { 
    marginVertical: scale(20), 
    height: scale(260), 
  },
  learningModesScrollContent: { 
    paddingLeft: scale(20),
    paddingRight: scale(20), 
    gap: scale(16),
    alignItems: 'flex-start', 
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
  buttonContainer: {
    width: scale(375),
    height: scale(36),
    paddingHorizontal: scale(20),
    marginBottom: scale(20),
  },
  registerButton: {
    width: scale(335),
    height: scale(36),
    paddingVertical: scale(4),
    paddingHorizontal: scale(16),
    borderRadius: scale(60),
    backgroundColor: ColorPrimary.primary600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    width: scale(158),
    height: scale(20),
    fontSize: scale(12),
    lineHeight: scale(14 * 1.45),
    letterSpacing: 0,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default MaktabScreen;
