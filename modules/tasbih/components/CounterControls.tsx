import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import rosaryBead from '@/assets/tasbih/rosaryBead.png';
import ResetIcon from '@/assets/tasbih/resetViolet.svg';
import { Body1Title2Bold } from '@/components/Typography/Typography';
import { useThemeStore } from '@/globalStore';
import ResetCounterModal from './ResetCounterModal';
import CustomBeadModal from './CustomBeadModal';

const PRESET_BEADS = [11, 33, 99];

interface CounterControlsProps {
  selectedCount: number;
  onSelectCounter: () => void; // Changed to not expect a count parameter
  onReset: () => void;
  onCustomBead?: (count: number) => void;
}

const CounterControls: React.FC<CounterControlsProps> = ({ 
  selectedCount, 
  onSelectCounter, 
  onReset, 
  onCustomBead
}) => {
  const { colors } = useThemeStore();
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [customBeadModalVisible, setCustomBeadModalVisible] = useState(false);
  const [customBeadValue, setCustomBeadValue] = useState('');
  const [inputTouched, setInputTouched] = useState(false);

  const handleCustomBeadSave = () => {
    if (customBeadValue && parseInt(customBeadValue) > 0) {
      if (onCustomBead) {
        onCustomBead(parseInt(customBeadValue));
      }
      setCustomBeadModalVisible(false);
    }
  };

  const handleResetCurrent = () => {
    setResetModalVisible(false);
    onReset();
  };
  
  const handleResetAll = () => {
    setResetModalVisible(false);
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
        <Pressable style={styles.selectBtn} onPress={onSelectCounter}>
          <Body1Title2Bold style={styles.selectCounterText}>
            Select counter 
          </Body1Title2Bold>
          <Body1Title2Bold style={styles.counterNumber}> ({selectedCount})</Body1Title2Bold>
        </Pressable>
        <Pressable style={styles.resetBtn} onPress={() => setResetModalVisible(true)}>
          <ResetIcon width={18} height={18} style={{ marginRight: 4 }} />
          <Body1Title2Bold style={styles.resetText}>Reset</Body1Title2Bold>
        </Pressable>
      </View>
      
      <ResetCounterModal
        visible={resetModalVisible}
        onClose={() => setResetModalVisible(false)}
        onResetCurrent={handleResetCurrent}
        onResetAll={handleResetAll}
      />
      
      <CustomBeadModal
        visible={customBeadModalVisible}
        value={customBeadValue}
        onChangeValue={setCustomBeadValue}
        onSave={handleCustomBeadSave}
        onClose={() => setCustomBeadModalVisible(false)}
        inputTouched={inputTouched}
        setInputTouched={setInputTouched}
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
    backgroundColor: '#F7F3FF',
    height: 36,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 4,
    marginRight: 8,
  },
  selectCounterText: {
    color: '#8A57DC',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterNumber: {
    color: '#8A57DC',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 2,
  },
  resetBtn: {
    width: 97,
    height: 36,
    borderRadius: 60,
    flexDirection: 'row',borderWidth: 1,
    borderColor: '#F1EAFD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 4,
  },
  resetText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '700',
    marginLeft: 2,
  },
});

export default CounterControls;