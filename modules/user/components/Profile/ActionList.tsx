// dependencies
import {Text, View} from 'react-native';
import React from 'react';

// assets
import AthanIcon from '@/assets/profile/athan_icon.svg';
import Notification from '@/assets/profile/notification.svg';
import Share from '@/assets/profile/share.svg';
import Rate from '@/assets/profile/rate.svg';
import ChevronRight from '@/assets/chevron-right.svg';
import {Switch} from '@/components';
import {useThemeStore} from '@/globalStore';

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
    iconLeft: Share,
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

const ActionList = () => {
  const {shadows} = useThemeStore();

  return (
    <View style={[{padding: 20, backgroundColor: '#FFFFFF'}, shadows.sm1]}>
      <View style={{rowGap: 20}}>
        {actionList.map(actionItem => {
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
              {actionItem?.iconRight ? <actionItem.iconRight /> : <Switch />}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ActionList;
