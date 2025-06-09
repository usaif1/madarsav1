import {StyleSheet, TextInput, View, TouchableOpacity} from 'react-native';
import React from 'react';
import { useDuaStore } from '@/modules/dua/store/duaStore';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';

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
      <CdnSvg path={DUA_ASSETS.SEARCH} width={20} height={20} />
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
          <CdnSvg path={DUA_ASSETS.CLOSE} width={16} height={16} />
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
