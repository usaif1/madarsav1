// dependencies
import {StyleSheet, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

// store
import {useThemeStore} from '@/globalStore';
import {
  Body1Title2Bold,
  Body1Title2Medium,
  Body1Title2Regular,
  Divider,
} from '@/components';

// components
import { CdnSvg } from '@/components/CdnSvg';

const prayerTimes = [
  {name: 'Fajr', time: '5:51', icon: 'fajr'},
  {name: 'Dhuhr', time: '12:27', icon: 'dhuhr'},
  {name: 'Asr', time: '3:21', icon: 'asr'},
  {name: 'Maghrib', time: '5:40', icon: 'maghrib'},
  {name: 'Isha', time: '7:04', icon: 'isha'},
];

const SplashScreenGraphic: React.FC = () => {
  const {colors} = useThemeStore();

  return (
    <LinearGradient
      style={{width: '100%', borderRadius: 16}}
      colors={['#8A57DC', colors.primary.primary700]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}>
      <View style={styles.prayerTimingsContainer}>
        {prayerTimes.map((prayer, index) => (
          <View
            key={index}
            style={{
              alignItems: 'center',
              opacity: prayer.name === 'Maghrib' ? 1 : 0.5,
            }}>
            <CdnSvg path={`/assets/splash/${prayer.icon}.svg`} width={24} height={24} />
            <Divider height={6} />
            {prayer.name !== 'Maghrib' ? (
              <Body1Title2Medium color="white">{prayer.name}</Body1Title2Medium>
            ) : (
              <Body1Title2Bold color="white">{prayer.name}</Body1Title2Bold>
            )}
            <Body1Title2Regular color="white">{prayer.time}</Body1Title2Regular>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
};

export default SplashScreenGraphic;

const styles = StyleSheet.create({
  prayerTimingsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
});
