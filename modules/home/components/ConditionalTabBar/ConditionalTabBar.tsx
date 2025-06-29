import React from 'react';
import { useQuranNavigation } from '@/modules/quran/context/QuranNavigationContext';
import CustomTabBar from '../CustomTabBar/CustomTabBar';

const ConditionalTabBar = (props: any) => {
  const { showBottomTabs } = useQuranNavigation();
  
  // Don't render tab bar if it should be hidden
  if (!showBottomTabs) {
    return null;
  }

  return <CustomTabBar {...props} />;
};

export default ConditionalTabBar; 