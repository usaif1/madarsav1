import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { Body1Title2Bold, Title3Bold } from '@/components/Typography/Typography';

interface CustomBeadModalProps {
  visible: boolean;
  value: string;
  onChangeValue: (val: string) => void;
  onSave: () => void;
  onClose: () => void;
  inputTouched: boolean;
  setInputTouched: (touched: boolean) => void;
}

/**
 * Modal component for setting custom bead count
 * Displays an input field for users to enter a custom number of beads
 */
const CustomBeadModal: React.FC<CustomBeadModalProps> = ({
  visible,
  value,
  onChangeValue,
  onSave,
  onClose,
  inputTouched,
  setInputTouched,
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modalContainer}
      useNativeDriverForBackdrop={true}
      avoidKeyboard={true}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Title3Bold style={styles.title}>Set custom beads</Title3Bold>
            <TouchableOpacity onPress={onClose} hitSlop={{top: 16, right: 16, bottom: 16, left: 16}}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Add number of beads"
            placeholderTextColor="#888"
            value={value}
            keyboardType="number-pad"
            onChangeText={text => { 
              // Filter non-numeric characters
              onChangeValue(text.replace(/[^0-9]/g, '')); 
              setInputTouched(true); 
            }}
            autoFocus={true}
          />
          <TouchableOpacity
            style={[styles.saveBtn, value ? styles.saveBtnActive : null]}
            onPress={onSave}
            disabled={!value}
          >
            <Body1Title2Bold style={styles.saveBtnText}>Save</Body1Title2Bold>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  keyboardView: {
    width: '100%',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  closeButton: {
    fontSize: 32,
    color: '#000',
    lineHeight: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#A07CFA',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginVertical: 16,
    color: '#222',
    backgroundColor: '#fff',
    textAlign: 'left',
  },
  saveBtn: {
    backgroundColor: '#ECECEC',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnActive: {
    backgroundColor: '#8A57DC',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CustomBeadModal;