import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import Modal from 'react-native-modal';

// Get screen dimensions for calculations
const { height: screenHeight } = Dimensions.get('window');
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body1Title2Bold, Body1Title2Medium, Title3Bold } from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';

interface ChangeJuzzModalProps {
  visible: boolean;
  onClose: () => void;
  currentJuzzId: number;
  onJuzzChange: (juzzId: number, juzzName: string) => void;
}

// Sample data for Juzz with proper names and ayah counts
const JUZZ_LIST = [
  { id: 1, name: 'Juzz 1', ayahCount: 148 },
  { id: 2, name: 'Juzz 2', ayahCount: 111 },
  { id: 3, name: 'Juzz 3', ayahCount: 126 },
  { id: 4, name: 'Juzz 4', ayahCount: 132 },
  { id: 5, name: 'Juzz 5', ayahCount: 124 },
  { id: 6, name: 'Juzz 6', ayahCount: 110 },
  { id: 7, name: 'Juzz 7', ayahCount: 149 },
  { id: 8, name: 'Juzz 8', ayahCount: 142 },
  { id: 9, name: 'Juzz 9', ayahCount: 159 },
  { id: 10, name: 'Juzz 10', ayahCount: 129 },
  { id: 11, name: 'Juzz 11', ayahCount: 123 },
  { id: 12, name: 'Juzz 12', ayahCount: 111 },
  { id: 13, name: 'Juzz 13', ayahCount: 108 },
  { id: 14, name: 'Juzz 14', ayahCount: 107 },
  { id: 15, name: 'Juzz 15', ayahCount: 128 },
  { id: 16, name: 'Juzz 16', ayahCount: 118 },
  { id: 17, name: 'Juzz 17', ayahCount: 117 },
  { id: 18, name: 'Juzz 18', ayahCount: 101 },
  { id: 19, name: 'Juzz 19', ayahCount: 113 },
  { id: 20, name: 'Juzz 20', ayahCount: 114 },
  { id: 21, name: 'Juzz 21', ayahCount: 112 },
  { id: 22, name: 'Juzz 22', ayahCount: 118 },
  { id: 23, name: 'Juzz 23', ayahCount: 134 },
  { id: 24, name: 'Juzz 24', ayahCount: 137 },
  { id: 25, name: 'Juzz 25', ayahCount: 99 },
  { id: 26, name: 'Juzz 26', ayahCount: 159 },
  { id: 27, name: 'Juzz 27', ayahCount: 170 },
  { id: 28, name: 'Juzz 28', ayahCount: 137 },
  { id: 29, name: 'Juzz 29', ayahCount: 180 },
  { id: 30, name: 'Juzz 30', ayahCount: 564 },
];

const ITEM_HEIGHT = 40;

const ChangeJuzzModal: React.FC<ChangeJuzzModalProps> = ({
  visible,
  onClose,
  currentJuzzId,
  onJuzzChange,
}) => {
  const [selectedJuzzId, setSelectedJuzzId] = useState(currentJuzzId);
  const juzzScrollRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible) {
      setSelectedJuzzId(currentJuzzId);
      
      // Scroll to current juzz position after a short delay
      setTimeout(() => {
        const initialJuzzIndex = JUZZ_LIST.findIndex(j => j.id === currentJuzzId);
        if (initialJuzzIndex >= 0) {
          juzzScrollRef.current?.scrollToIndex({
            index: initialJuzzIndex,
            animated: false,
            viewPosition: 0.5,
          });
        }
      }, 100);
    }
  }, [visible, currentJuzzId]);

  const handleJuzzSelect = (juzzId: number) => {
    setSelectedJuzzId(juzzId);
  };

  const handleConfirm = () => {
    const selectedJuzz = JUZZ_LIST.find(j => j.id === selectedJuzzId);
    if (selectedJuzz) {
      onJuzzChange(selectedJuzzId, selectedJuzz.name);
    }
    onClose();
  };

  const renderJuzzItem = ({ item }: { item: typeof JUZZ_LIST[0] }) => {
    const isSelected = item.id === selectedJuzzId;
    return (
      <TouchableOpacity
        style={[styles.juzzItem, isSelected && styles.selectedJuzzItem]}
        onPress={() => handleJuzzSelect(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.juzzItemContent}>
          {isSelected ? (
            <Body1Title2Bold style={styles.selectedJuzzName}>
              {item.name}
            </Body1Title2Bold>
          ) : (
            <Body1Title2Medium style={styles.juzzName}>
              {item.name}
            </Body1Title2Medium>
          )}
          
          {isSelected ? (
            <Body1Title2Bold style={styles.selectedAyahCount}>
              {item.ayahCount} Ayahs
            </Body1Title2Bold>
          ) : (
            <Body1Title2Medium style={styles.ayahCount}>
              {item.ayahCount} Ayahs
            </Body1Title2Medium>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
          <Title3Bold style={styles.title}>Change Juzz</Title3Bold>
          <TouchableOpacity onPress={onClose} hitSlop={16}>
            <CdnSvg path={DUA_ASSETS.CLOSE_ICON} width={scale(16)} height={scale(16)} />
          </TouchableOpacity>
        </View>
        
        {/* Column headings */}
        <View style={styles.columnHeadings}>
          <Body1Title2Bold style={styles.columnTitle}>Juzz</Body1Title2Bold>
          <Body1Title2Bold style={styles.columnTitle}>Ayahs</Body1Title2Bold>
        </View>
        
        {/* Juzz list */}
        <View style={styles.listContainer}>
          <FlatList
            ref={juzzScrollRef}
            data={JUZZ_LIST}
            renderItem={renderJuzzItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            getItemLayout={(_, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                juzzScrollRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                  viewPosition: 0.5,
                });
              }, 100);
            }}
          />
        </View>
        
        {/* Confirm button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Body1Title2Bold style={styles.confirmButtonText}>Confirm</Body1Title2Bold>
          </TouchableOpacity>
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
    height: Math.min(verticalScale(500), screenHeight * 0.7),
    maxHeight: screenHeight * 0.4,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  columnHeadings: {
    backgroundColor: '#F9F6FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(10),
    paddingHorizontal: 18,
    height: 40,
  },
  columnTitle: {
    color: '#171717',
    fontWeight: '700',
    fontSize: scale(14),
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 18,
    overflow: 'hidden',
  },
  listContent: {
    paddingVertical: scale(8),
  },
  juzzItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: scale(10),
    borderRadius: 8,
  },
  selectedJuzzItem: {
    backgroundColor: '#F5F5F5',
  },
  juzzItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  juzzName: {
    color: '#171717',
    fontSize: scale(14),
  },
  selectedJuzzName: {
    color: '#171717',
    fontSize: scale(14),
  },
  ayahCount: {
    color: '#737373',
    fontSize: scale(14),
  },
  selectedAyahCount: {
    color: '#737373',
    fontSize: scale(14),
  },
  buttonContainer: {
    padding: scale(16),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  confirmButton: {
    backgroundColor: ColorPrimary.primary500,
    paddingVertical: scale(12),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: scale(14),
  },
});

export default ChangeJuzzModal; 