import React, { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { ColorPrimary } from '@/theme/lightColors';
import { scale, verticalScale } from '@/theme/responsive';
import { useIsFocused } from '@react-navigation/native';

// Import navigators
import SurahNavigator from './surah.navigator';
import JuzzNavigator from './juzz.navigator';
import SavedNavigator from './saved.navigator';

// Import header component
import QuranHeader from '../components/QuranHeader';

// Create tab navigator
const Tab = createMaterialTopTabNavigator();

const QuranNavigator = () => {
  const isFocused = useIsFocused();
  const [isReady, setIsReady] = React.useState(false);

  // Delay rendering of the tab navigator to ensure pager view is properly initialized
  useEffect(() => {
    if (isFocused) {
      // Small delay to ensure everything is ready
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <QuranHeader />
      {isReady ? (
        <Tab.Navigator
          initialRouteName="Surah"
          screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: '#F9F6FF',
            tabBarStyle: styles.tabBar,
            tabBarIndicatorStyle: styles.indicator,
            tabBarLabelStyle: styles.tabLabel,
            // Ensure we're using the correct pager implementation
            lazy: true,
            lazyPlaceholder: () => <View style={{ flex: 1, backgroundColor: '#411B7F' }} />,
          }}
        >
          <Tab.Screen 
            name="Surah" 
            component={SurahNavigator} 
          />
          <Tab.Screen 
            name="Juzz" 
            component={JuzzNavigator} 
          />
          <Tab.Screen 
            name="Saved" 
            component={SavedNavigator} 
          />
        </Tab.Navigator>
      ) : (
        // Show a placeholder while the navigator is initializing
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: ColorPrimary.primary800,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  indicator: {
    backgroundColor: ColorPrimary.primary400,
    height: 3,
  },
  tabLabel: {
    fontFamily: 'Geist-SemiBold',
    fontWeight: '600',
    fontSize: scale(14),
    textTransform: 'none',
  },
});

export default QuranNavigator;
