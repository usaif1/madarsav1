import React from 'react';
import {TextInput, StyleSheet, View, Text} from 'react-native';

// component
import {Body1Title2Medium} from '@/components';

interface Props {
  label: string;
  value: string;
  disabled?: boolean;
  onChange?: (text: string) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
}

const CustomTextInput: React.FC<Props> = ({label, value, disabled = false, onChange, error, helperText, placeholder}) => {
  return (
    <View style={styles.container}>
      <Body1Title2Medium color="sub-heading">{label}</Body1Title2Medium>
      <TextInput
        value={value}
        style={[
          styles.input,
          {
            backgroundColor: disabled ? '#F5F5F5' : 'transparent',
            borderColor: error ? '#FF6B6B' : '#D4D4D4',
          },
        ]}
        editable={!disabled}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#A3A3A3"
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 40,
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#D4D4D4',
    paddingLeft: 12,
    alignItems: 'center',
    paddingVertical: 0,
    color: '#737373',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Geist-Medium',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Geist-Regular',
  },
  helperText: {
    color: '#737373',
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Geist-Regular',
  },
});

export default CustomTextInput;
