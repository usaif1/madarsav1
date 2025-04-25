// modules/calendar/components/TabBar/TabBar.tsx
import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {Body1Title2Bold} from '@/components';

// store
import {useThemeStore} from '@/globalStore';

type TabType = 'salah' | 'fasting' | 'events' | 'today';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabBar: React.FC<TabBarProps> = ({activeTab, onTabChange}) => {
  const {colors} = useThemeStore();

  return (
    <View style={styles.container}>
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
      <View style={{alignSelf: 'flex-end'}}>
      <TabButton
        label="Today"
        isActive={activeTab === 'today'}
        onPress={() => onTabChange('today')}
        activeColor={colors.primary.primary600}
      />
      </View>
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
      style={[styles.tab, isActive && {backgroundColor: '#F5F4FB'}]}
      onPress={onPress}>
      <Body1Title2Bold
        color={isActive ? 'primary' : 'sub-heading'}>
        {label}
      </Body1Title2Bold>
      {isActive && <View style={[styles.indicator, {backgroundColor: activeColor}]} />}
    </Pressable>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-around',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 20,
    height: 3,
    borderRadius: 2,
    transform: [{translateX: -10}],
  },
});