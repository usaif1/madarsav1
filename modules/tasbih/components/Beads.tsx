import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Pressable, useWindowDimensions, Text } from 'react-native';
import Marble from '@/assets/tasbih/marble.svg';
import Thread from '@/assets/tasbih/thread.svg';

interface BeadsProps {
  count?: number;
  activeIndex?: number;
  onAdvance?: () => void;
}

const DEFAULT_BEAD_COUNT = 8;

const Beads: React.FC<BeadsProps> = ({ count = DEFAULT_BEAD_COUNT, activeIndex = 0, onAdvance }) => {
  const { width } = useWindowDimensions();
  // Responsive scaling for the thread
  const threadWidth = Math.min(width - 16, 378.5);

  // Dummy animation for bead movement
  const anims = Array.from({ length: count }, (_, i) => useRef(new Animated.Value(0)).current);

  const handleBeadPress = (idx: number) => {
    if (idx === activeIndex && onAdvance) {
      // Animate bead to the right (dummy, can be improved)
      Animated.sequence([
        Animated.timing(anims[idx], { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(anims[idx], { toValue: 0, duration: 0, useNativeDriver: true })
      ]).start();
      onAdvance();
    }
  };

  // Calculate bead positions along the thread
  const beadPositions = Array.from({ length: count }, (_, i) => {
    const angle = Math.PI / 4 + (i * Math.PI / 2) / (count - 1); // spread beads on a curve
    return {
      left: 32 + i * ((threadWidth - 64) / (count - 1)),
      top: 40 + Math.sin(angle) * 30,
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.threadWrap, { width: threadWidth }]}> 
        <Thread width={threadWidth} height={111} style={styles.thread} />
        {beadPositions.map((pos, idx) => {
          const isActive = idx === activeIndex;
          return (
            <Animated.View
              key={idx}
              style={[
                styles.beadWrap,
                {
                  left: pos.left,
                  top: pos.top,
                  zIndex: isActive ? 2 : 1,
                  transform: [
                    { scale: isActive ? anims[idx].interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) : 1 },
                  ],
                },
              ]}
            >
              <Pressable onPress={() => handleBeadPress(idx)}>
                <Marble width={48} height={48} opacity={isActive ? 1 : 0.7} />
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
      <Text style={styles.swipeHint}>Click or swipe to count</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  threadWrap: {
    height: 111,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  thread: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  beadWrap: {
    position: 'absolute',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeHint: {
    color: '#888',
    fontSize: 20,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Beads;
