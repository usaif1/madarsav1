import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { scale, verticalScale } from '@/theme/responsive';
import SavedButton from './SavedButton';

interface SavedFooterProps {
  initialSaved?: boolean;
  onSavedChange?: (saved: boolean) => void;
}

const SavedFooter: React.FC<SavedFooterProps> = ({ 
  initialSaved = false,
  onSavedChange
}) => {
  const [isSaved, setIsSaved] = useState(initialSaved);

  const handleSavedPress = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    if (onSavedChange) {
      onSavedChange(newSavedState);
    }
  };

  return (
    <View style={styles.container}>
      <SavedButton 
        saved={isSaved} 
        onPress={handleSavedPress} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(375),
    height: verticalScale(90),
    justifyContent: 'center',
    alignItems: 'flex-end', 
    paddingHorizontal: scale(24),
  }
});

export default SavedFooter;
