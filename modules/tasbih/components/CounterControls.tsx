import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Modal from 'react-native-modal'; // Import react-native-modal
import FastImage from 'react-native-fast-image';
import rosaryBead from '@/assets/tasbih/rosaryBead.png';
import ResetIcon from '@/assets/tasbih/resetViolet.svg'; // Replace with your actual reset icon
import Pencil from '@/assets/tasbih/pencil.svg'; // For custom beads option
import { Body1Title2Bold } from '@/components/Typography/Typography';
import { useThemeStore } from '@/globalStore';
import ResetCounterModal from './ResetCounterModal'; // Import ResetCounterModal

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
  const [resetModalVisible, setResetModalVisible] = useState(false);

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
  // Reset modal handlers
  const handleResetCurrent = () => {
    setResetModalVisible(false);
    onReset();
  };
  const handleResetAll = () => {
    setResetModalVisible(false);
    // Placeholder: implement reset all logic if needed
    onReset();
  };

  return (
    <>
      <View style={styles.row}>
        <FastImage
          source={rosaryBead}
          style={styles.beadImg}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Pressable style={styles.selectBtn} onPress={() => setModalVisible(true)}>
          <Body1Title2Bold style={styles.selectCounterText}>
            Select counter <Body1Title2Bold style={styles.counterNumber}>({selectedCount})</Body1Title2Bold>
          </Body1Title2Bold>
        </Pressable>
        <Pressable style={styles.resetBtn} onPress={() => setResetModalVisible(true)}>
          <ResetIcon width={18} height={18} style={{ marginRight: 4 }} />
          <Body1Title2Bold style={styles.resetText}>Reset</Body1Title2Bold>
        </Pressable>
      </View>
      <View style={styles.topBorderOnly} />

      {/* Counter Select Modal */}
      <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalSheet}>
          <Body1Title2Bold style={styles.modalTitle}>Select counter</Body1Title2Bold>
          <View style={styles.counterGrid}>
            {PRESET_BEADS.map(count => (
              <TouchableOpacity
                key={count}
                style={[styles.counterOption, selectedCount === count && styles.counterOptionActive]}
                onPress={() => handlePreset(count)}
              >
                <Body1Title2Bold style={styles.counterNum}>{count}</Body1Title2Bold>
                <Body1Title2Bold style={styles.counterLabel}>Beads</Body1Title2Bold>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.counterOption} onPress={handleCustom}>
              <Pencil width={20} height={20} style={{ marginBottom: 2 }} />
              <Body1Title2Bold style={styles.counterLabel}>Set custom beads</Body1Title2Bold>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Custom Bead Modal */}
      <Modal isVisible={customModal} onBackdropPress={() => setCustomModal(false)}>
        <KeyboardAvoidingView
          style={styles.modalSheet}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Body1Title2Bold style={styles.modalTitle}>Set custom beads</Body1Title2Bold>
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
            <Body1Title2Bold style={styles.saveBtnText}>Save</Body1Title2Bold>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      {/* Reset Counter Modal */}
      <ResetCounterModal
        visible={resetModalVisible}
        onClose={() => setResetModalVisible(false)}
        onResetCurrent={handleResetCurrent}
        onResetAll={handleResetAll}
      />
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderTopColor: '#ECECEC',
    borderTopWidth: 1,
  },
  beadImg: {
    width: 36,
    height: 36,
    marginRight: 8,
    borderRadius: 18,
    backgroundColor: 'transparent',
  },
  selectBtn: {
    width: 182,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#F1EAFD',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 4,
    marginRight: 8,
  },
  selectCounterText: {
    color: '#888',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterNumber: {
    color: '#8A57DC',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 2,
  },
  resetBtn: {
    width: 97,
    height: 36,
    backgroundColor: '#F7F3FF',
    borderRadius: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 4,
  },
  resetText: {
    fontSize: 18,
    color: '#8A57DC',
    fontWeight: '700',
    marginLeft: 2,
  },
  topBorderOnly: {
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    width: '100%',
    marginBottom: 0,
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
