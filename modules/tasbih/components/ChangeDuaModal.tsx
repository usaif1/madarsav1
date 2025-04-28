// ChangeDuaModal.tsx
import React from 'react';
import {
  View,
  Text,
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
import { verticalScale } from '@/theme/responsive';

// Get screen dimensions for calculations
const { height: screenHeight } = Dimensions.get('window');

export interface Dua {
  verses: {
    arabic: string;
    transliteration: string;
    translation: string;
  }[];
}

interface ChangeDuaModalProps {
  visible: boolean;
  duaList: Dua[];
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
  const renderDuaItem = ({ item, index }: { item: Dua; index: number }) => (
    <TouchableOpacity
      style={styles.duaRow}
      onPress={() => onSelect(index)}
      activeOpacity={0.7}
    >
      <View style={styles.duaTextWrap}>
        <Text style={styles.arabic}>{item.verses[0].arabic}</Text>
        <Text style={styles.transliteration}>{item.verses[0].transliteration}</Text>
        <Text style={styles.translation}>{item.verses[0].translation}</Text>
      </View>
      <View style={styles.bubbleWrap}>
        <Bubble width={32} height={32} />
        <Text style={styles.bubbleNum}>{index + 1}</Text>
      </View>
    </TouchableOpacity>
  );
  
  // Extract a unique key for each item in the FlatList
  const keyExtractor = (_: Dua, index: number) => `dua-${index}`;
  
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
        <View style={styles.header}>
          <Text style={styles.title}>Change dua</Text>
          <Pressable onPress={onClose} hitSlop={16}>
            <Close width={24} height={24} />
          </Pressable>
        </View>
        
        {/* Fixed tap row */}
        <View style={styles.tapRow}>
          <LeftFlowerChangeDua width={34} height={34} />
          <Text style={styles.tapText}>Tap to change dua</Text>
          <RightFlowerChangeDua width={34} height={34} />
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
    paddingBottom: 6,
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
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: '#fff',
  },
  bubbleWrap: {
    marginTop: 4,
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
    fontWeight: '700',
    fontSize: 17,
    color: '#A07CFA',
  },
  duaTextWrap: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 0,
  },
  arabic: {
    fontSize: 22,
    color: '#222',
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 2,
  },
  transliteration: {
    fontSize: 13,
    color: '#A07CFA',
    textAlign: 'left',
    marginBottom: 1,
    marginTop: 1,
  },
  translation: {
    fontSize: 13,
    color: '#888',
    textAlign: 'left',
    marginBottom: 0,
  },
});

export default ChangeDuaModal;