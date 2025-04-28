import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Body1Title2Bold } from '@/components/Typography/Typography';
import Pencil from '@/assets/tasbih/pencil.svg'; // Ensure you have this icon

interface SelectCounterModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPreset: (count: number) => void;
  onCustomBeads: () => void;
  presetBeads: number[];
}

/**
 * Modal component for selecting preset counter values or custom counter option
 * Displays a grid of preset bead counts and an option to set custom beads
 */
const SelectCounterModal: React.FC<SelectCounterModalProps> = ({
  visible,
  onClose,
  onSelectPreset,
  onCustomBeads,
  presetBeads = [11, 33, 99],
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modalContainer}
      useNativeDriverForBackdrop={true}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Body1Title2Bold style={styles.title}>Select counter</Body1Title2Bold>
          <TouchableOpacity onPress={onClose} hitSlop={{top: 16, right: 16, bottom: 16, left: 16}}>
            <Text style={styles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.countersGrid}>
          {presetBeads.map((count, index) => (
            <TouchableOpacity
              key={index}
              style={styles.counterItem}
              onPress={() => {
                onSelectPreset(count);
              }}
            >
              <Text style={styles.counterNumber}>{count}</Text>
              <Text style={styles.counterLabel}>Beads</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.customBeadsBtn}
          onPress={onCustomBeads}
        >
          <Pencil width={16} height={16} style={styles.pencilIcon} />
          <Text style={styles.customBeadsText}>Set custom beads</Text>
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
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  closeButton: {
    fontSize: 28,
    color: '#888',
    fontWeight: '400',
  },
  countersGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  counterItem: {
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1EAFD',
    borderRadius: 16,
    width: '30%',
  },
  counterNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#8A57DC',
    marginBottom: 4,
  },
  counterLabel: {
    fontSize: 14,
    color: '#888',
  },
  customBeadsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  pencilIcon: {
    marginRight: 8,
  },
  customBeadsText: {
    color: '#8A57DC',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SelectCounterModal;