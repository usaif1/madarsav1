import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { scale, verticalScale } from '@/theme/responsive';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import { CdnSvg } from '@/components/CdnSvg';

interface SavedButtonProps {
  saved: boolean;
  onPress: () => void;
}

const SavedButton: React.FC<SavedButtonProps> = ({ saved, onPress }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        saved ? styles.savedContainer : styles.unsavedContainer
      ]} 
      onPress={onPress}
    >
      <CdnSvg 
        path={saved ? DUA_ASSETS.BOOKMARK_PRIMARY : DUA_ASSETS.BOOKMARK}
        width={16}
        height={16}
      />
      <Text style={[
        styles.text,
        saved ? styles.savedText : styles.unsavedText
      ]}>
        Saved
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(89),
    height: scale(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8), // Primitives/space-2
    paddingTop: scale(10), // Primitives/space-10
    paddingRight: scale(12), // Primitives/space-12
    paddingBottom: scale(10), // Primitives/space-10
    paddingLeft: scale(12), // Primitives/space-12
    borderRadius: scale(60), // rs-60
  },
  savedContainer: {
    backgroundColor: '#171717',
    borderWidth: 0,
  },
  unsavedContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#171717',
  },
  text: {
    fontFamily: 'Geist',
    fontWeight: '700',
    fontSize: scale(14),
    lineHeight: scale(14) * 1.45, // 145%
    letterSpacing: 0,
    textAlignVertical: 'center',
  },
  savedText: {
    color: '#FFFFFF',
  },
  unsavedText: {
    color: '#171717',
  }
});

export default SavedButton;
