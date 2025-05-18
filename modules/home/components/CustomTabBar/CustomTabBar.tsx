import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {scale, verticalScale} from '@/theme/responsive';
import {ColorPrimary} from '@/theme/lightColors';

// Import SVG icons
import HomeIcon from '@/assets/home/home-selected.svg';
import MaktabIcon from '@/assets/home/maktab.svg';
import AlQuranIcon from '@/assets/home/al-quran.svg';
import { Body2Medium } from '@/components';

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
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
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Determine which icon to show based on route name
        const getIcon = () => {
          const color = isFocused ? ColorPrimary.primary500 : '#A3A3A3';
          
          switch (route.name) {
            case 'home':
              return <HomeIcon width={24} height={24} fill={color} />;
            case 'maktab':
              return <MaktabIcon width={24} height={24} fill={color} />;
            case 'al-quran':
              return <AlQuranIcon width={24} height={24} fill={color} />;
            default:
              return <HomeIcon width={24} height={24} fill={color} />;
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
            <Body2Medium
              style={[
                styles.tabText,
                {color: isFocused ? ColorPrimary.primary500 : '#A3A3A3'},
              ]}>
              {String(label)}
            </Body2Medium>
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
