import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Body1Title2Bold } from '@/components';
import { scale, verticalScale } from '@/theme/responsive';

const MaktabScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Body1Title2Bold style={styles.title}>Maktab Module</Body1Title2Bold>
      <Text style={styles.description}>
        This is a placeholder for the Maktab module content.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: scale(20),
  },
  title: {
    fontSize: scale(24),
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  description: {
    fontSize: scale(16),
    textAlign: 'center',
    color: '#666666',
  },
});

export default MaktabScreen;
