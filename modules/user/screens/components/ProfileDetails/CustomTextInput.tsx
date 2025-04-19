import React from 'react';
import {TextInput, StyleSheet} from 'react-native';

// component
import {Body1Title2Medium} from '@/components/Typography/Typography';

interface Props {
  label: string;
  value: string;
  disabled?: boolean;
}

const CustomTextInput: React.FC<Props> = ({label, value, disabled = false}) => {
  return (
    <>
      <Body1Title2Medium color="sub-heading">{label}</Body1Title2Medium>
      <TextInput
        value={value}
        style={[
          styles.input,
          {
            backgroundColor: disabled ? '#F5F5F5' : 'transparent',
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
});

export default CustomTextInput;
