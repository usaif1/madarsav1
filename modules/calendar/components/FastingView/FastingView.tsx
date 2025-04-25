// modules/calendar/components/FastingView/FastingView.tsx
import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {Body1Title2Bold, Body2Medium, Title3Bold} from '@/components';

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
      <View style={styles.timesContainer}>
        <Pressable
          style={[
            styles.timeBox,
            activeType === 'sehri' && styles.activeTimeBox,
            activeType === 'sehri' && { borderColor: colors.primary.primary600 }
          ]}
          onPress={() => setActiveType('sehri')}>
          <View style={styles.iconContainer}>
            {/* This would be your SVG icon */}
          </View>
          <Title3Bold>{sehriTime}</Title3Bold>
          <Body2Medium color="sub-heading">Sehri time</Body2Medium>
        </Pressable>
        
        <Pressable
          style={[
            styles.timeBox,
            activeType === 'iftar' && styles.activeTimeBox,
            activeType === 'iftar' && { borderColor: colors.primary.primary600 }
          ]}
          onPress={() => setActiveType('iftar')}>
          <View style={styles.iconContainer}>
            {/* This would be your SVG icon */}
          </View>
          <Title3Bold>{iftarTime}</Title3Bold>
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
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  activeTimeBox: {
    borderWidth: 2,
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