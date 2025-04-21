import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Pressable,
  StatusBar,
  Text,
  View,
  Easing,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// assets
import SplashGraphic from '@/assets/splash/splash_graphic.svg';
import MandalaFull from '@/assets/splash/mandala_full.svg';

type RootStackParamList = {
  screen2: undefined;
};

const SplashPrimary: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 50000, // 👈 10s per full rotation (slow and steady)
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SplashGraphic />

      <Pressable
        style={styles.nextButton}
        onPress={() => navigation.navigate('screen2')}>
        <Text>Next</Text>
      </Pressable>

      <Animated.View
        style={[
          styles.mandalaWrapper,
          {
            transform: [{translateY: 145}, {rotate: rotateInterpolate}],
          },
        ]}>
        <MandalaFull />
      </Animated.View>
    </View>
  );
};

export default SplashPrimary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#411B7F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  nextButton: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  mandalaWrapper: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
});
