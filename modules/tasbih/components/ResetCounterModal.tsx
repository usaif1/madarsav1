import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import ResetIcon from '@/assets/tasbih/resetViolet.svg';
import { scale } from '@/theme/responsive';
import { Title3Bold, Body1Title2Medium, Body1Title2Bold } from '@/components/Typography/Typography';

interface ResetCounterModalProps {
  visible: boolean;
  onClose: () => void;
  onResetCurrent: () => void;
  onResetAll: () => void;
}

const ResetCounterModal: React.FC<ResetCounterModalProps> = ({ visible, onClose, onResetCurrent, onResetAll }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.iconWrap}>
            <ResetIcon width={38} height={38} />
          </View>
          <Title3Bold style={styles.title}>Reset counter</Title3Bold>
          <Body1Title2Medium style={styles.subtitle}>Sure to reset the counter?</Body1Title2Medium>
          <TouchableOpacity style={styles.resetBtn} onPress={onResetCurrent}>
            <Body1Title2Bold style={styles.resetBtnText}>Reset current counter</Body1Title2Bold>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetAllBtn} onPress={onResetAll}>
            <Body1Title2Bold style={styles.resetAllBtnText}>Reset all counters</Body1Title2Bold>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Body1Title2Bold style={styles.closeBtnText}>✕  Close</Body1Title2Bold>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
    width: scale(335),
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 12,
    elevation: 8,
  },
  iconWrap: {
    backgroundColor: '#F7F3FF',
    borderRadius: 38,
    padding: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 15,
    color: '#737373',
    marginBottom: 18,
  },
  resetBtn: {
    backgroundColor: '#6D2DD3',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  resetAllBtn: {
    backgroundColor: '#F0EAFB',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 14,
    width: '100%',
    alignItems: 'center',
  },
  resetAllBtnText: {
    color: '#8A57DC',
    fontSize: 17,
    fontWeight: '700',
  },
  closeBtn: {
    marginTop: 6,
    alignItems: 'center',
    width: '100%',
    paddingBottom: 14,
  },
  closeBtnText: {
    color: '#8A57DC',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
});

export default ResetCounterModal;
