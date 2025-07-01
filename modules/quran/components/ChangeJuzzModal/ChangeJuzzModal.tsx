import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import Modal from 'react-native-modal';

// Get screen dimensions for calculations
const { height: screenHeight } = Dimensions.get('window');
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body1Title2Bold, Body1Title2Medium } from '@/components/Typography/Typography';
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

// Sample ayah numbers (max ayahs for any given juzz)
const AYAH_LIST = Array.from({ length: 300 }, (_, i) => i + 1);

const ChangeJuzzModal: React.FC<ChangeJuzzModalProps> = ({
  visible,
  onClose,
  currentJuzzId,
  onJuzzChange,
}) => {
  const [selectedJuzzId, setSelectedJuzzId] = useState(currentJuzzId);
  const [selectedAyahNumber, setSelectedAyahNumber] = useState(1);
  const juzzScrollRef = useRef<FlatList>(null);
  const ayahScrollRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible) {
      setSelectedJuzzId(currentJuzzId);
      setSelectedAyahNumber(1);
      
      // Scroll to current juzz position after a short delay
      setTimeout(() => {
        const initialJuzzIndex = Math.max(0, currentJuzzId - 3);
        juzzScrollRef.current?.scrollToIndex({
          index: initialJuzzIndex,
          animated: false,
          viewPosition: 0.5,
        });
      }, 100);
    }
  }, [visible, currentJuzzId]);

  const handleJuzzSelect = (juzzId: number) => {
    setSelectedJuzzId(juzzId);
    // Reset ayah to 1 when juzz changes
    setSelectedAyahNumber(1);
    
    setTimeout(() => {
      ayahScrollRef.current?.scrollToIndex({
        index: 0,
        animated: true,
        viewPosition: 0.5,
      });
    }, 100);
  };

  const handleAyahSelect = (ayahNumber: number) => {
    setSelectedAyahNumber(ayahNumber);
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
        style={[styles.listItem, isSelected && styles.selectedItem]}
        onPress={() => handleJuzzSelect(item.id)}
        activeOpacity={0.7}
      >
        <Body1Title2Medium style={[
          styles.itemText,
          isSelected && styles.selectedItemText
        ]}>
          {item.name}
        </Body1Title2Medium>
      </TouchableOpacity>
    );
  };

  const renderAyahItem = ({ item }: { item: number }) => {
    const isSelected = item === selectedAyahNumber;
    return (
      <TouchableOpacity
        style={[styles.listItem, isSelected && styles.selectedItem]}
        onPress={() => handleAyahSelect(item)}
        activeOpacity={0.7}
      >
        <Body1Title2Medium style={[
          styles.itemText,
          isSelected && styles.selectedItemText
        ]}>
          {item}
        </Body1Title2Medium>
      </TouchableOpacity>
    );
  };

  const getItemLayout = (data: any, index: number) => ({
    length: 40,
    offset: 40 * index,
    index,
  });

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
    >
      <View style={styles.modalContent}>
        {/* Header */}
        <View style={styles.header}>
          <Body1Title2Bold style={styles.headerTitle}>Change Juzz</Body1Title2Bold>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <CdnSvg 
              path={DUA_ASSETS.CLOSE_ICON} 
              width={24} 
              height={24} 
            />
          </TouchableOpacity>
        </View>

        {/* Column Headers */}
        <View style={styles.columnHeaders}>
          <View style={styles.headerColumn}>
            <Body1Title2Bold style={styles.columnHeaderText}>Juzz</Body1Title2Bold>
          </View>
          <View style={styles.headerColumn}>
            <Body1Title2Bold style={styles.columnHeaderText}>Ayah</Body1Title2Bold>
          </View>
        </View>

        {/* Lists Container */}
        <View style={styles.listsContainer}>
          {/* Juzz List */}
          <View style={styles.listColumn}>
            <FlatList
              ref={juzzScrollRef}
              data={JUZZ_LIST}
              renderItem={renderJuzzItem}
              keyExtractor={(item) => item.id.toString()}
              getItemLayout={getItemLayout}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              onScrollToIndexFailed={(info) => {
                const wait = new Promise(resolve => setTimeout(resolve, 500));
                wait.then(() => {
                  juzzScrollRef.current?.scrollToIndex({ 
                    index: info.index, 
                    animated: true,
                    viewPosition: 0.5,
                  });
                });
              }}
            />
          </View>

          {/* Ayah List */}
          <View style={styles.listColumn}>
            <FlatList
              ref={ayahScrollRef}
              data={AYAH_LIST}
              renderItem={renderAyahItem}
              keyExtractor={(item) => item.toString()}
              getItemLayout={getItemLayout}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              onScrollToIndexFailed={(info) => {
                const wait = new Promise(resolve => setTimeout(resolve, 500));
                wait.then(() => {
                  ayahScrollRef.current?.scrollToIndex({ 
                    index: info.index, 
                    animated: true,
                    viewPosition: 0.5,
                  });
                });
              }}
            />
          </View>
        </View>

        {/* Confirm Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Body1Title2Bold style={styles.confirmButtonText}>Confirm</Body1Title2Bold>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    paddingBottom: 0,
    height: Math.min(verticalScale(600), screenHeight * 0.8),
    maxHeight: '60%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 18 * 1.45,
    color: '#0A0A0A',
    fontWeight: '700',
  },
  closeButton: {
    padding: scale(4),
  },
  columnHeaders: {
    width: 375,
    height: 40,
    backgroundColor: '#F9F6FF',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  headerColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnHeaderText: {
    fontSize: 14,
    lineHeight: 14 * 1.45,
    color: '#0A0A0A',
    fontWeight: '700',
  },
  listsContainer: {
    flexDirection: 'row',
    flex: 1,
    width: 375,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  listColumn: {
    flex: 1,
  },
  listContent: {
    paddingVertical: scale(10),
  },
  listItem: {
    width: 339,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  selectedItem: {
    backgroundColor: '#F5F5F5',
  },
  itemText: {
    fontSize: 14,
    lineHeight: 14 * 1.45,
    color: '#0A0A0A',
    fontWeight: '500',
  },
  selectedItemText: {
    fontWeight: '700',
  },
  buttonContainer: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
  },
  confirmButton: {
    backgroundColor: ColorPrimary.primary500,
    borderRadius: scale(12),
    paddingVertical: scale(16),
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    lineHeight: 16 * 1.45,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default ChangeJuzzModal; 