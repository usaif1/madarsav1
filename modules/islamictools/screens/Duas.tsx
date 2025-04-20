import {View, Text} from 'react-native';
import React from 'react';
import {DuaSearchbar} from './components/Duas';
import DuaList from './components/Duas/DuaList';

type Props = {};

const Duas = (props: Props) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
        paddingHorizontal: 18,
      }}>
      <DuaSearchbar />
      <DuaList />
    </View>
  );
};

export default Duas;
