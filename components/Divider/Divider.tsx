import {View} from 'react-native';
import React from 'react';

type Props = {
  height?: number;
  color?: string;
};

const Divider: React.FC<Props> = ({height = 10,color='transparent'}) => {
  return (
    <View style={{
      width: '100%',
      height: height,
      backgroundColor: color,
    }}
    />
  );
};

export default Divider;