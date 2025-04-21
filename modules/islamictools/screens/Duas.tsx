// dependencies
import {View} from 'react-native';
import React from 'react';

// components
import {DuaSearchbar} from './components/Duas';
import DuaList from './components/Duas/DuaList';
import {Body1Title2Bold, Divider} from '@/components';

// assets
import MandalaDua from '@/assets/duas/mandala_dua.svg';

const Duas = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
      }}>
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
    </View>
  );
};

export default Duas;
