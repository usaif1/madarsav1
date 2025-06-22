import {Pressable} from 'react-native';
import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import { CdnSvg } from '../CdnSvg';
import { scale } from '@/theme/responsive';

type BackButtonProps = {
  onPress?: () => void;
};

const BackButton = ({ onPress: customOnPress }: BackButtonProps) => {
  const navigation = useNavigation();

  const defaultOnPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  
  const onPress = customOnPress || defaultOnPress;

  return (
    <Pressable onPress={onPress}>
      <CdnSvg 
        path={DUA_ASSETS.ARROW_LEFT}
        width={scale(24)}
        height={scale(24)}
      />
    </Pressable>
  );
};

export default BackButton;
