import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  FlatList,
  UIManager,
  Platform,
  Animated,
  LayoutAnimation,
  useWindowDimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import rosaryBead from '@/assets/tasbih/rosaryBead.png';
import Thread from '@/assets/tasbih/thread.svg';
import { Body1Title2Bold, Body1Title2Regular, H3Bold } from '@/components';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface BeadsProps {
  /** Total number of verses in current dua */
  totalVerses: number;
  /** Current verse index (0-based) */
  currentVerseIndex: number;
  /** Callback when bead is advanced */
  onAdvance: () => void;
  /** Current total counter across all cycles */
  totalCount?: number;
}

// Constants for bead display and animation
const BEAD_SIZE = 40;
const DISPLAY_BEADS_COUNT = 8; // Always show 8 beads like original component
const MAX_COMPLETED_BEADS = 3; // Maximum beads shown on completed side

/**
 * Beads component with shifting animation logic
 * Displays prayer beads that move from left to right as verses are completed
 */
const Beads: React.FC<BeadsProps> = ({
  totalVerses,
  currentVerseIndex,
  onAdvance,
  totalCount = 0,
}) => {
  const { width } = useWindowDimensions();
  
  // State for animation logic (similar to shifting circles)
  const [activeBead, setActiveBead] = useState<number | null>(null);
  const [completedBeads, setCompletedBeads] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation values
  const animatedX = useRef(new Animated.Value(0)).current;
  const completedListTranslate = useRef(new Animated.Value(0)).current;
  
  // Responsive sizing
  const threadWidth = Math.min(width - 32, 380);
  
  // Generate initial active beads list (verse numbers 1 to totalVerses, but show only DISPLAY_BEADS_COUNT)
  const generateActiveBeadsList = (): number[] => {
    const beads: number[] = [];
    for (let i = 1; i <= Math.min(DISPLAY_BEADS_COUNT, totalVerses); i++) {
      beads.push(((currentVerseIndex + i - 1) % totalVerses) + 1);
    }
    return beads;
  };
  
  const [activeBeadsList, setActiveBeadsList] = useState<number[]>(generateActiveBeadsList());
  
  // Update active beads when verse changes
  useEffect(() => {
    if (!isAnimating) {
      setActiveBeadsList(generateActiveBeadsList());
    }
  }, [currentVerseIndex, totalVerses, isAnimating]);
  
  // Calculate bead positions along curved path
  const calculateBeadPositions = (count: number) => {
    if (count === 0) return [];
    
    const positions = [];
    const spacing = Math.min(45, (threadWidth - 100) / Math.max(count - 1, 1));
    
    for (let i = 0; i < count; i++) {
      const x = 50 + (i * spacing);
      const y = 60 + Math.sin((i / (count - 1 || 1)) * Math.PI) * 20; // Curved path
      positions.push({
        left: x - BEAD_SIZE / 2,
        top: y - BEAD_SIZE / 2,
      });
    }
    return positions;
  };
  
  const activeBeadPositions = calculateBeadPositions(activeBeadsList.length);
  const completedBeadPositions = calculateBeadPositions(Math.min(completedBeads.length, MAX_COMPLETED_BEADS));
  
  /**
   * Handle bead advancement with animation
   */
  const handleBeadAdvance = () => {
    if (activeBeadsList.length === 0 || isAnimating) return;
    
    // Get the rightmost (last) bead to move
    const movingBeadValue = activeBeadsList[activeBeadsList.length - 1];
    setActiveBead(movingBeadValue);
    setIsAnimating(true);
    
    // Reset animation values
    animatedX.setValue(0);
    completedListTranslate.setValue(0);
    
    // Start parallel animations
    Animated.parallel([
      Animated.timing(animatedX, {
        toValue: 120, // Move bead to the right
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(completedListTranslate, {
        toValue: 40, // Shift completed beads to make space
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Configure layout animation for smooth list updates
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      
      // Update lists after animation
      const nextVerseNum = ((currentVerseIndex + DISPLAY_BEADS_COUNT) % totalVerses) + 1;
      const newActiveBeads = [nextVerseNum, ...activeBeadsList.slice(0, -1)];
      let newCompletedBeads = [movingBeadValue, ...completedBeads];
      
      // Maintain maximum completed beads count
      if (newCompletedBeads.length > MAX_COMPLETED_BEADS) {
        newCompletedBeads = newCompletedBeads.slice(0, MAX_COMPLETED_BEADS);
      }
      
      setActiveBeadsList(newActiveBeads);
      setCompletedBeads(newCompletedBeads);
      setActiveBead(null);
      
      // Reset animation values
      animatedX.setValue(0);
      completedListTranslate.setValue(0);
      setIsAnimating(false);
      
      // Call parent callback
      onAdvance();
    });
  };
  
  /**
   * Render individual bead component
   */
  const renderBead = (verseNumber: number, index: number, isCompleted: boolean = false) => (
    <View key={`${isCompleted ? 'completed' : 'active'}-${verseNumber}-${index}`} style={styles.beadContainer}>
      <View style={[styles.bead, isCompleted && styles.completedBead]}>
        <FastImage
          source={rosaryBead}
          style={[styles.beadImg, isCompleted && styles.completedBeadImg]}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={[styles.beadNumber, isCompleted && styles.completedBeadNumber]}>
          {verseNumber}
        </Text>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {/* Counter header */}
      <View style={styles.counterHeader}>
        <View style={styles.counterIndexRow}>
          <H3Bold style={styles.currentIndex}>{currentVerseIndex + 1}</H3Bold>
          <Body1Title2Bold style={styles.slash}>/</Body1Title2Bold>
          <Body1Title2Bold style={styles.totalCount}>{totalVerses}</Body1Title2Bold>
        </View>
        <Body1Title2Regular style={styles.roundText}>
          Round {Math.floor(totalCount / totalVerses) + 1}
        </Body1Title2Regular>
      </View>
      
      {/* Main beads container */}
      <Pressable style={styles.beadsContainer} onPress={handleBeadAdvance}>
        <View style={[styles.threadContainer, { width: threadWidth }]}>
          {/* Background thread */}
          <Thread width={threadWidth} height={120} style={styles.threadSvg} />
          
          <View style={styles.rowContainer}>
            {/* Active beads (left side) */}
            <View style={styles.activeBeadsContainer}>
              <FlatList
                horizontal
                data={activeBeadsList.filter(bead => bead !== activeBead)}
                renderItem={({ item, index }) => (
                  <View style={[styles.beadWrapper, activeBeadPositions[index] || { left: 0, top: 0 }]}>
                    {renderBead(item, index)}
                  </View>
                )}
                keyExtractor={(item, index) => `active-${item}-${index}`}
                contentContainerStyle={styles.beadsList}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
              />
            </View>
            
            {/* Separator */}
            <View style={styles.separator} />
            
            {/* Completed beads (right side) */}
            <Animated.View 
              style={[
                styles.completedBeadsContainer,
                { transform: [{ translateX: completedListTranslate }] }
              ]}
            >
              <FlatList
                horizontal
                data={completedBeads.slice(0, MAX_COMPLETED_BEADS)}
                renderItem={({ item, index }) => (
                  <View style={[styles.beadWrapper, completedBeadPositions[index] || { left: 0, top: 0 }]}>
                    {renderBead(item, index, true)}
                  </View>
                )}
                keyExtractor={(item, index) => `completed-${item}-${index}`}
                contentContainerStyle={styles.beadsList}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
              />
            </Animated.View>
          </View>
          
          {/* Moving bead animation */}
          {activeBead && (
            <Animated.View
              style={[
                styles.movingBeadContainer,
                {
                  transform: [{ translateX: animatedX }],
                },
              ]}
            >
              <View style={styles.bead}>
                <FastImage
                  source={rosaryBead}
                  style={styles.beadImg}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <Text style={styles.beadNumber}>{activeBead}</Text>
              </View>
            </Animated.View>
          )}
        </View>
      </Pressable>
      
      <Body1Title2Regular color="sub-heading" style={styles.swipeHint}>
        Tap to advance to next verse
      </Body1Title2Regular>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  counterHeader: {
    width: '100%',
    alignItems: 'flex-start',
    paddingLeft: 8,
    marginBottom: 16,
  },
  counterIndexRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currentIndex: {
    fontSize: 38,
    color: '#8A57DC',
    fontWeight: '700',
    marginRight: 2,
  },
  slash: {
    fontSize: 32,
    color: '#888',
    fontWeight: '700',
    marginRight: 2,
  },
  totalCount: {
    fontSize: 32,
    color: '#888',
    fontWeight: '700',
  },
  roundText: {
    fontSize: 18,
    color: '#222',
    fontWeight: '600',
    marginTop: 2,
    marginLeft: 2,
  },
  beadsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  threadContainer: {
    height: 120,
    position: 'relative',
    marginVertical: 16,
  },
  threadSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
  },
  activeBeadsContainer: {
    flex: 1,
  },
  completedBeadsContainer: {
    flex: 1,
  },
  separator: {
    width: 32,
  },
  beadsList: {
    gap: -8, // Overlap beads slightly like rosary
    paddingHorizontal: 10,
  },
  beadWrapper: {
    position: 'absolute',
    width: BEAD_SIZE + 8,
    height: BEAD_SIZE + 8,
    zIndex: 1,
  },
  beadContainer: {
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bead: {
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    borderRadius: BEAD_SIZE / 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  completedBead: {
    opacity: 0.7,
    transform: [{ scale: 0.9 }],
  },
  beadImg: {
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    borderRadius: BEAD_SIZE / 2,
    position: 'absolute',
  },
  completedBeadImg: {
    opacity: 0.8,
  },
  beadNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    zIndex: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  completedBeadNumber: {
    fontSize: 10,
    opacity: 0.9,
  },
  movingBeadContainer: {
    position: 'absolute',
    top: '50%',
    left: '30%',
    marginTop: -BEAD_SIZE / 2,
    marginLeft: -BEAD_SIZE / 2,
    zIndex: 10,
  },
  swipeHint: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default Beads;