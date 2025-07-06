import React, { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { ColorPrimary } from '@/theme/lightColors';
import { scale, verticalScale } from '@/theme/responsive';
import { useIsFocused } from '@react-navigation/native';

// Import navigators
import SurahNavigator from './surah.navigator';
import JuzzNavigator from './juzz.navigator';
import SavedNavigator from './saved.navigator';

// Import context hook
import { useQuranNavigation } from '../context/QuranNavigationContext';

// Create tab navigator
const Tab = createMaterialTopTabNavigator();

// Custom tab label component
const TabLabel = ({ focused, children }: { focused: boolean; children: string }) => (
  <Text style={[styles.tabLabel, focused ? styles.tabLabelSelected : styles.tabLabelUnselected]}>
    {children}
  </Text>
);

// Custom tab bar component that can be hidden
const CustomTabBar = (props: any) => {
  const { showTopTabs } = useQuranNavigation();
  
  if (!showTopTabs) {
    return null;
  }
  
  const { MaterialTopTabBar } = require('@react-navigation/material-top-tabs');
  return <MaterialTopTabBar {...props} />;
};

// Main navigator without provider (provider is now at parent level)
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
      {isReady ? (
        <Tab.Navigator
          initialRouteName="Surah"
          screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: '#F9F6FF',
            tabBarStyle: styles.tabBar,
            tabBarIndicatorStyle: styles.indicator,
            // Ensure we're using the correct pager implementation
            lazy: true,
            lazyPlaceholder: () => <View style={{ flex: 1, backgroundColor: '#411B7F' }} />,
          }}
          tabBar={CustomTabBar}
        >
          <Tab.Screen 
            name="Surah" 
            component={SurahNavigator}
            options={{
              tabBarLabel: ({ focused }) => <TabLabel focused={focused}>Surah</TabLabel>,
            }}
          />
          <Tab.Screen 
            name="Juzz" 
            component={JuzzNavigator}
            options={{
              tabBarLabel: ({ focused }) => <TabLabel focused={focused}>Juzz</TabLabel>,
            }}
          />
          <Tab.Screen 
            name="Saved" 
            component={SavedNavigator}
            options={{
              tabBarLabel: ({ focused }) => <TabLabel focused={focused}>Saved</TabLabel>,
            }}
          />
        </Tab.Navigator>
      ) : (
        // Show a placeholder while the navigator is initializing
        <View style={{ flex: 1, backgroundColor: 'white' }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#411B7F',
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
    fontFamily: 'Geist',
    fontSize: scale(14),
    lineHeight: scale(14) * 1.45, // 145% line height
    letterSpacing: 0,
    textAlign: 'center',
    textTransform: 'none',
  },
  tabLabelSelected: {
    fontWeight: '700',
    color: 'white',
  },
  tabLabelUnselected: {
    fontWeight: '500',
    color: '#F9F6FF',
  },
});

export default QuranNavigator;
