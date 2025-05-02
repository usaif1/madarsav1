// modules/hadith/screens/HadithDetailScreen.tsx

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import FastImage from 'react-native-fast-image';
import { Title3Bold, Body1Title2Medium } from '@/components/Typography/Typography';

// Dummy data for demo
const hadithDetail = {
  id: 'bukhari',
  title: 'Sahih al-Bukhari',
  author: 'Abu Abdullah Muhammad Ibn Isma\'il al-Bukhari',
  years: '202-275 AH',
  translator: 'Dr. M. Muhsin Khan',
//   image: 'https://your-image-url.com/bukhari.jpg',
  highlight: 'Contains roughly 7500 Hadith (with repetitions) in 97 books',
  brief: `Sahih al-Bukhari is a collection of hadith compiled by Abu Abdullah Muhammad Ibn Isma\'il al-Bukhari(rahimahullah). His collection is recognised by the overwhelming majority of the Muslim world to be one of the most authentic collections of the Sunnah of the Prophet (ﷺ). It contains roughly 7563 hadith (with repetitions) in 98 books. The translation provided here is by Dr. M. Muhsin Khan.`,
  authorBio: [
    `Imam al-Bukhari (rahimahullah) is known as the Amir al-Mu’minin in hadith. His genealogy is as follows: Abu Abdullah Muhammad Ibn Isma’il Ibn Ibrahim Ibn al-Mughirah Ibn Bardizbah al-Bukhari. His father Isma’il was a well-known and famous muhaddith in his time and had been blessed with the chance of being in the company of Imam Malik, Hammad Ibn Zaid and also Abdullah Ibn Mubarak (rahimahullah).`,
    `Imam al-Bukhari (rahimahullah) was born on the day of Jumu’ah (Friday) the 13th of Shawwal 194 (A.H.). His father passed away in his childhood. At the age of sixteen after having memorized the compiled books of Imam Wakiy and Abdullah Ibn Mubarak, he performed Hajj with his elder brother and mother. After the completion of Hajj he remained in Makkah for a further two years and upon reaching the age of eighteen headed for Madinah, compiling the books “Qadaya-as-Sahabah wa at-Tabi’in” and “Tarikh al-Kabir.” Imam al-Bukhari also traveled to other key centers of Arabia in search of knowledge like Syria, Egypt, Kufa, Basra, and Baghdad.`,
    `Imam al-Bukhari (rahimahullah) first started listening and learning ahadith in 205 A.H., and after benefiting from the Ulama of his town he started his travels in 210 A.H. His memory was considered to be the best of his time. It is been known that in his childhood he memorized 2,000 ahadith.`,
  ],
};

const HadithDetailScreen: React.FC = () => {
  const { colors } = useThemeStore();

  return (
    <ScrollView style={[styles.container, { backgroundColor: 'white' }]}>
      {/* Book Card */}
      <View style={[styles.card, { borderColor: colors.primary.primary100 }]}>
        {/* <FastImage source={{ uri: hadithDetail.image }} style={styles.image} /> */}
        <View style={styles.info}>
          <Title3Bold style={styles.title}>{hadithDetail.title}</Title3Bold>
          <Body1Title2Medium style={styles.author}>Author</Body1Title2Medium>
          <Body1Title2Medium style={styles.authorName}>{hadithDetail.author}</Body1Title2Medium>
          <Body1Title2Medium style={styles.years}>Narrated in: {hadithDetail.years}</Body1Title2Medium>
          <Body1Title2Medium style={styles.translator}>Translation by: {hadithDetail.translator}</Body1Title2Medium>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary.primary600 }]}>
          <Text style={styles.actionBtnText}>Start learning</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary.primary100 }]}>
          <Text style={[styles.actionBtnText, { color: colors.primary.primary600 }]}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Highlight Bar */}
      <View style={styles.highlightBar}>
        <Body1Title2Medium style={styles.highlightText}>{hadithDetail.highlight}</Body1Title2Medium>
      </View>

      {/* Hadith Brief */}
      <View style={styles.section}>
        <Title3Bold style={styles.sectionTitle}>Hadith brief</Title3Bold>
        <Body1Title2Medium style={styles.sectionText}>{hadithDetail.brief}</Body1Title2Medium>
      </View>

      {/* Author Bio */}
      <View style={styles.section}>
        <Title3Bold style={styles.sectionTitle}>Author bio:</Title3Bold>
        {hadithDetail.authorBio.map((para, idx) => (
          <Body1Title2Medium style={styles.sectionText} key={idx}>{para}</Body1Title2Medium>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: scale(12) },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: scale(10),
    borderWidth: 1,
    padding: scale(10),
    marginBottom: verticalScale(12),
    backgroundColor: '#FFFDEB',
  },
  image: {
    width: scale(70),
    height: scale(100),
    borderRadius: scale(8),
    marginRight: scale(12),
  },
  info: { flex: 1 },
  title: { fontSize: scale(17), marginBottom: scale(2) },
  author: { fontSize: scale(13), color: '#888' },
  authorName: { fontSize: scale(13), marginBottom: scale(2) },
  years: { fontSize: scale(12), color: '#888', marginBottom: scale(2) },
  translator: { fontSize: scale(12), color: '#888' },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
    gap: scale(10),
  },
  actionBtn: {
    flex: 1,
    borderRadius: scale(20),
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    marginHorizontal: scale(4),
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scale(15),
  },
  highlightBar: {
    backgroundColor: '#FFF3C4',
    borderRadius: scale(6),
    padding: scale(8),
    marginBottom: verticalScale(12),
    alignItems: 'center',
  },
  highlightText: {
    color: '#7C5CFC',
    fontWeight: '600',
    fontSize: scale(13),
  },
  section: {
    marginBottom: verticalScale(14),
  },
  sectionTitle: {
    fontSize: scale(15),
    fontWeight: 'bold',
    marginBottom: scale(4),
  },
  sectionText: {
    fontSize: scale(13),
    color: '#444',
    marginBottom: scale(6),
    lineHeight: scale(18),
  },
});

export default HadithDetailScreen;