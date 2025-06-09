import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import { getCdnUrl } from '@/utils/cdnUtils';
import { Body1Title2Bold, Body1Title2Medium } from '@/components/Typography/Typography';
import { useThemeStore } from '@/globalStore';
import ResetCounterModal from './ResetCounterModal';
import CustomBeadModal from './CustomBeadModal';
import { scale, verticalScale } from '@/theme/responsive';
import { ShadowColors } from '@/theme/shadows';

const PRESET_BEADS = [11, 33, 99];

interface CounterControlsProps {
  currentCount: number;
  selectedCount: number;
  onSelectCounter: () => void; 
  onReset: () => void;
  onCustomBead?: (count: number) => void;
  onSelectBead?: () => void;
}

const CounterControls: React.FC<CounterControlsProps> = ({ 
  currentCount,
  selectedCount, 
  onSelectCounter, 
  onReset, 
  onCustomBead,
  onSelectBead
}) => {
  const { colors } = useThemeStore();
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [customBeadModalVisible, setCustomBeadModalVisible] = useState(false);
  const [customBeadValue, setCustomBeadValue] = useState('');
  const [inputTouched, setInputTouched] = useState(false);
  const [isWhite, setIsWhite] = useState(false);

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

  const changeBead = () => {
    setIsWhite(!isWhite);
    if (onSelectBead) {
      onSelectBead();
    }
  };

  return (
    <>
      <View style={[styles.row, { borderTopColor: colors.primary.primary100 }]}>
        <Pressable onPress={() => changeBead()}>
          <FastImage
            source={{ 
              uri: getCdnUrl(isWhite ? DUA_ASSETS.TASBIH_BEAD_WHITE : DUA_ASSETS.TASBIH_BEAD),
              priority: FastImage.priority.normal 
            }}
            style={styles.beadImg}
            resizeMode={FastImage.resizeMode.contain}
          />
        </Pressable>
        <Pressable
          style={[styles.selectBtn, { borderColor: ShadowColors['border-light'] }]}
          onPress={onSelectCounter}
        >
          <Body1Title2Medium color='sub-heading' style={styles.selectCounterText}>
            Select counter
          </Body1Title2Medium>
          <Body1Title2Medium style={[styles.counterNumber, { color: colors.primary.primary600 }]}>
            ({selectedCount})
          </Body1Title2Medium>
        </Pressable>
        <Pressable
          style={[
            styles.resetBtn, 
            { 
              borderColor: colors.primary.primary100,
              backgroundColor: currentCount > 0 ? colors.primary.primary50 : 'transparent'
            }
          ]}
          onPress={() => setResetModalVisible(true)}
        >
          <CdnSvg 
            path={currentCount > 0 ? DUA_ASSETS.TASBIH_RESET_VIOLET : DUA_ASSETS.TASBIH_RESET} 
            width={scale(18)} 
            height={scale(18)} 
            style={{ marginRight: scale(4) }} 
          />
          {currentCount > 0 ? <Body1Title2Bold 
            style={[
              styles.resetText, 
              { color: colors.primary.primary600 }
            ]}
          >
            Reset
          </Body1Title2Bold> : <Body1Title2Medium 
            color='sub-heading'
            style={[
              styles.resetText
            ]}
          >
            Reset
          </Body1Title2Medium>}
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
    borderWidth: 1,
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