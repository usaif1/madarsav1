import {Pressable} from 'react-native';
import React, {useCallback} from 'react';

// assets
import ArrowLeft from '@/assets/arrow-left.svg';
import {useNavigation} from '@react-navigation/native';

const BackButton = () => {
  const navigation = useNavigation();

  const onPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Pressable onPress={onPress}>
      <ArrowLeft />
    </Pressable>
  );
};

export default BackButton;
