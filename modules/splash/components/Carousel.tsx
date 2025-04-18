import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Carousel from 'react-native-snap-carousel';

const {width} = Dimensions.get('window');

const carouselData = [
  {
    text: 'Day 1: Start your spiritual journey',
  },
  {
    text: 'Day 2: Keep progressing',
  },
  {
    text: 'Day 3: Reach your inner peace',
  },
];

const App = () => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({item}) => {
    // Check if 'item' contains the expected properties
    if (!item || !item.text) {
      return null; // If data is missing, return null to avoid rendering errors
    }

    return (
      <View style={styles.carouselItem}>
        <Text style={styles.carouselText}>{item.text}</Text>
        {/* Replaced Image with a View having red background */}
        <View style={styles.carouselImagePlaceholder} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Purple snap indicator */}
      <View style={styles.snapIndicator}>
        <View
          style={[
            styles.snapIndicatorBar,
            {width: (width / 3) * (activeIndex + 1)},
          ]}
        />
      </View>

      {/* Carousel */}
      <Carousel
        ref={carouselRef}
        data={carouselData}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width * 0.8}
        onSnapToItem={index => setActiveIndex(index)}
        inactiveSlideScale={0.95}
        inactiveSlideOpacity={0.7}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapIndicator: {
    position: 'absolute',
    top: 50,
    width: width,
    height: 5,
    backgroundColor: 'purple',
  },
  snapIndicatorBar: {
    height: '100%',
    backgroundColor: 'white',
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  carouselImagePlaceholder: {
    width: width * 0.6,
    height: 340,
    backgroundColor: 'red',
    borderRadius: 10,
  },
});

export default App;
