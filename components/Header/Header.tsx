// components/CustomHeader.tsx
import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackButton from '../BackButton/BackButton';
import {Title3Bold} from '../Typography/Typography';

interface CustomHeaderProps {
  title: string;
  onBack?: () => void;
  RightButton?: () => React.JSX.Element; // custom right icon (optional)
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  onBack,
  RightButton,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, {paddingTop: insets.top + 20}]}>
      <View style={styles.row}>
        {/* Left: Back button */}
        <Pressable
          onPress={onBack}
          hitSlop={10}
          style={{position: 'absolute', left: 18}}>
          <BackButton />
        </Pressable>

        {/* Center: Title */}
        <Title3Bold numberOfLines={1} color="white">
          {title}
        </Title3Bold>

        {/* Right: Icon passed in as prop */}
        {RightButton ? (
          <View style={{position: 'absolute', right: 18}}>
            <RightButton />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#411B7F', // deep purple or use backgroundImage
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
