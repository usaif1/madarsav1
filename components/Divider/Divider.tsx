import {View} from 'react-native';
import React from 'react';

type Props = {
  height?: number;
};

const Divider: React.FC<Props> = ({height = 10}) => {
  return <View style={{width: '100%', height: height}} />;
};

export default Divider;
