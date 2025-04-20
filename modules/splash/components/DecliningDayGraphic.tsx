// dependencies
import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

// components
import {Body1Title2Bold, Divider, Title1Regular} from '@/components';

// assets
import DecliningDay from '@/assets/splash/decling_day.svg';
import RightTriangle from '@/assets/right-triangle.svg';

const SplashScreen1: React.FC = () => {
  return (
    <LinearGradient
      colors={['#FFFFFF', '#F2DEFF']}
      style={{borderRadius: 16, maxWidth: 188}}>
      <View style={{paddingHorizontal: 18, paddingBottom: 13, paddingTop: 16}}>
        <View style={{alignItems: 'flex-end'}}>
          <DecliningDay />
          <Title1Regular>The Declining Day</Title1Regular>
        </View>
        <Divider height={28} />
        <Pressable style={[styles.button, {backgroundColor: '#8A57DC'}]}>
          <RightTriangle />
          <Body1Title2Bold color="white">Continue</Body1Title2Bold>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  button: {
    paddingVertical: 4,
    flexDirection: 'row',
    borderRadius: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 5,
  },
});

export default SplashScreen1;
