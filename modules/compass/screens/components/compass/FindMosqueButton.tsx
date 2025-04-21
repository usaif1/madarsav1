// dependencies
import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';

// assets
import Mosque from '@/assets/compass/mosque.svg';
import {Body1Title2Bold} from '@/components';

const FindMosqueButton: React.FC = () => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.btn}>
        <Mosque />
        <Body1Title2Bold color="white">Find Mosque Near Me</Body1Title2Bold>
      </Pressable>
    </View>
  );
};

export default FindMosqueButton;

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  btn: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#6D2DD3',
    columnGap: 6,
    borderRadius: 100,
    paddingVertical: 12,
  },
});
