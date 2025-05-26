// dependencies
import {StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';

// components
import {DuaSearchbar} from './components/Duas';
import DuaList from './components/Duas/DuaList';
import {Body1Title2Bold, Divider} from '@/components';

// assets
import MandalaDua from '@/assets/duas/mandala_dua.svg';
import { scale, verticalScale } from '@/theme/responsive';
import FastImage from 'react-native-fast-image';

const Duas = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
      }}>
      <StatusBar barStyle={'light-content'} />
      <View style={{paddingHorizontal: 18}}>
        <DuaSearchbar />
      </View>
      <Divider height={10} />
      <View
        style={{
          backgroundColor: '#F9F6FF',
          paddingVertical: 5,
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
        <Body1Title2Bold color="primary">Daily Duas</Body1Title2Bold>
        <MandalaDua
          style={{
            position: 'absolute',
            left: 0,
            zIndex: 99,
            top: 0,
            transform: [{translateY: -56}],
          }}
        />
        <MandalaDua
          style={{
            position: 'absolute',
            right: 0,
            zIndex: 99,
            top: 0,
            transform: [{scaleX: -1}, {translateY: -56}],
          }}
        />
      </View>
      <DuaList />
      <View style={styles.footerContainer}>
            <FastImage 
                source={require('@/assets/duas/dua-ayah.png')} 
                style={styles.footerImage}
                resizeMode={FastImage.resizeMode.contain}
            />
        </View>
      <View
        style={{
          backgroundColor: '#F9F6FF',
          paddingVertical: 5,
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
        <Body1Title2Bold color="primary">Prayers</Body1Title2Bold>
        <MandalaDua
          style={{
            position: 'absolute',
            left: 0,
            zIndex: 99,
            top: 0,
            transform: [{translateY: -56}],
          }}
        />
        <MandalaDua
          style={{
            position: 'absolute',
            right: 0,
            zIndex: 99,
            top: 0,
            transform: [{scaleX: -1}, {translateY: -56}],
          }}
        />
      </View>
    </View>
  );
};

export default Duas;


const styles = StyleSheet.create({
    footerContainer: {
        width: scale(375),
        height: verticalScale(121),
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerImage: {
      width: '100%',
      height: '100%',
  },
});