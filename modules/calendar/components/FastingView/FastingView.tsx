// modules/calendar/components/FastingView/FastingView.tsx
import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {Body1Title2Bold, Body1Title2Medium, Body2Medium, Title3Bold} from '@/components';
import {FazrIcon, MaghribIcon, FazrWhiteIcon, MaghribWhiteIcon} from '@/assets/calendar';
import {ShadowColors} from '@/theme/shadows';

// store
import {useThemeStore} from '@/globalStore';

interface FastingViewProps {
  selectedDate: Date;
}

const FastingView: React.FC<FastingViewProps> = ({selectedDate}: FastingViewProps) => {
  const {colors} = useThemeStore();
  const [activeType, setActiveType] = useState<'sehri' | 'iftar'>('sehri');

  // This would be fetched from an API or calculated
  const sehriTime = '5:46 AM';
  const iftarTime = '6:03 PM';
  
  return (
    <View style={styles.container}>
      <View style={[styles.timesContainer, {
        width: 400,
        height: 110,
        paddingRight: 20,
        paddingLeft: 20,
        gap: 24,
      }]}>
        <Pressable
          style={[
            styles.timeBox,
            {
              width: 171.5,
              height: 120,
              borderRadius: 12,
              paddingTop: 12,
              paddingRight: 20,
              paddingBottom: 12,
              paddingLeft: 20,
              backgroundColor: activeType === 'sehri' ? colors.primary.primary50 : '#FFFFFF',
              borderColor: activeType === 'sehri' ? colors.primary.primary300 : ShadowColors['border-light'],
              borderWidth: 1,
              gap: 8,
            },
          ]}
          onPress={() => setActiveType('sehri')}>
          <View
            style={[
              styles.iconContainer,
              {
                borderRadius: 8,
                width: 32,
                height: 32,
                backgroundColor: activeType === 'sehri' ? colors.primary.primary500 : '#F9F6FF',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            {activeType === 'sehri' ? <FazrWhiteIcon /> : <FazrIcon />}
          </View>
          <Body1Title2Medium>{sehriTime}</Body1Title2Medium>
          <Body2Medium color="sub-heading">Sehri time</Body2Medium>
        </Pressable>
        
        <Pressable
          style={[
            styles.timeBox,
            {
              width: 161.5,
              height: 110,
              borderRadius:12,
              paddingTop: 12,
              paddingRight: 20,
              paddingBottom: 12,
              paddingLeft: 20,
              backgroundColor: activeType === 'iftar' ? colors.primary.primary50 : '#FFFFFF',
              borderColor: activeType === 'iftar' ? colors.primary.primary300 : ShadowColors['border-light'],
              borderWidth: 1,
              gap: 8,
            },
          ]}
          onPress={() => setActiveType('iftar')}>
          <View
            style={[
              styles.iconContainer,
              {
                borderRadius: 8,
                width: 32,
                height: 32,
                backgroundColor: activeType === 'iftar' ? colors.primary.primary500 : '#F9F6FF',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            {activeType === 'iftar' ? <MaghribWhiteIcon /> : <MaghribIcon />}
          </View>
          <Body1Title2Medium>{iftarTime}</Body1Title2Medium>
          <Body2Medium color="sub-heading">Iftar time</Body2Medium>
        </Pressable>
      </View>
      
      <View style={styles.duaContainer}>
        <View style={styles.duaHeader}>
          <View style={styles.duaLine} />
          <Body1Title2Bold color="primary">
            {activeType === 'sehri' ? 'Dua for Sehri' : 'Dua for Iftar'}
          </Body1Title2Bold>
          <View style={styles.duaLine} />
        </View>
        
        {/* This would be replaced with the actual dua content/image */}
        <View style={styles.duaContent}>
          <Title3Bold style={styles.arabicText}>
            {activeType === 'sehri' 
              ? 'وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَان'
              : 'اللَّهُمَّ لَكَ صُمْتُ، وَعَلَى رِزْقِكَ أَفْطَرْتُ'}
          </Title3Bold>
          <Body2Medium style={styles.translationText}>
            {activeType === 'sehri' 
              ? 'Wa bisawmi ghadinn nawaiytu min shahri Ramadan'
              : 'Allahumma inni laka sumtu wa ala rizq-ika-aftartu'}
          </Body2Medium>
        </View>
      </View>
    </View>
  );
};

export default FastingView;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  timesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  timeBox: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F4FB',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duaContainer: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFDF6',
  },
  duaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  duaLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F9DF90',
  },
  duaContent: {
    alignItems: 'center',
  },
  arabicText: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 24,
    lineHeight: 36,
  },
  translationText: {
    textAlign: 'center',
    color: '#6D591D',
  },
});