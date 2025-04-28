import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
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
  onCustomBead?: () => void;
  onShowCounterModal?: () => void;
}

const CounterControls: React.FC<CounterControlsProps> = ({ selectedCount, onSelectCounter, onReset, onCustomBead, onShowCounterModal }) => {
  const { colors } = useThemeStore();
  const [resetModalVisible, setResetModalVisible] = useState(false);

  const handlePreset = (count: number) => {
    if (onSelectCounter) onSelectCounter(count);
  };
  const handleCustom = () => {
    if (onCustomBead) onCustomBead();
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
        <Pressable style={styles.selectBtn} onPress={onShowCounterModal}>
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
    paddingTop: 12,
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
});

export default CounterControls;
