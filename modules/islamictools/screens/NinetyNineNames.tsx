import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NamesSearchbar} from './components/NinetyNineNames';

type Props = {};

const NinetyNineNames = (props: Props) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
        paddingHorizontal: 18,
      }}>
      <StatusBar barStyle="light-content" />
      <NamesSearchbar />
    </View>
  );
};

export default NinetyNineNames;

const styles = StyleSheet.create({});
