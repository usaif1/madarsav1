// dependencies
import {Text, View, TouchableOpacity, Share} from 'react-native';
import React, {useState, useEffect} from 'react';

// components
// import ShareModal from './ShareModal'; // Commented out as per request

// assets
import AthanIcon from '@/assets/profile/athan_icon.svg';
import Notification from '@/assets/profile/notification.svg';
import ShareIcon from '@/assets/hadith/share_alt.svg'; // Renamed from Share to ShareIcon
import Rate from '@/assets/profile/rate.svg';
import ChevronRight from '@/assets/chevron-right.svg';
import {Switch} from '@/components';
import {useThemeStore} from '@/globalStore';
import {useAuthStore} from '@/modules/auth/store/authStore';
import {useUserDetails, useUpdateUserNotifications} from '@/modules/user/hooks/useUserProfile';

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
    iconLeft: Notification,
    iconRight: null,
  },
  {
    id: 'invite-friends',
    label: 'Invite friends',
    toggle: false,
    iconLeft: ShareIcon, // Updated to use ShareIcon
    iconRight: ChevronRight,
  },
  {
    id: 'rate-app',
    label: 'Rate the app',
    toggle: false,
    iconLeft: Rate,
    iconRight: ChevronRight,
  },
];

// Accepts prop to hide notification items when not logged in
const ActionList = ({ profileNotLoggedIn = false }: { profileNotLoggedIn?: boolean }) => {
  const {shadows} = useThemeStore();
  const {user} = useAuthStore();
  const [athanNotification, setAthanNotification] = useState(false);
  const [pushNotification, setPushNotification] = useState(false);
  // const [showShareModal, setShowShareModal] = useState(false); // Commented out as per request
  
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
  
  // Handle toggle for notification settings
  const handleToggleNotification = (type: 'athan' | 'push', value: boolean) => {
    if (!user?.id) return;
    
    if (type === 'athan') {
      setAthanNotification(value);
      updateNotificationsMutation.mutate({
        userId: user.id,
        athanNotification: value,
        pushNotification: pushNotification,
      });
    } else {
      setPushNotification(value);
      updateNotificationsMutation.mutate({
        userId: user.id,
        athanNotification: athanNotification,
        pushNotification: value,
      });
    }
  };

  // Filter out notification items if not logged in
  const filteredList = profileNotLoggedIn
    ? actionList.filter(
        item => item.id !== 'athan-notification' && item.id !== 'push-notification'
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
      // setShowShareModal(true); // Commented out as per request
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <actionItem.iconLeft />

                {/* Title 1 */}
                <Text style={{fontWeight: '400', fontSize: 17, marginLeft: 12}}>
                  {actionItem.label}
                </Text>
              </View>
              {actionItem?.iconRight ? (
                <TouchableOpacity onPress={() => handleActionItemPress(actionItem.id)}>
                  <actionItem.iconRight />
                </TouchableOpacity>
              ) : (
                actionItem.id === 'athan-notification' ? (
                  <Switch 
                    value={athanNotification} 
                    onValueChange={(value: boolean) => handleToggleNotification('athan', value)}
                    disabled={updateNotificationsMutation.isPending || isLoading}
                  />
                ) : actionItem.id === 'push-notification' ? (
                  <Switch 
                    value={pushNotification} 
                    onValueChange={(value: boolean) => handleToggleNotification('push', value)}
                    disabled={updateNotificationsMutation.isPending || isLoading}
                  />
                ) : (
                  <Switch />
                )
              )}
            </View>
          );
        })}
      </View>
      
      {/* Share Modal - Commented out as per request */}
      {/* <ShareModal 
        isVisible={showShareModal} 
        onClose={() => setShowShareModal(false)} 
      /> */}
    </View>
  );
};

export default ActionList;
