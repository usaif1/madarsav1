import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Body1Title2Bold } from '@/components/Typography/Typography';
import Pencil from '@/assets/tasbih/pencil.svg';

interface SelectCounterModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPreset: (count: number) => void;
  onCustomBeads: () => void;
  presetBeads: number[];
  selectedCount?: number;
  isCustomSelected?: boolean;
  customValue?: number;
}

const SelectCounterModal: React.FC<SelectCounterModalProps> = ({
  visible,
  onClose,
  onSelectPreset,
  onCustomBeads,
  presetBeads = [11, 33, 99],
  selectedCount,
  isCustomSelected = false,
  customValue,
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
          <TouchableOpacity onPress={onClose} hitSlop={16}>
            <Text style={styles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.countersGrid}>
          {/* First row */}
          <View style={styles.gridRow}>
            {presetBeads.slice(0, 2).map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.counterItem,
                  selectedCount === count && !isCustomSelected && styles.selectedCounterItem
                ]}
                onPress={() => onSelectPreset(count)}
              >
                <Text style={styles.counterNumber}>{count}</Text>
                <Text style={styles.counterLabel}>Beads</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Second row */}
          <View style={styles.gridRow}>
            {presetBeads.length > 2 && (
              <TouchableOpacity
                style={[
                  styles.counterItem,
                  selectedCount === presetBeads[2] && !isCustomSelected && styles.selectedCounterItem
                ]}
                onPress={() => onSelectPreset(presetBeads[2])}
              >
                <Text style={styles.counterNumber}>{presetBeads[2]}</Text>
                <Text style={styles.counterLabel}>Beads</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[
                styles.counterItem,
                styles.customCounterItem,
                isCustomSelected && styles.selectedCounterItem
              ]}
              onPress={onCustomBeads}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>{isCustomSelected && customValue ? (
                  <Text style={styles.customBeadsValue}>{customValue}</Text>
                ) : null}
              <Pencil width={24} height={24} style={styles.pencilIcon} /></View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.customBeadsText}>Set custom beads</Text>
              </View>
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
  },
  closeButton: {
    fontSize: 28,
    color: '#888888',
    lineHeight: 28,
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
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    width: '48%',
    height: 96,
    backgroundColor: '#FFFFFF',
  },
  selectedCounterItem: {
    borderColor: '#8A57DC',
    backgroundColor: '#F9F5FF',
  },
  customCounterItem: {
    gap: 8,
  },
  counterNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  counterLabel: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  pencilIcon: {
    color: '#333333',
  },
  customBeadsText: {
    color: '#777777',
    fontSize: 14,
    fontWeight: '500',
  },
  customBeadsValue: {
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 4,
  },
});

export default SelectCounterModal;