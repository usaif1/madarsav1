import React, { forwardRef } from 'react';
import {TextInput, StyleSheet, View, Text, ViewStyle, StyleProp, TextInputProps} from 'react-native';

// component
import {Body1Title2Medium} from '@/components';

interface Props extends TextInputProps {
  label: string;
  value: string;
  disabled?: boolean;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
  rightIcon?: React.ReactNode;
  customStyle?: StyleProp<ViewStyle>;
}

const CustomTextInput = forwardRef<TextInput, Props>(({label, value, disabled = false, onChangeText, onFocus, onBlur, error, helperText, placeholder, rightIcon, customStyle, ...rest}, ref) => {
  return (
    <View style={styles.container}>
      <Body1Title2Medium color="sub-heading">{label}</Body1Title2Medium>
      <View style={styles.inputContainer}>
        <TextInput
          ref={ref}
          value={value}
          style={[
            styles.input,
            {
              backgroundColor: disabled ? '#F5F5F5' : 'transparent',
              borderColor: error ? '#FF6B6B' : '#D4D4D4',
              paddingRight: rightIcon ? 40 : 12, // Add padding if there's an icon
              color: disabled ? styles.input.color : '#000000', // Black for editable, default for disabled
            },
            customStyle, // Apply custom styles if provided
          ]}
          editable={!disabled}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A3A3A3"
          onFocus={onFocus}
          onBlur={onBlur}
          {...rest} // Pass through other TextInput props like onSubmitEditing, returnKeyType
        />
        {rightIcon && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 4,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginTop: 4,
  },
  input: {
    width: '100%',
    height: 40,
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
  iconContainer: {
    position: 'absolute',
    right: 12,
    top: 8, // Center vertically in the input
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
