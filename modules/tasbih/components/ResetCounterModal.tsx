import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import ResetIcon from '@/assets/tasbih/reset.svg';

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
            <ResetIcon width={38} height={38} style={{ opacity: 0.4 }} />
          </View>
          <Text style={styles.title}>Reset counter</Text>
          <Text style={styles.subtitle}>Sure to reset the counter?</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={onResetCurrent}>
            <Text style={styles.resetBtnText}>Reset current counter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetAllBtn} onPress={onResetAll}>
            <Text style={styles.resetAllBtnText}>Reset all counters</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕ Close</Text>
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
    width: 300,
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
    color: '#6C52EE',
    marginBottom: 4,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 18,
  },
  resetBtn: {
    backgroundColor: '#A07CFA',
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
    backgroundColor: '#F7F3FF',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 14,
    width: '100%',
    alignItems: 'center',
  },
  resetAllBtnText: {
    color: '#A07CFA',
    fontSize: 17,
    fontWeight: '700',
  },
  closeBtn: {
    marginTop: 2,
    alignItems: 'center',
    width: '100%',
  },
  closeBtnText: {
    color: '#A07CFA',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
});

export default ResetCounterModal;
