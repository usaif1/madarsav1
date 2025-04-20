import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import Search from '@/assets/search.svg'; // assuming it's an SVG icon via react-native-svg

type Props = {};

const DuaSearchbar = (props: Props) => {
  return (
    <View style={styles.container}>
      <Search width={20} height={20} />
      <TextInput
        placeholder="Salam, dua khojein"
        placeholderTextColor="#737373"
        style={styles.input}
      />
    </View>
  );
};

export default DuaSearchbar;

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
