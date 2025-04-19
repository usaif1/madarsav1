// dependencies
import {Pressable, StatusBar, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

// assets
// import SplashGraphic from '../../../assets/splash/splash_graphic.svg';
import SplashGraphic from '@/assets/splash/splash_graphic.svg';
import Mandala from '../../../assets/splash/mandala.png';

const SplashPrimary: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#411B7F',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}>
      <SplashGraphic />
      <StatusBar barStyle={'light-content'} />

      <Pressable
        style={{backgroundColor: 'white', marginTop: 20}}
        onPress={() => {
          navigation.navigate('screen2');
        }}>
        <Text>Next</Text>
      </Pressable>

      <FastImage
        style={{
          width: 200,
          height: 200,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
        source={require('../../../assets/splash/mandala.png')}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};

export default SplashPrimary;
