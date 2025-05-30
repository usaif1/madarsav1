import {StyleSheet, TextInput, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Search from '@/assets/search.svg';
import Close from '@/assets/close.svg'; // assuming you have this icon
import { useDuaStore } from '@/modules/dua/store/duaStore';

interface DuaSearchbarProps {
  onSearchChange?: (text: string) => void;
}

const DuaSearchbar: React.FC<DuaSearchbarProps> = ({ onSearchChange }) => {
  const [searchText, setSearchText] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  
  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (onSearchChange) {
      onSearchChange(text);
    }
  };
  
  const clearSearch = () => {
    setSearchText('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  return (
    <View style={[
      styles.container,
      {borderColor: isFocused ? '#8A57DC' : '#D1D5DB'}, // 👈 dynamic border
    ]}>
      <Search width={20} height={20} />
      <TextInput
        placeholder="Salam, dua khojein"
        placeholderTextColor="#737373"
        style={styles.input}
        value={searchText}
        onChangeText={handleSearchChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {searchText.length > 0 && (
        <TouchableOpacity onPress={clearSearch}>
          <Close width={16} height={16} />
        </TouchableOpacity>
      )}
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
