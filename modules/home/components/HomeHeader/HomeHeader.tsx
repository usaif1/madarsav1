import React from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ColorPrimary} from '@/theme/lightColors';
import {scale, verticalScale} from '@/theme/responsive';
import {Title3Bold, Body2Medium} from '@/components/Typography/Typography';
import BellFill from '@/assets/home/Bell-fill.svg';
import MapPinFill from '@/assets/home/map-pin-fill.svg';
import NavProfileMenu from '@/assets/home/nav-ptofile-menu.svg';

interface HomeHeaderProps {
  userName: string;
  locationText: string;
  notificationCount?: number;
}

type RootStackParamList = {
  user: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName = 'Mohammad Arbaaz',
  locationText = 'Get accurate namaz time',
  notificationCount = 1,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  
  const handleUserProfilePress = () => {
    console.log('User profile pressed');
    navigation.navigate('user');
  };

  return (
    <View style={[styles.header, {paddingTop: insets.top}]}>
      <View style={styles.headerContent}>
        {/* User Info Section */}
        <View style={styles.userInfo}>
          <TouchableOpacity 
            style={styles.userImageContainer}
            onPress={handleUserProfilePress}
            activeOpacity={0.8}
          >
            <Image
              source={require('@/assets/home/image_21.png')}
              style={styles.userImage}
            />
            {/* Menu Icon positioned on the bottom right of the image */}
            <View style={styles.menuIconContainer}>
              <NavProfileMenu width={scale(12)} height={scale(12)} />
            </View>
          </TouchableOpacity>
          
          <View style={styles.userTextContainer}>
            <Title3Bold color="white">{userName}</Title3Bold>
            <View style={styles.locationContainer}>
              <MapPinFill width={14} height={14} />
              <Body2Medium style={styles.locationText}>{locationText}</Body2Medium>
            </View>
          </View>
        </View>
        
        {/* Notification Bell */}
        <View style={styles.bellContainer}>
          <BellFill width={scale(24)} height={scale(24)} />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{notificationCount}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#411B7F',
    paddingBottom: scale(12),
  },
  headerContent: {
    height: verticalScale(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    gap: scale(12),
  },
  userInfo: {
    height: verticalScale(40),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  userImageContainer: {
    position: 'relative',
    width: scale(40),
    height: scale(40),
  },
  userImage: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(24),
  },
  menuIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    borderWidth: 1,
    borderColor: ColorPrimary.primary200,
    backgroundColor: '#F9F6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userTextContainer: {
    justifyContent: 'center',
    width: scale(243),
    height: verticalScale(24),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(14),
  },
  locationText: {
    marginLeft: scale(4),
    fontSize: scale(12),
    lineHeight: scale(14.4),
    fontFamily: 'Geist-Medium',
    fontWeight: '500',
    color: ColorPrimary.primary200,
    textAlign: 'center',
  },
  bellContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -4,
    width: scale(16),
    height: scale(16),
    borderRadius: scale(20),
    backgroundColor: '#D92D20', // Error main color
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    width: scale(16),
    height: scale(16),
    fontSize: scale(11.43),
    lineHeight: scale(16),
    fontFamily: 'Geist-Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default HomeHeader;
