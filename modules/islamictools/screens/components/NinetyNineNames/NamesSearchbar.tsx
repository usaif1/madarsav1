import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';

type Props = {};

const NamesSearchbar = (props: Props) => {
  return (
    <View style={styles.container}>
      <CdnSvg path={DUA_ASSETS.SEARCH_ICON} width={20} height={20} />
      <TextInput
        placeholder="Salam, Allah ke naam khojein"
        placeholderTextColor="#737373"
        style={styles.input}
      />
    </View>
  );
};

export default NamesSearchbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 999, // radius-xxxl for pill shape
    borderWidth: 1,
    borderColor: '#D1D5DB', // assuming Primitives/Regular = gray-300
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827', // dark gray (gray-900)
    padding: 0,
  },
});
