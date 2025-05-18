import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {scale, verticalScale} from '@/theme/responsive';
import {Title3Bold, Body1Title2Bold} from '@/components/Typography/Typography';
import {ColorPrimary} from '@/theme/lightColors';

interface GalleryProps {
  onViewAllPress?: () => void;
}

const Gallery: React.FC<GalleryProps> = ({onViewAllPress}) => {
  const handleViewAllPress = () => {
    console.log('View all gallery items pressed');
    if (onViewAllPress) {
      onViewAllPress();
    }
  };

  return (
    <View style={styles.container}>
      {/* Gallery Header */}
      <View style={styles.headerContainer}>
        <Title3Bold color="black">Gallery</Title3Bold>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={handleViewAllPress}
        >
          <Body1Title2Bold style={styles.viewAllText}>View all</Body1Title2Bold>
        </TouchableOpacity>
      </View>

      {/* Gallery Items */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.galleryItemsContainer}
      >
        <View style={styles.galleryItem} />
        <View style={styles.galleryItem} />
        <View style={[styles.galleryItem]} />
        <View style={[styles.galleryItem]} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(20),
    marginBottom: verticalScale(16),
  },
  headerContainer: {
    width: scale(339),
    height: verticalScale(28),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  viewAllButton: {
    width: scale(86),
    height: verticalScale(28),
    paddingVertical: scale(4),
    paddingHorizontal: scale(16),
    borderRadius: scale(60),
    backgroundColor: ColorPrimary.primary100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: scale(12),
    lineHeight: scale(20.3), // 145% of font size
    color: '#8A57DC',
    textAlign: 'center',
  },
  galleryItemsContainer: {
    flexDirection: 'row',
    // paddingRight: scale(16), // Add some padding for the last partial item
  },
  galleryItem: {
    width: scale(132),
    height: scale(132),
    borderRadius: scale(8), // radius-md
    backgroundColor: '#171717',
    marginRight: scale(12),
  },
  lastItem: {
    width: scale(66), // Half width to show there are more items
  },
});

export default Gallery;
