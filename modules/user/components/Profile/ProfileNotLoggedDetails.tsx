import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { Divider } from '@/components';
import { Body1Title2Bold, Body1Title2Medium } from '@/components';
import { useThemeStore } from '@/globalStore';
import { useWindowDimensions } from 'react-native';

const ProfileNotLoggedDetails: React.FC<{ onLoginPress?: () => void }> = ({ onLoginPress }) => {
  const { colors, shadows } = useThemeStore();
  const { width } = useWindowDimensions();

  // Make button width and padding responsive, but keep it visually the same size
  // on all screens (fixed width, centered, not stretched)
  const loginBtnStyle = [
    styles.loginBtn,
    { backgroundColor: colors.primary.primary100 },
    ...(width > 400
      ? [{ alignSelf: 'center' as const, width: 180, paddingHorizontal: 0 }]
      : []),
  ];

  return (
    <View
      style={[
        {
          width: '100%',
          alignItems: 'center',
          paddingTop: 20,
          paddingBottom: 20,
          backgroundColor: 'white',
        },
        shadows.sm1,
      ]}
    >
      <LinearGradient
        colors={[ '#FFFFFF', '#FEE7CD' ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.handwaveCircle}
      >
        <View style={styles.handwaveSvgWrap}>
          <FastImage
            source={require('@/assets/profile/handwave.png')}
            resizeMode={FastImage.resizeMode.contain}
            style={{ width: 54, height: 54 }}
          />
        </View>
      </LinearGradient>
      <Divider height={12} />
      <Body1Title2Bold style={styles.centerText}>Assalamu alaikum</Body1Title2Bold>
      <Divider height={4} />
      <Body1Title2Medium color="sub-heading" style={styles.centerText}>
        Tap below button to login
      </Body1Title2Medium>
      <Divider height={16} />
      <Pressable
        onPress={onLoginPress}
        style={loginBtnStyle}
      >
        <Body1Title2Bold color="primary">Login to Madrasa</Body1Title2Bold>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  handwaveCircle: {
    width: 94,
    height: 94,
    borderRadius: 327.59,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handwaveSvgWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 54,
    height: 54,
  },
  centerText: {
    textAlign: 'center',
  },
  loginBtn: {
    width: 180,
    borderRadius: 100,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', // always center
  },
});

export default ProfileNotLoggedDetails;
