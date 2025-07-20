import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import quranService from '../../services/quranService';
import { Juz } from '../../types/quranFoundationTypes';

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


const ITEM_HEIGHT = 40;

const ChangeJuzzModal: React.FC<ChangeJuzzModalProps> = ({
  visible,
  onClose,
  currentJuzzId,
  onJuzzChange,
}) => {
  const [selectedJuzzId, setSelectedJuzzId] = useState(currentJuzzId);
  const [juzList, setJuzList] = useState<Juz[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const juzzScrollRef = useRef<FlatList>(null);

  // Fetch juz data
  useEffect(() => {
    const fetchJuzs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const juzsData = await quranService.getAllJuzs();
        setJuzList(juzsData);
      } catch (error) {
        console.error('Failed to fetch juzs:', error);
        setError('Failed to load juzs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJuzs();
  }, []);

  // Handle modal visibility and scroll to current juz
  useEffect(() => {
    if (visible && juzList.length > 0) {
      setSelectedJuzzId(currentJuzzId);
      
      // Scroll to current juzz position after a short delay
      setTimeout(() => {
        const initialJuzzIndex = juzList.findIndex(j => j.juz_number === currentJuzzId);
        if (initialJuzzIndex >= 0) {
          juzzScrollRef.current?.scrollToIndex({
            index: initialJuzzIndex,
            animated: false,
            viewPosition: 0.5,
          });
        }
      }, 100);
    }
  }, [visible, currentJuzzId, juzList]);

  const handleJuzzSelect = (juzzId: number) => {
    setSelectedJuzzId(juzzId);
  };

  const handleConfirm = () => {
    const selectedJuz = juzList.find(j => j.juz_number === selectedJuzzId);
    if (selectedJuz) {
      onJuzzChange(selectedJuzzId, `Juz ${selectedJuz.juz_number}`);
    }
    onClose();
  };

  const renderJuzzItem = ({ item }: { item: Juz }) => {
    const isSelected = item.juz_number === selectedJuzzId;
    return (
      <TouchableOpacity
        style={[styles.juzzItem, isSelected && styles.selectedJuzzItem]}
        onPress={() => handleJuzzSelect(item.juz_number)}
        activeOpacity={0.7}
      >
        <View style={styles.juzzItemContent}>
          {isSelected ? (
            <Body1Title2Bold style={styles.selectedJuzzName}>
              Juz {item.juz_number}
            </Body1Title2Bold>
          ) : (
            <Body1Title2Medium style={styles.juzzName}>
              Juz {item.juz_number}
            </Body1Title2Medium>
          )}
          
          {isSelected ? (
            <Body1Title2Bold style={styles.selectedAyahCount}>
              {item.verses_count} Ayahs
            </Body1Title2Bold>
          ) : (
            <Body1Title2Medium style={styles.ayahCount}>
              {item.verses_count} Ayahs
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
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={ColorPrimary.primary500} />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Body1Title2Medium style={styles.errorText}>{error}</Body1Title2Medium>
            </View>
          ) : (
            <FlatList
              ref={juzzScrollRef}
              data={juzList}
              renderItem={renderJuzzItem}
              keyExtractor={(item) => item.juz_number.toString()}
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
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(16),
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
  },
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
    width: '100%',
    height: Math.min(verticalScale(500), screenHeight * 0.7),
    maxHeight: screenHeight * 0.4,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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