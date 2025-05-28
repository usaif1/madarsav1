// ChangeDuaModal.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import Bubble from '@/assets/tasbih/bubble.svg';
import Close from '@/assets/tasbih/close.svg';
import LeftFlowerChangeDua from '@/assets/tasbih/leftFlowerChangeDua.svg';
import RightFlowerChangeDua from '@/assets/tasbih/rightFlowerChangeDua.svg';
import { scale, verticalScale } from '@/theme/responsive';
import { useThemeStore } from '@/globalStore';
import { Body1Title2Bold, Body1Title2Medium, Body2Medium, H5Medium, Title3Bold } from '@/components/Typography/Typography';
import { ShadowColors } from '@/theme/shadows';
import { ColorPrimary, ColorSecondary } from '@/theme/lightColors';
import { TasbihData } from '@/modules/dua/services/duaService';

// Get screen dimensions for calculations
const { height: screenHeight } = Dimensions.get('window');

// We're using the TasbihData interface from duaService.ts
// But we'll keep this for backward compatibility
export interface Dua {
  id: string | number;
  title?: string;
  verses: {
    arabic: string;
    transliteration: string;
    translation: string;
  }[];
  category?: string;
  reference?: string;
}

interface ChangeDuaModalProps {
  visible: boolean;
  duaList: (Dua | TasbihData)[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

const ChangeDuaModal: React.FC<ChangeDuaModalProps> = ({
  visible,
  duaList,
  selectedIndex,
  onSelect,
  onClose,
}) => {
  // Render individual dua item
  const { colors } = useThemeStore();

  const renderDuaItem = ({ item, index }: { item: Dua | TasbihData; index: number }) => (
    <TouchableOpacity
      style={[styles.duaRow, { borderBottomColor: ShadowColors['border-light'] }]}
      onPress={() => onSelect(index)}
      activeOpacity={0.7}
    >
      <View style={styles.duaTextWrap}>
        <View style={{flexDirection: 'row'}}><H5Medium color='heading' style={[styles.arabic]}>
          {item.verses && item.verses[0] ? item.verses[0].arabic : ''}
        </H5Medium>
      <View style={styles.bubbleWrap}>
        <Bubble width={scale(26)} height={scale(26)} />
        <Body1Title2Bold style={[styles.bubbleNum, { color: ColorPrimary.primary600 }]}>
          {index + 1}
        </Body1Title2Bold>
      </View></View>
        <Body2Medium style={[styles.transliteration]}>
          {item.verses && item.verses[0] ? item.verses[0].transliteration : ''}
        </Body2Medium>
        {/* <Body1Title2Medium style={[styles.translation, { color: ColorSecondary.neutral500 }]}>
          {item.verses[0].translation}
        </Body1Title2Medium> */}
      </View>
    </TouchableOpacity>
  );
  
  // Extract a unique key for each item in the FlatList
  const keyExtractor = (item: Dua | TasbihData, index: number) => `dua-${item.id || index}`;
  
  // Log the number of duas for debugging
  console.log(`ChangeDuaModal: Rendering ${duaList.length} duas`);
  
  return (
    <Modal 
      isVisible={visible} 
      onBackdropPress={onClose}
      backdropOpacity={0.5}
      style={styles.modal}
      useNativeDriverForBackdrop={true}
      avoidKeyboard={true}
    >
      <View style={styles.sheet}>
        {/* Fixed header */}
        <View style={[styles.header, { borderBottomColor: ShadowColors['border-light'] }]}>
          <Title3Bold style={styles.title}>Change dua</Title3Bold>
          <Pressable onPress={onClose} hitSlop={16}>
            <Close width={scale(16)} height={scale(16)} />
          </Pressable>
        </View>
        
        {/* Fixed tap row */}
        <View style={[styles.tapRow, { backgroundColor: ColorPrimary.primary50 }]}>
          <LeftFlowerChangeDua width={scale(34)} height={scale(34)} />
          <Body1Title2Bold style={[styles.tapText, { color: ColorPrimary.primary500 }]}>
            Tap to change dua
          </Body1Title2Bold>
          <RightFlowerChangeDua width={scale(34)} height={scale(34)} />
        </View>
        
        {/* Scrollable content area */}
        <View style={styles.listContainer}>
          <FlatList
            data={duaList}
            renderItem={renderDuaItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={true}
            initialNumToRender={8}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true} // Optimize memory usage
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 8,
    paddingBottom: 0,
    paddingHorizontal: 0,
    height: Math.min(verticalScale(800), screenHeight * 0.95), // Use whichever is smaller
    maxHeight: '95%',
    // Removed minHeight to avoid conflicts
    overflow: 'hidden', // Important to contain all children
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1EAFD',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  tapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: verticalScale(34),
    backgroundColor: '#F7F3FF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1EAFD',
  },
  tapText: {
    color: '#A07CFA',
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  // Critical fix - This container ensures FlatList gets proper dimensions
  listContainer: {
    flex: 1, // Take remaining space
    overflow: 'hidden',
  },
  listContent: {
    paddingBottom: 32,
  },
  duaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 6,
    borderBottomColor: '#F5F5F5',
    backgroundColor: '#fff',
  },
  bubbleWrap: {
    marginLeft: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bubbleNum: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 10,
    color: '#A07CFA',
  },
  duaTextWrap: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 0,
  },
  arabic: {
    fontSize: scale(20),
    color: '#222',
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 2,
  },
  transliteration: {
    fontSize: 13,
    marginLeft: 12,
    alignSelf: 'flex-start',
    marginBottom: 1,
    marginTop: 8,
  },
  translation: {
    fontSize: 13,
    color: '#888',
    textAlign: 'left',
    marginBottom: 0,
  },
});

export default ChangeDuaModal;