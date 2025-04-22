import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Search from '@/assets/search.svg';

const NamesSearchbar: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {borderColor: isFocused ? '#8A57DC' : '#D1D5DB'}, // 👈 dynamic border
      ]}>
      {!isFocused ? <Search width={20} height={20} /> : null}
      <TextInput
        placeholder="Salam, Allah ke naam khojein"
        placeholderTextColor="#737373"
        style={styles.input}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
    borderRadius: 999,
    borderWidth: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    padding: 0,
  },
});
