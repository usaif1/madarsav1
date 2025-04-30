import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Title3Bold,Body1Title2Medium } from '@/components/Typography/Typography';
import Pencil from '@/assets/tasbih/pencil.svg';
import PencilViolet from '@/assets/tasbih/pencilViolet.svg';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';

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
  const { colors } = useThemeStore();

  const styles = getStyles(colors)

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
      <View style={[styles.sheet, { backgroundColor: 'white'}]}>
        <View style={styles.header}>
          <Title3Bold style={styles.title}>Select counter</Title3Bold>
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
                <Title3Bold style={styles.counterNumber}>{count}</Title3Bold>
                <Body1Title2Medium color='sub-heading' style={styles.counterLabel}>Beads</Body1Title2Medium>
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
                <Title3Bold style={styles.counterNumber}>{presetBeads[2]}</Title3Bold>
                <Body1Title2Medium color='sub-heading' style={styles.counterLabel}>Beads</Body1Title2Medium>
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
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>{isCustomSelected && customValue ? (
                  <Body1Title2Medium style={styles.customBeadsValue}>{customValue}</Body1Title2Medium>
                ) : null}
              {customValue ? <PencilViolet width={24} height={24} style={styles.pencilIcon} /> : <Pencil width={24} height={24} style={styles.pencilIcon} />}</View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Body1Title2Medium color='sub-heading' style={styles.customBeadsText}>Set custom beads</Body1Title2Medium>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors:any) => StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(32),
    paddingHorizontal: scale(20),
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(24),
  },
  title: {
    fontSize: scale(17)
  },
  closeButton: {
    fontSize: scale(32),
    lineHeight: scale(32),
  },
  countersGrid: {
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  counterItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    borderWidth: 1.5,
    borderColor: colors.primary.primary100,
    borderRadius: scale(16),
    width: scale(163.5),
    height: scale(76),
  },
  selectedCounterItem: {
    borderColor: colors.primary.primary600,
    backgroundColor: colors.primary.primary50,
  },
  customCounterItem: {
    // gap is not supported, use margin if needed
  },
  counterNumber: {
    fontSize: scale(17),
    marginBottom: scale(4),
  },
  counterLabel: {
    fontSize: scale(14),
  },
  pencilIcon: {
    color: colors.primary.primary800,
  },
  customBeadsText: {
    fontSize: scale(14),
  },
  customBeadsValue: {
    fontSize: scale(17),
    marginLeft: scale(4),
  },
});

export default SelectCounterModal;