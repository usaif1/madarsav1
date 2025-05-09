// dependencies
import {StatusBar, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';

// components
import {NamesSearchbar} from './components';
import {NamesList} from './components/AllNames';
import {Divider} from '@/components';

const AllNames: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={{paddingHorizontal: 18}}>
        <NamesSearchbar 
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />
      </View>
      <Divider height={10} />
      <NamesList searchQuery={searchQuery} />
    </View>
  );
};

export default AllNames;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
  },
});
