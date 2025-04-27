import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import Bubble from '@/assets/tasbih/bubble.svg';
import Close from '@/assets/tasbih/close.svg';
import { Body1Title2Bold } from '@/components';

export interface Dua {
  arabic: string;
  transliteration: string;
  translation: string;
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
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Change dua</Text>
            <Pressable onPress={onClose} hitSlop={16}>
              <Close width={28} height={28} />
            </Pressable>
          </View>
          <View style={styles.tapRow}>
            <Text style={styles.tapText}>Tap to change dua</Text>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
            {duaList.map((dua, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.duaRow,
                  idx === selectedIndex && styles.selectedDua,
                ]}
                onPress={() => onSelect(idx)}
                activeOpacity={0.7}
              >
                <View style={styles.bubbleWrap}>
                  <Bubble width={32} height={32} />
                  <Text style={styles.bubbleNum}>{idx + 1}</Text>
                </View>
                <View style={styles.duaTextWrap}>
                  <Text style={styles.arabic}>{dua.arabic}</Text>
                  <Text style={styles.transliteration}>{dua.transliteration}</Text>
                  <Text style={styles.translation}>{dua.translation}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 8,
    paddingBottom: 0,
    paddingHorizontal: 0,
    maxHeight: '92%',
    minHeight: 300,
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
    backgroundColor: '#F7F3FF',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1EAFD',
  },
  tapText: {
    color: '#A07CFA',
    fontWeight: '700',
    fontSize: 16,
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
  selectedDua: {
    backgroundColor: '#F7F3FF',
  },
  bubbleWrap: {
    marginTop: 4,
    marginRight: 12,
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
