// PrayerRow.tsx
import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

// components
import NextSalahIcon from '@/assets/compass/next_salah_icon.svg';
import {Body2Bold, Body2Medium, Title3Bold} from '@/components';
import {useThemeStore} from '@/globalStore';

const NextSalah: React.FC = () => {
  const {colors} = useThemeStore();

  return (
    <View style={styles.container}>
      {/* ▶ replace this with your icon component or image */}
      <NextSalahIcon />

      <View style={styles.textBlock}>
        <Title3Bold>Isha</Title3Bold>
        <Body2Medium color="sub-heading">1 hr 29 min 3 secs</Body2Medium>
      </View>

      <TouchableOpacity
        style={[styles.pill, {backgroundColor: colors.warning.warning600}]}>
        <Body2Bold color="white">Next Salah</Body2Bold>
      </TouchableOpacity>
    </View>
  );
};

export default NextSalah;

/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F6FF', // light grey row bg
    paddingHorizontal: 20,
    paddingVertical: 12,
    columnGap: 10,
  },

  /* ---- left icon ---- */
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#11111A', // dark square bg for your icon
    marginRight: 16,
  },

  /* ---- text block ---- */
  textBlock: {
    flex: 1,
  },

  /* ---- pill button ---- */
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#B67A19', // brown‑orange from screenshot
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
