import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Pressable, Dimensions, ActivityIndicator, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';

// components & data
import { Body1Title2Bold, Body2Medium, Title3Bold } from '@/components';
import Share from '@/assets/share-light.svg';
import RightTriangle from '@/assets/right-triangle.svg';
import Close from '@/assets/close.svg';

// store
import { useThemeStore } from '@/globalStore';

// API hooks
import { useAllNames, transformNamesData, TransformedName } from '../../../hooks/useNames';

const width = Dimensions.get('screen').width;
const CARD_SIZE = Math.min(width, 375);

const NamesList: React.FC = () => {
  const { colors } = useThemeStore();
  const { data, isLoading, error, refetch } = useAllNames();
  
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);

  // Transform the API data to match our component's expected format
  const namesData = data ? transformNamesData(data) : [];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A57DC" />
        <Text style={styles.loadingText}>Loading names...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading names: {error.message}</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={namesData}
        keyExtractor={item => item.id}
        renderItem={({ index, item }) => (
          <NameCard
            index={index}
            item={item}
            setIsVisible={setIsVisible}
            setCurrentItemIndex={setCurrentItemIndex}
          />
        )}
      />
      <Modal
        isVisible={isVisible}
        backdropOpacity={0.9}
        style={stylesModal.modal}
        backdropColor="#171717">
        <View style={stylesModal.card}>
          <Pressable
            style={{ position: 'absolute', top: 70, left: 10 }}
            onPress={() => setIsVisible(false)}>
            <Close />
          </Pressable>

          <View
            style={{
              position: 'absolute',
              top: 70,
              backgroundColor: colors.secondary.neutral600,
              paddingHorizontal: 12,
              borderRadius: 100,
              paddingVertical: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Body1Title2Bold color="white">
              {currentItemIndex + 1}/99
            </Body1Title2Bold>
          </View>

          <FastImage
            source={require('@/assets/names/name_xxl.png')}
            style={stylesModal.image}
            resizeMode={FastImage.resizeMode.cover}
          />

          {/* Action Buttons */}
          <View style={stylesModal.actions}>
            <Pressable
              onPress={() => setIsVisible(false)}
              style={[
                stylesModal.btn,
                { backgroundColor: colors.secondary.neutral600 },
              ]}>
              <Close />
              <Body1Title2Bold color="white">Close</Body1Title2Bold>
            </Pressable>

            <Pressable style={[stylesModal.btn, { backgroundColor: '#8A57DC' }]}>
              <RightTriangle />
              <Body1Title2Bold color="white">Listen</Body1Title2Bold>
            </Pressable>

            <Pressable
              style={[
                stylesModal.btn,
                { backgroundColor: colors.secondary.neutral600 },
              ]}>
              <Share />
              <Body1Title2Bold color="white">Share</Body1Title2Bold>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

interface NameCardProps {
  item: TransformedName;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
  setCurrentItemIndex: React.Dispatch<React.SetStateAction<number>>;
}

const NameCard: React.FC<NameCardProps> = ({
  item,
  index,
  setIsVisible,
  setCurrentItemIndex,
}) => {
  return (
    <Pressable
      onPress={() => {
        setCurrentItemIndex(index);
        setIsVisible(true);
      }}
      style={[styles.item, { borderTopWidth: index === 0 ? 1 : 0 }]}>
      {/* ▶️ The FastImage avatar */}
      <FastImage
        source={require('@/assets/names/ar_rahman_large.png')}
        style={styles.avatar}
        resizeMode={FastImage.resizeMode.contain}
      />

      {/* Name & meaning */}
      <View style={styles.textContainer}>
        <Title3Bold>{item.name}</Title3Bold>
        <Body2Medium color="sub-heading">{item.meaning || 'The name of Allah'}</Body2Medium>
      </View>

      {/* Index badge */}
      <View style={styles.indexBadge}>
        <Body1Title2Bold color="primary">{index + 1}</Body1Title2Bold>
      </View>
    </Pressable>
  );
};

export default NamesList;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#737373',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#8A57DC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F9F6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  meaning: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});

const stylesModal = StyleSheet.create({
  modal: {
    margin: 0, // use the whole screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: CARD_SIZE,
    height: CARD_SIZE, // square
    borderRadius: 12,
  },
  /* ---------- actions row ---------- */
  actions: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 12, // RN ‑‑gap support 0.72+
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 32,
    columnGap: 2,
  },
});
