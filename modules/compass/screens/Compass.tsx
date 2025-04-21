// // dependencies
// import {StatusBar, StyleSheet, View} from 'react-native';
// import React from 'react';

// // components
// import {FindMosqueButton, NextSalah} from './components/compass';
// import CompassIcon from '@/assets/compass/compass.svg';
// import {Divider} from '@/components';
// import GeographicDetails from './components/compass/GeographicDetails';

// const Compass = () => {
//   return (
//     <View style={styles.topContainer}>
//       <StatusBar barStyle={'light-content'} />
//       <NextSalah />
//       <View
//         style={{
//           justifyContent: 'center',
//           alignItems: 'center',
//           paddingTop: 82,
//         }}>
//         <CompassIcon />
//       </View>
//       <Divider height={82} />
//       <GeographicDetails />
//       <Divider height={20} />
//       <FindMosqueButton />
//     </View>
//   );
// };

// export default Compass;

// const styles = StyleSheet.create({
//   topContainer: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
// });

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

const Compass: React.FC = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    /* 100 ms = 10 Hz */
    setUpdateIntervalForType(SensorTypes.magnetometer, 100);

    const subscription = magnetometer
      .pipe(
        map(({x, y}) => {
          let heading = Math.atan2(y, x) * (180 / Math.PI);
          if (heading < 0) heading += 360;
          return heading;
        }),
      )
      .subscribe(heading => {
        Animated.timing(rotateAnim, {
          toValue: heading,
          duration: 120,
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

      <View style={styles.compassWrapper}>
        <Animated.View style={{transform: [{rotate}]}}>
          <CompassSvg width={240} height={240} />
        </Animated.View>
      </View>

      <Divider height={82} />
      <GeographicDetails />
      <Divider height={20} />
      <FindMosqueButton />
    </View>
  );
};

export default Compass;

/* ------------------------------------------------------------ */
const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  compassWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 82,
  },
});
