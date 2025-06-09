import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from '@/theme/responsive';
import { Body1Title2Medium } from '@/components/Typography/Typography';
import { useThemeStore } from '@/globalStore';
import FastImage from 'react-native-fast-image';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import { CdnSvg } from '@/components/CdnSvg';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'As-salamu alaykum, dua khojein',
  onSubmitEditing,
}) => {
  const { colors } = useThemeStore();

  return (
    <View style={[styles.container,{borderColor: value ? '#8A57DC' : '#E5E5E5'}]}>
      <View style={styles.iconContainer}>
        <CdnSvg 
          path={DUA_ASSETS.SEARCH}
          width={scale(16)}
          height={scale(16)}
          fill="#6B7280"
        />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(339),
    height: scale(36),
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: scale(8),
    paddingRight: scale(16),
    paddingBottom: scale(8),
    paddingLeft: scale(16),
    borderRadius: scale(30), // radius-xxxl
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: 'white',
  },
  iconContainer: {
    marginRight: scale(8),
  },
  input: {
    flex: 1,
    fontSize: scale(14),
    fontFamily: 'Geist',
    color: '#4B5563', // Assuming this is the sub-heading color
    padding: 0, // Remove default padding
  },
});

export default SearchInput;
