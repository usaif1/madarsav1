import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { scale } from '@/theme/responsive';
import { Body1Title2Bold, Body1Title2Regular } from '@/components/Typography/Typography';
import { useThemeStore } from '@/globalStore';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'Something went wrong. Please try again.',
  onRetry
}) => {
  const { colors } = useThemeStore();

  return (
    <View style={styles.container}>
      <Body1Title2Bold style={styles.errorText}>{message}</Body1Title2Bold>
      
      {onRetry && (
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: colors.primary.primary100 }]} 
          onPress={onRetry}
        >
          <Body1Title2Regular style={[styles.retryText, { color: colors.primary.primary500 }]}>
            Retry
          </Body1Title2Regular>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: scale(16),
    color: '#FF4D4F',
  },
  retryButton: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    borderRadius: scale(4),
  },
  retryText: {
    textAlign: 'center',
  },
});

export default ErrorMessage;
