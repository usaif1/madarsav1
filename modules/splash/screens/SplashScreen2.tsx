// dependencies
import {Pressable, StatusBar, Text, View, Image} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native'


// assets
// import SplashGraphic from '../../../assets/splash/splash_graphic.svg';

const SplashPrimary: React.FC = () => {
  const navigation = useNavigation()

  return (
    <View
      style={{
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
      }}>
      {/* <SalamEmoji /> */}
      <Image
        source={require('../../../assets/splash/salam_emoji.png')}
      />
      <StatusBar barStyle={'dark-content'} />

      <Pressable style={{backgroundColor:'white', marginTop:20}} onPress={()=>{
        navigation.navigate('screen3')
      }}>
        <Text>Next</Text>
      </Pressable>
    </View>
  );
};

export default SplashPrimary;
