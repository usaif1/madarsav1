import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  Pressable, 
  useWindowDimensions, 
  Text, 
  PanResponder
} from 'react-native';

interface BeadsProps {
  count?: number;
  initialActiveIndex?: number;
  onAdvance?: () => void;
  totalCount?: number;
  currentCount?: number;
}

const DEFAULT_BEAD_COUNT = 8;

const Beads: React.FC<BeadsProps> = ({ 
  count = DEFAULT_BEAD_COUNT, 
  initialActiveIndex = 0, 
  onAdvance,
  totalCount = 33,
  currentCount = 0
}) => {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  
  // Responsive scaling for the thread
  const threadWidth = Math.min(width - 32, 380);
  
  // Animation values for each bead
  const beadAnims = useRef(
    Array.from({ length: count }, () => new Animated.Value(0))
  ).current;
  
  // Calculate bead positions along the thread
  const beadPositions = Array.from({ length: count }, (_, i) => {
    const progress = i / (count - 1);
    // Create a slight curve for the thread
    const angle = Math.PI / 4 + (progress * Math.PI / 2);
    return {
      left: 32 + progress * (threadWidth - 64),
      top: 40 + Math.sin(angle) * 30,
    };
  });

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        // Detect right swipe (dx > 50)
        if (gestureState.dx > 50) {
          handleAdvance();
        }
      },
    })
  ).current;

  // Handle advancing to the next bead
  const handleAdvance = () => {
    const bead = beadAnims[activeIndex];
    
    // Animate the current bead
    Animated.sequence([
      // Move to the right
      Animated.timing(bead, { 
        toValue: 1, 
        duration: 200, 
        useNativeDriver: true 
      }),
      // Reset position for next use
      Animated.timing(bead, { 
        toValue: 0, 
        duration: 0, 
        useNativeDriver: true 
      })
    ]).start();
    
    // Update active index
    setActiveIndex((prev) => (prev + 1) % count);
    
    // Call external handler
    if (onAdvance) {
      onAdvance();
    }
  };

  // Reset animation values when activeIndex changes
  useEffect(() => {
    beadAnims.forEach((anim, i) => {
      if (i !== activeIndex) {
        anim.setValue(0);
      }
    });
  }, [activeIndex, beadAnims]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Round counter */}
      <View style={styles.counter}>
        <Text style={styles.countText}>{currentCount}/{totalCount}</Text>
        <Text style={styles.roundText}>Round {Math.floor(currentCount / count) + 1}</Text>
      </View>
      
      {/* Thread and beads */}
      <View style={[styles.threadWrap, { width: threadWidth }]}>
        {/* Thread line - using a View instead of SVG for simplicity */}
        <View style={[styles.threadLine, { width: threadWidth }]} />
        
        {/* Beads */}
        {beadPositions.map((pos, idx) => {
          const isActive = idx === activeIndex;
          // Apply animation transformation
          const translateX = beadAnims[idx].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 20]
          });
          
          return (
            <Pressable
              key={`bead-${idx}`}
              onPress={() => isActive && handleAdvance()}
              style={[
                styles.beadWrap,
                { left: pos.left - 24, top: pos.top - 24 }
              ]}
            >
              <Animated.View
                style={[
                  styles.bead,
                  isActive && styles.activeBead,
                  { transform: [{ translateX }] }
                ]}
              />
            </Pressable>
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
    padding: 16,
  },
  counter: {
    marginBottom: 16,
    alignItems: 'center',
  },
  countText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  roundText: {
    fontSize: 20,
    color: '#000',
  },
  threadWrap: {
    height: 120,
    position: 'relative',
    marginVertical: 16,
  },
  threadLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#aaa',
    top: 50,
  },
  beadWrap: {
    position: 'absolute',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  bead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  activeBead: {
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  swipeHint: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default Beads;