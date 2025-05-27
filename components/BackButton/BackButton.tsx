import {Pressable} from 'react-native';
import React, {useCallback} from 'react';

// assets
import ArrowLeft from '@/assets/arrow-left.svg';
import {useNavigation} from '@react-navigation/native';

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
      <ArrowLeft />
    </Pressable>
  );
};

export default BackButton;
