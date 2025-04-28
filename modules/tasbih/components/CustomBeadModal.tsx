import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import Modal from 'react-native-modal';
import { Body1Title2Bold } from '@/components/Typography/Typography';

interface CustomBeadModalProps {
  visible: boolean;
  value: string;
  onChangeValue: (val: string) => void;
  onSave: () => void;
  onClose: () => void;
  inputTouched: boolean;
  setInputTouched: (touched: boolean) => void;
}

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
    >
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Body1Title2Bold style={styles.title}>Set custom beads</Body1Title2Bold>
          <TouchableOpacity onPress={onClose} hitSlop={16}>
            <Text style={styles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Add number of beads"
          value={value}
          keyboardType="number-pad"
          onChangeText={text => { 
            onChangeValue(text.replace(/[^0-9]/g, '')); 
            setInputTouched(true); 
          }}
        />
        <TouchableOpacity
          style={[styles.saveBtn, value ? styles.saveBtnActive : null]}
          onPress={onSave}
          disabled={!value}
        >
          <Body1Title2Bold style={styles.saveBtnText}>Save</Body1Title2Bold>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1EAFD',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  closeButton: {
    fontSize: 28,
    color: '#888',
    fontWeight: '400',
  },
  input: {
    borderWidth: 1,
    borderColor: '#A07CFA',
    borderRadius: 16,
    padding: 12,
    fontSize: 22,
    marginBottom: 16,
    marginTop: 16,
    color: '#222',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: '#ECECEC',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnActive: {
    backgroundColor: '#A07CFA',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default CustomBeadModal;