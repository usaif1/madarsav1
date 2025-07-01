import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {scale, verticalScale} from '@/theme/responsive';
import {ColorPrimary} from '@/theme/lightColors';

// components
import { Body2Medium, Body2Bold } from '@/components';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  // Function to show a coming soon message for unavailable features
  const handleComingSoonFeature = (routeName: string) => {
    console.log(`${routeName} feature is coming soon!`);
    // You could add a toast message here in the future
  };
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          console.log(route.name);
          // For Quran tab, prevent navigation and show coming soon message
          // if (route.name === 'al-quran') {
          //   // Emit the event but prevent default navigation
          //   const event = navigation.emit({
          //     type: 'tabPress',
          //     target: route.key,
          //     canPreventDefault: true,
          //   });
            
          //   // Show coming soon message
          //   // handleComingSoonFeature('Quran');
            
          //   // Don't navigate
          //   return;
          // }
          
          // For other tabs, proceed with normal navigation
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Determine which icon to show based on route name and focus state
        const getIcon = () => {
          const iconProps = {
            width: 24,
            height: 24,
            fill: isFocused ? '#8A57DC' : '#A3A3A3',
          };

          switch (route.name) {
            case 'home':
              return (
                <CdnSvg 
                  path={isFocused ? DUA_ASSETS.TAB_HOME_SELECTED : DUA_ASSETS.TAB_HOME} 
                  {...iconProps} 
                />
              );
            case 'maktab':
              return (
                <CdnSvg 
                  path={isFocused ? DUA_ASSETS.TAB_MAKTAB_SELECTED : DUA_ASSETS.TAB_MAKTAB} 
                  {...iconProps} 
                />
              );
            case 'al-quran':
              return (
                <CdnSvg 
                  path={isFocused ? DUA_ASSETS.TAB_QURAN_SELECTED : DUA_ASSETS.TAB_QURAN} 
                  {...iconProps} 
                />
              );
            default:
              return (
                <CdnSvg 
                  path={isFocused ? DUA_ASSETS.TAB_HOME_SELECTED : DUA_ASSETS.TAB_HOME} 
                  {...iconProps} 
                />
              );
          }
        };

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={styles.tabButton}>
            {getIcon()}
            {isFocused ? (
              <Body2Bold style={[styles.tabText, {color: '#8A57DC'}]}>
                {String(label)}
              </Body2Bold>
            ) : (
              <Body2Medium style={[styles.tabText, {color: '#A3A3A3'}]}>
                {String(label)}
              </Body2Medium>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    height: verticalScale(70),
    paddingVertical: verticalScale(10),
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontFamily: 'Geist-Medium',
    fontWeight: '500',
    fontSize: scale(12),
    lineHeight: scale(14.4), // 120% of font size
    textAlign: 'center',
    marginTop: verticalScale(4),
  },
});

export default CustomTabBar;
