import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JuzzStackParamList } from '../../navigation/juzz.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, H5Bold, CaptionMedium } from '@/components/Typography/Typography';
import CloseIcon from '@/assets/close.svg';

// Define the type for a Juzz item
type JuzzItem = {
  id: number;
  name: string;
  ayahCount: number;
};

// Sample data for Juzz
const JUZZ_LIST: JuzzItem[] = [
  { id: 1, name: 'Juzz 1', ayahCount: 141 },
  { id: 2, name: 'Juzz 2', ayahCount: 111 },
  { id: 3, name: 'Juzz 3', ayahCount: 127 },
  { id: 4, name: 'Juzz 4', ayahCount: 137 },
  { id: 5, name: 'Juzz 5', ayahCount: 124 },
  { id: 6, name: 'Juzz 6', ayahCount: 111 },
  { id: 7, name: 'Juzz 7', ayahCount: 121 },
  { id: 8, name: 'Juzz 8', ayahCount: 111 },
  { id: 9, name: 'Juzz 9', ayahCount: 127 },
  { id: 10, name: 'Juzz 10', ayahCount: 109 },
  { id: 11, name: 'Juzz 11', ayahCount: 123 },
  { id: 12, name: 'Juzz 12', ayahCount: 111 },
  { id: 13, name: 'Juzz 13', ayahCount: 115 },
  { id: 14, name: 'Juzz 14', ayahCount: 107 },
  { id: 15, name: 'Juzz 15', ayahCount: 128 },
  { id: 16, name: 'Juzz 16', ayahCount: 118 },
  { id: 17, name: 'Juzz 17', ayahCount: 112 },
  { id: 18, name: 'Juzz 18', ayahCount: 114 },
  { id: 19, name: 'Juzz 19', ayahCount: 98 },
  { id: 20, name: 'Juzz 20', ayahCount: 124 },
  { id: 21, name: 'Juzz 21', ayahCount: 112 },
  { id: 22, name: 'Juzz 22', ayahCount: 118 },
  { id: 23, name: 'Juzz 23', ayahCount: 118 },
  { id: 24, name: 'Juzz 24', ayahCount: 135 },
  { id: 25, name: 'Juzz 25', ayahCount: 122 },
  { id: 26, name: 'Juzz 26', ayahCount: 115 },
  { id: 27, name: 'Juzz 27', ayahCount: 126 },
  { id: 28, name: 'Juzz 28', ayahCount: 137 },
  { id: 29, name: 'Juzz 29', ayahCount: 175 },
  { id: 30, name: 'Juzz 30', ayahCount: 564 },
];

type ChangeJuzzScreenRouteProp = RouteProp<JuzzStackParamList, 'changeJuzz'>;
type ChangeJuzzScreenNavigationProp = NativeStackNavigationProp<JuzzStackParamList, 'changeJuzz'>;

const ChangeJuzzScreen: React.FC = () => {
  const route = useRoute<ChangeJuzzScreenRouteProp>();
  const navigation = useNavigation<ChangeJuzzScreenNavigationProp>();
  const { currentJuzzId } = route.params;
  const [selectedJuzzId, setSelectedJuzzId] = useState(currentJuzzId);

  // Handle juzz selection
  const handleJuzzSelect = (juzzId: number) => {
    setSelectedJuzzId(juzzId);
  };

  // Handle confirm button press
  const handleConfirm = () => {
    // Navigate back to juzz detail with the selected juzz
    const selectedJuzz = JUZZ_LIST.find(juzz => juzz.id === selectedJuzzId);
    if (selectedJuzz) {
      navigation.navigate('juzzDetail', {
        juzzId: selectedJuzz.id,
        juzzName: selectedJuzz.name
      });
    }
  };

  // Render a juzz item
  const renderJuzzItem = ({ item }: { item: JuzzItem }) => (
    <TouchableOpacity 
      style={[
        styles.juzzItem,
        selectedJuzzId === item.id && styles.selectedJuzzItem
      ]}
      onPress={() => handleJuzzSelect(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.juzzItemLeft}>
        <Body2Medium style={styles.juzzNumber}>{item.id}</Body2Medium>
        <Body2Medium>{item.name}</Body2Medium>
      </View>
      <Body2Medium style={styles.ayahCount}>{item.ayahCount}</Body2Medium>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <H5Bold>Change Juzz</H5Bold>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CloseIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Juzz list */}
      <FlatList
        data={JUZZ_LIST}
        renderItem={renderJuzzItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Confirm button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Body2Bold style={styles.confirmButtonText}>Confirm</Body2Bold>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },
  juzzItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedJuzzItem: {
    backgroundColor: ColorPrimary.primary50,
  },
  juzzItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  juzzNumber: {
    width: scale(30),
    color: '#737373',
  },
  ayahCount: {
    color: '#737373',
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
  },
});

export default ChangeJuzzScreen;
