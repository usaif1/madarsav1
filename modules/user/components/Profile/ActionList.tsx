// dependencies
import {Text, View, TouchableOpacity, Share} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';

// components
import {Switch} from '@/components';
import { CdnSvg } from '@/components/CdnSvg';
import { scale } from '@/theme/responsive';

// store
import {useThemeStore} from '@/globalStore';
import {useAuthStore} from '@/modules/auth/store/authStore';
import {useUserDetails, useUpdateUserNotifications} from '@/modules/user/hooks/useUserProfile';

// Define icon components using CdnSvg
const AthanIcon = () => (
  <CdnSvg path="/assets/profile/athan_icon.svg" width={scale(20)} height={scale(20)} />
);

const NotificationIcon = () => (
  <CdnSvg path="/assets/profile/notification.svg" width={scale(20)} height={scale(20)} />
);

const ShareIcon = () => (
  <CdnSvg path="/assets/profile/invite_friends.svg" width={scale(20)} height={scale(20)} />
);

const RateIcon = () => (
  <CdnSvg path="/assets/profile/rate.svg" width={scale(20)} height={scale(20)} />
);

const ChevronRightIcon = () => (
  <CdnSvg path="/assets/chevron-right.svg" width={scale(12)} height={scale(12)} />
);

const SubscriptionIcon = () => (
  <CdnSvg path="/assets/profile/subscription.svg" width={scale(20)} height={scale(20)} />
);

const actionList = [
  {
    id: 'athan-notification',
    label: 'Athan Notification',
    toggle: true,
    iconLeft: AthanIcon,
    iconRight: null,
  },
  {
    id: 'push-notification',
    label: 'Push Notification',
    toggle: true,
    iconLeft: NotificationIcon,
    iconRight: null,
  },
  {
    id: 'invite-friends',
    label: 'Invite friends',
    toggle: false,
    iconLeft: ShareIcon,
    iconRight: ChevronRightIcon,
  },
  {
    id: 'rate-app',
    label: 'Rate the app',
    toggle: false,
    iconLeft: RateIcon,
    iconRight: ChevronRightIcon,
  },
  {
    id: 'subscription',
    label: 'Subscription',
    toggle: false,
    iconLeft: SubscriptionIcon,
    iconRight: ChevronRightIcon,
  },
];

// Accepts prop to hide notification items when not logged in
const ActionList = ({ profileNotLoggedIn = false }: { profileNotLoggedIn?: boolean }) => {
  const {shadows} = useThemeStore();
  const {user} = useAuthStore();
  const [athanNotification, setAthanNotification] = useState(false);
  const [pushNotification, setPushNotification] = useState(false);
  
  // Get user details to initialize notification settings
  const {data: userDetails, isLoading} = useUserDetails(user?.id);
  
  // Mutation for updating notification settings
  const updateNotificationsMutation = useUpdateUserNotifications();
  
  // Initialize notification states from user details
  useEffect(() => {
    if (userDetails) {
      setAthanNotification(userDetails.athanNotification);
      setPushNotification(userDetails.pushNotification);
    }
  }, [userDetails]);
  
  // Handle toggle for athan notification
  const handleAthanToggle = (value: boolean) => {
    if (!user?.id) return;
    
    setAthanNotification(value);
    updateNotificationsMutation.mutate({
      userId: user.id,
      athanNotification: value,
      pushNotification: pushNotification,
    });
  };

  // Handle toggle for push notification
  const handlePushToggle = (value: boolean) => {
    if (!user?.id) return;
    
    setPushNotification(value);
    updateNotificationsMutation.mutate({
      userId: user.id,
      athanNotification: athanNotification,
      pushNotification: value,
    });
  };

  // Filter out notification items if not logged in
  const filteredList = profileNotLoggedIn
    ? actionList.filter(
        item => item.id !== 'athan-notification' && item.id !== 'push-notification' && item.id !== 'subscription'
      )
    : actionList;

  // Function to handle direct OS share
  const handleDirectShare = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing Islamic app called Madrasa! Download here: https://madrasa-app.com/download',
        title: 'Madrasa App',
      });
    } catch (error) {
      // console.error('Error sharing app:', error);
    }
  };
    
  // Handle action item press
  const handleActionItemPress = (id: string) => {
    if (id === 'invite-friends') {
      handleDirectShare();
    }
    // Add other action handlers here as needed
  };

  return (
    <View style={[{padding: 20, backgroundColor: '#FFFFFF'}, shadows.sm1]}>
      <View style={{rowGap: 20}}>
        {filteredList.map(actionItem => {
          return (
            <View
              key={actionItem.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity 
                onPress={() => handleActionItemPress(actionItem.id)} 
                style={{flexDirection: 'row', alignItems: 'center'}}
              >
                <actionItem.iconLeft />
                <Text style={{fontWeight: '400', fontSize: 17, marginLeft: 12}}>
                  {actionItem.label}
                </Text>
              </TouchableOpacity>
              {actionItem?.iconRight ? (
                <TouchableOpacity onPress={() => handleActionItemPress(actionItem.id)}>
                  <actionItem.iconRight />
                </TouchableOpacity>
              ) : (
                actionItem.id === 'athan-notification' ? (
                  <Switch 
                    value={athanNotification} 
                    onValueChange={handleAthanToggle}
                    disabled={isLoading}
                  />
                ) : actionItem.id === 'push-notification' ? (
                  <Switch 
                    value={pushNotification} 
                    onValueChange={handlePushToggle}
                    disabled={isLoading}
                  />
                ) : null
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ActionList;