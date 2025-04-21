import {StyleSheet, View} from 'react-native';
import React from 'react';

// components
import {Body2Medium, Divider, Title3Bold} from '@/components';

// store
import {useThemeStore} from '@/globalStore';
import FastImage from 'react-native-fast-image';

const GeographicDetails: React.FC = () => {
  const {colors} = useThemeStore();

  return (
    <View style={styles.container}>
      <View style={[styles.metric, {backgroundColor: colors.accent.accent100}]}>
        <FastImage
          source={require('@/assets/compass/Kaaba.png')}
          resizeMode={FastImage.resizeMode.cover}
          style={{width: 34, height: 28}}
        />
        <Divider height={8} />
        <Title3Bold>3,840 KM</Title3Bold>
        <Divider height={4} />
        <Body2Medium color="yellow-800">Distance to Kaaba</Body2Medium>
      </View>

      <View style={[styles.metric, {backgroundColor: colors.accent.accent100}]}>
        <FastImage
          source={require('@/assets/compass/compass_3d.png')}
          resizeMode={FastImage.resizeMode.cover}
          style={{width: 34, height: 28}}
        />
        <Divider height={8} />
        <Title3Bold>294°</Title3Bold>
        <Divider height={4} />
        <Body2Medium color="yellow-800">Device angle to Qibla</Body2Medium>
      </View>
    </View>
  );
};

export default GeographicDetails;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 12,
  },
  metric: {
    paddingHorizontal: 12,
    paddingVertical: 13,
    flex: 1,
    borderRadius: 10,
  },
});
