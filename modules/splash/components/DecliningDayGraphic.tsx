// dependencies
import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

// components
import {Body1Title2Bold, Divider, Title1Regular} from '@/components';

// assets
import DecliningDay from '@/assets/splash/decling_day.svg';
import RightTriangle from '@/assets/right-triangle.svg';

const {height} = Dimensions.get('window');

const SplashScreen1: React.FC = () => {
  return (
    <LinearGradient
      colors={['#FFFFFF', '#F2DEFF']}
      style={{
        borderRadius: 16,
        maxWidth: 188,
      }}>
      <View
        style={{
          paddingHorizontal: 18,
          paddingBottom: 13,
          paddingTop: 16.5,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#F5F5F5',
          height: height * 0.2,
        }}>
        <View style={{alignItems: 'flex-end'}}>
          <DecliningDay />
          <Divider height={4} />
          <Title1Regular>The Declining Day</Title1Regular>
        </View>
        <Divider height={34} />
        <Pressable style={[styles.button, {backgroundColor: '#8A57DC'}]}>
          <RightTriangle />
          <Body1Title2Bold color="white">Continue</Body1Title2Bold>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 13,
    alignSelf: 'center',
    paddingVertical: 5,
    flexDirection: 'row',
    borderRadius: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 5,
  },
});

export default SplashScreen1;
