import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Marble from '@/assets/tasbih/marble.svg';
import ResetIcon from '@/assets/tasbih/reset.svg'; // Replace with your actual reset icon
import Pencil from '@/assets/tasbih/pencil.svg'; // For custom beads option
import { Body1Title2Bold } from '@/components';
import { useThemeStore } from '@/globalStore';

const PRESET_BEADS = [11, 33, 99];

interface CounterControlsProps {
  selectedCount: number;
  onSelectCounter: (count: number) => void;
  onReset: () => void;
}

const CounterControls: React.FC<CounterControlsProps> = ({ selectedCount, onSelectCounter, onReset }) => {
  const { colors } = useThemeStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [customModal, setCustomModal] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [inputTouched, setInputTouched] = useState(false);

  const handlePreset = (count: number) => {
    setModalVisible(false);
    onSelectCounter(count);
  };
  const handleCustom = () => {
    setModalVisible(false);
    setCustomModal(true);
  };
  const handleSaveCustom = () => {
    if (customValue && !isNaN(Number(customValue))) {
      onSelectCounter(Number(customValue));
      setCustomModal(false);
      setCustomValue('');
      setInputTouched(false);
    }
  };

  return (
    <>
      <View style={styles.row}>
        <Marble width={36} height={36} />
        <Pressable style={styles.selectBtn} onPress={() => setModalVisible(true)}>
          <Body1Title2Bold color="primary">Select counter ({selectedCount})</Body1Title2Bold>
        </Pressable>
        <Pressable style={styles.resetBtn} onPress={onReset}>
          <ResetIcon width={22} height={22} style={{ marginRight: 6 }} />
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </View>
      <View style={styles.topBorderOnly} />

      {/* Counter Select Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setModalVisible(false)} />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Select counter</Text>
          <View style={styles.counterGrid}>
            {PRESET_BEADS.map(count => (
              <TouchableOpacity
                key={count}
                style={[styles.counterOption, selectedCount === count && styles.counterOptionActive]}
                onPress={() => handlePreset(count)}
              >
                <Text style={styles.counterNum}>{count}</Text>
                <Text style={styles.counterLabel}>Beads</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.counterOption} onPress={handleCustom}>
              <Pencil width={20} height={20} style={{ marginBottom: 2 }} />
              <Text style={styles.counterLabel}>Set custom beads</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Custom Bead Modal */}
      <Modal visible={customModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setCustomModal(false)} />
        <KeyboardAvoidingView
          style={styles.modalSheet}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Text style={styles.modalTitle}>Set custom beads</Text>
          <TextInput
            style={styles.input}
            placeholder="Add number of beads"
            value={customValue}
            keyboardType="number-pad"
            onChangeText={text => { setCustomValue(text.replace(/[^0-9]/g, '')); setInputTouched(true); }}
          />
          <TouchableOpacity
            style={[styles.saveBtn, customValue ? styles.saveBtnActive : null]}
            onPress={handleSaveCustom}
            disabled={!customValue}
          >
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  selectBtn: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: '#F7F3FF',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 18,
    height: 48,
    marginLeft: 8,
  },
  resetText: {
    fontSize: 18,
    color: '#888',
    fontWeight: '500',
  },
  topBorderOnly: {
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    width: '100%',
    marginBottom: 0,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  modalSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 18,
    color: '#222',
  },
  counterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  counterOption: {
    width: '48%',
    minHeight: 70,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1D9FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    padding: 8,
  },
  counterOptionActive: {
    backgroundColor: '#F7F3FF',
    borderColor: '#A07CFA',
  },
  counterNum: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5E4B1C',
  },
  counterLabel: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#A07CFA',
    borderRadius: 16,
    padding: 12,
    fontSize: 22,
    marginBottom: 16,
    marginTop: 8,
    color: '#222',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: '#ECECEC',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
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

export default CounterControls;
