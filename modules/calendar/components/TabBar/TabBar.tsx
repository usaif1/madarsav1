// modules/calendar/components/TabBar/TabBar.tsx
import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {Body1Title2Bold} from '@/components';

// store
import {useThemeStore} from '@/globalStore';

type TabType = 'salah' | 'fasting' | 'events';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabBar: React.FC<TabBarProps> = ({activeTab, onTabChange}) => {
  const {colors} = useThemeStore();

  return (
    <View style={styles.container}>
      <View style={styles.tabsLeft}>
        <TabButton
          label="Salah"
          isActive={activeTab === 'salah'}
          onPress={() => onTabChange('salah')}
          activeColor={colors.primary.primary600}
        />
        <TabButton
          label="Fasting"
          isActive={activeTab === 'fasting'}
          onPress={() => onTabChange('fasting')}
          activeColor={colors.primary.primary600}
        />
        <TabButton
          label="Events"
          isActive={activeTab === 'events'}
          onPress={() => onTabChange('events')}
          activeColor={colors.primary.primary600}
        />
      </View>
      <TodayPill isActive={activeTab === 'salah'} />
    </View>
  );
};

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  activeColor: string;
}

const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive,
  onPress,
  activeColor,
}) => {
  return (
    <Pressable
      style={[
        styles.tab,
        isActive && {backgroundColor: '#F5F4FB'},
      ]}
      onPress={onPress}>
      <Body1Title2Bold color={isActive ? 'primary' : 'sub-heading'}>
        {label}
      </Body1Title2Bold>
    </Pressable>
  );
};

interface TodayPillProps {
  isActive: boolean;
}

const TodayPill: React.FC<TodayPillProps> = ({isActive}) => {
  return (
    <View
      style={[
        styles.todayPill,
        isActive && {backgroundColor: '#F5F4FB', borderWidth: 1, borderColor: '#7D5FFF'},
      ]}>
      <Body1Title2Bold color={isActive ? 'primary' : 'sub-heading'}>
        Today
      </Body1Title2Bold>
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabsLeft: {
    flexDirection: 'row',
  },
  tab: {
    height: 28,
    borderRadius: 60,
    paddingTop: 4,
    paddingRight: 16,
    paddingBottom: 4,
    paddingLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  todayPill: {
    height: 28,
    borderRadius: 60,
    paddingTop: 4,
    paddingRight: 16,
    paddingBottom: 4,
    paddingLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginLeft: 24,
  },
});