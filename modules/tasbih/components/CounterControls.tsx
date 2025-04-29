import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import rosaryBead from '@/assets/tasbih/rosaryBead.png';
import ResetIcon from '@/assets/tasbih/resetViolet.svg';
import { Body1Title2Bold } from '@/components/Typography/Typography';
import { useThemeStore } from '@/globalStore';
import ResetCounterModal from './ResetCounterModal';
import CustomBeadModal from './CustomBeadModal';
import { scale, verticalScale } from '@/theme/responsive';
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
      <View style={[styles.row, { borderTopColor: colors.primary.primary100 }]}>
  <FastImage
    source={rosaryBead}
    style={styles.beadImg}
    resizeMode={FastImage.resizeMode.contain}
  />
  <Pressable
    style={[styles.selectBtn, { backgroundColor: colors.primary.primary50 }]}
    onPress={onSelectCounter}
  >
    <Body1Title2Bold style={[styles.selectCounterText, { color: colors.primary.primary600 }]}>
      Select counter
    </Body1Title2Bold>
    <Body1Title2Bold style={[styles.counterNumber, { color: colors.primary.primary600 }]}>
      ({selectedCount})
    </Body1Title2Bold>
  </Pressable>
  <Pressable
    style={[styles.resetBtn, { borderColor: colors.primary.primary100 }]}
    onPress={() => setResetModalVisible(true)}
  >
    <ResetIcon width={scale(18)} height={scale(18)} style={{ marginRight: scale(4) }} />
    <Body1Title2Bold style={[styles.resetText, { color: colors.secondary.neutral500 }]}>
      Reset
    </Body1Title2Bold>
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
    paddingTop: verticalScale(12),
    paddingHorizontal: scale(18),
    borderTopWidth: 1,
  },
  beadImg: {
    width: scale(36),
    height: scale(36),
    marginRight: scale(8),
    borderRadius: scale(18),
    backgroundColor: 'transparent',
  },
  selectBtn: {
    width: scale(182),
    height: scale(36),
    borderRadius: scale(60),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    marginRight: scale(8),
  },
  selectCounterText: {
    fontSize: scale(14),
    fontWeight: '400',
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterNumber: {
    fontWeight: '700',
    fontSize: scale(14),
    marginLeft: scale(2),
  },
  resetBtn: {
    width: scale(97),
    height: scale(36),
    borderRadius: scale(60),
    flexDirection: 'row',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
  },
  resetText: {
    fontSize: scale(14),
    fontWeight: '700',
    marginLeft: scale(2),
  },
});

export default CounterControls;