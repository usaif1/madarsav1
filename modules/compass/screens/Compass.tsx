import {StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';

// components
import {NextSalah} from './components/compass';
import CompassIcon from '@/assets/compass/compass.svg';
import {Divider} from '@/components';
import GeographicDetails from './components/compass/GeographicDetails';

const Compass = () => {
  return (
    <View style={styles.topContainer}>
      <StatusBar barStyle={'light-content'} />
      <NextSalah />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 82,
        }}>
        <CompassIcon />
      </View>
      <Divider height={82} />
      <GeographicDetails />
    </View>
  );
};

export default Compass;

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
