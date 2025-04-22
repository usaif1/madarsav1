// dependencies
import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, StatusBar, Animated, Easing} from 'react-native';
import {
  magnetometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {map} from 'rxjs/operators';

// components
import {FindMosqueButton, NextSalah} from './components/compass';
import CompassSvg from '@/assets/compass/compass.svg';
import {Divider} from '@/components';
import GeographicDetails from './components/compass/GeographicDetails';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Compass: React.FC = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const {bottom} = useSafeAreaInsets();

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 100);

    const subscription = magnetometer
      .pipe(
        map(({x, y}) => {
          // Calculate compass heading
          let heading = Math.atan2(y, x) * (180 / Math.PI);
          // Convert negative angles to positive
          if (heading < 0) {
            heading += 360;
          }
          // Reverse rotation for proper compass display
          return 360 - heading;
        }),
      )
      .subscribe(heading => {
        Animated.timing(rotateAnim, {
          toValue: heading,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      });

    return () => subscription.unsubscribe();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.topContainer}>
      <StatusBar barStyle="light-content" />
      <NextSalah />

      {/* Centered compass with rotation */}
      <View style={styles.compassContainer}>
        <Animated.View style={[styles.compass, {transform: [{rotate}]}]}>
          <CompassSvg width={300} height={300} />
        </Animated.View>
      </View>

      <Divider height={82} />
      <GeographicDetails />
      <View
        style={{
          position: 'absolute',
          bottom: bottom ? bottom : 10,
          width: '100%',
        }}>
        <FindMosqueButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  compassContainer: {
    paddingTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  compass: {
    width: 300,
    height: 300,
  },
});

export default Compass;
