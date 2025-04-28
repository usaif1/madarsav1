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
  selectedCount?: number;
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
  selectedCount,
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
          {/* First row */}
          <View style={styles.gridRow}>
            <TouchableOpacity
              style={[
                styles.counterItem, 
                selectedCount === presetBeads[0] && styles.selectedCounterItem
              ]}
              onPress={() => {
                onSelectPreset(presetBeads[0]);
              }}
            >
              <Text style={styles.counterNumber}>{presetBeads[0]}</Text>
              <Text style={styles.counterLabel}>Beads</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.counterItem,
                selectedCount === presetBeads[1] && styles.selectedCounterItem
              ]}
              onPress={() => {
                onSelectPreset(presetBeads[1]);
              }}
            >
              <Text style={styles.counterNumber}>{presetBeads[1]}</Text>
              <Text style={styles.counterLabel}>Beads</Text>
            </TouchableOpacity>
          </View>
          
          {/* Second row */}
          <View style={styles.gridRow}>
            <TouchableOpacity
              style={[
                styles.counterItem,
                selectedCount === presetBeads[2] && styles.selectedCounterItem
              ]}
              onPress={() => {
                onSelectPreset(presetBeads[2]);
              }}
            >
              <Text style={styles.counterNumber}>{presetBeads[2]}</Text>
              <Text style={styles.counterLabel}>Beads</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.counterItem}
              onPress={onCustomBeads}
            >
              <View style={styles.pencilContainer}>
                <Pencil width={24} height={24} style={styles.pencilIcon} />
              </View>
              <Text style={styles.customBeadsText}>Set custom beads</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 20,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
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
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  counterItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    width: '48%', // Slightly less than 50% to account for gap
    height: 90, // Fixed height to make all boxes the same size
    backgroundColor: 'white',
  },
  selectedCounterItem: {
    borderColor: '#8A57DC', // Purple border for selected item
    backgroundColor: '#F9F5FF', // Light purple background for selected
  },
  counterNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  counterLabel: {
    fontSize: 14,
    color: '#888',
  },
  pencilContainer: {
    marginBottom: 4,
  },
  pencilIcon: {
    color: '#333',
  },
  customBeadsText: {
    color: '#777',
    fontSize: 14,
  },
});

export default SelectCounterModal;