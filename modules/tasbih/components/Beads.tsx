import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Platform,
  UIManager,
  AccessibilityInfo,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import LottieView from 'lottie-react-native';

// Haptic feedback options
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
import { Body1Title2Bold, Body1Title2Regular, Body1Title2Medium, H3Bold } from '@/components/Typography/Typography';
import { TasbihData } from '@/modules/dua/services/duaService';
import { scale } from '@/theme/responsive';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';

// Enable LayoutAnimation for Android with proper error handling
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  try {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  } catch (error) {
    console.warn('Failed to enable LayoutAnimation on Android:', error);
  }
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
  /** Optional accessibility label for the component */
  accessibilityLabel?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether the bead is white */
  isWhite?: boolean;
  /** Tasbih data from API */
  tasbihData?: TasbihData;
  /** Current round number */
  currentRound?: number;
}

/**
 * Beads component that uses Lottie animation instead of the traditional beads UI
 * 
 * Features:
 * - Lottie animation for tasbih
 * - Preserves counting logic
 * - Plays animation when tapped
 * - Full accessibility support
 */
const Beads: React.FC<BeadsProps> = ({
  totalVerses,
  currentVerseIndex,
  onAdvance,
  totalCount = 0,
  accessibilityLabel,
  disabled = false,
  isWhite = false,
  tasbihData,
  currentRound = 1,
}) => {
  // Input validation
  const sanitizedTotalVerses = Math.max(1, totalVerses);
  const sanitizedCurrentIndex = Math.max(0, Math.min(currentVerseIndex, sanitizedTotalVerses - 1));
  const sanitizedTotalCount = Math.max(0, totalCount);
  
  // Animation ref
  const lottieRef = useRef<LottieView>(null);
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Set up animation event listener
  useEffect(() => {
    // We'll rely on the timeout approach instead of trying to access private properties
    // This is more reliable across different versions of lottie-react-native
    return () => {
      // Cleanup any pending timeouts when component unmounts
      setIsAnimating(false);
    };
  }, []);
  
  // Use provided current round or calculate it
  const displayRound = currentRound || Math.floor(sanitizedTotalCount / sanitizedTotalVerses) + 1;
  
  // Announce current tasbih name for accessibility when it changes
  useEffect(() => {
    if (tasbihData) {
      AccessibilityInfo.announceForAccessibility(
        `Selected tasbih: ${tasbihData.title}`
      );
    }
  }, [tasbihData?.id]);
  
  /**
   * Handle animation when bead is advanced
   */
  const handleBeadAdvance = () => {
    if (isAnimating || disabled) return;
    
    try {
      setIsAnimating(true);
      
      // Trigger haptic feedback when bead is tapped
      ReactNativeHapticFeedback.trigger(
        'impactMedium',
        hapticOptions
      );
      
      // Play the Lottie animation
      if (lottieRef.current) {
        // Reset and play the animation
        lottieRef.current.reset();
        lottieRef.current.play();
        
        // Reset animation state after a short delay
        setTimeout(() => {
          setIsAnimating(false);
        }, 500); // Shorter timeout to ensure responsiveness
      } else {
        // If no animation ref, still allow counter to work
        setIsAnimating(false);
      }
      
      // Announce the current verse for accessibility
      const currentVerse = tasbihData?.verses[sanitizedCurrentIndex];
      AccessibilityInfo.announceForAccessibility(
        currentVerse
          ? `Advanced to verse ${sanitizedCurrentIndex + 2} of ${sanitizedTotalVerses}: ${currentVerse.transliteration}`
          : `Advanced to verse ${sanitizedCurrentIndex + 2} of ${sanitizedTotalVerses}`
      );
      
      // Call parent callback
      onAdvance();
    } catch (error) {
      console.error('Error handling bead advance:', error);
      setIsAnimating(false);
    }
  };
  
  return (
    <Pressable 
      style={[styles.container, disabled && styles.disabledContainer]}
      onPress={handleBeadAdvance}
      disabled={disabled || isAnimating}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel || 
        (tasbihData
          ? `Tasbih counter for ${tasbihData.title}. Currently on verse ${sanitizedCurrentIndex + 1} of ${sanitizedTotalVerses}. Tap to advance to next verse.`
          : `Tasbih counter. Currently on verse ${sanitizedCurrentIndex + 1} of ${sanitizedTotalVerses}. Tap to advance to next verse.`)
      }
      accessibilityHint="Double tap to advance to the next verse"
      accessibilityState={{
        disabled: disabled || isAnimating,
        busy: isAnimating,
      }}
    >
      {/* Counter header - styled like the image */}
      <View style={styles.counterHeader}>
        <View style={styles.counterTextContainer}>
          <H3Bold style={styles.currentIndex}>{sanitizedCurrentIndex}</H3Bold>
          <Text style={styles.counterSeparator}>/</Text>
          <Body1Title2Medium color="sub-heading" style={styles.totalVerses}>{sanitizedTotalVerses}</Body1Title2Medium>
        </View>
        <Text style={styles.roundText}>Round {displayRound}</Text>
      </View>
      
      {/* Lottie animation container */}
      <View style={styles.lottieContainer}>
        <LottieView
          ref={lottieRef}
          source={{
            uri: getCdnUrl(isWhite ? DUA_ASSETS.TASBIH_ANIMATION_WHITE : DUA_ASSETS.TASBIH_ANIMATION_BLACK)
          }}
          style={[styles.lottieAnimation, { transform: [{ rotate: '-20deg' }] }]}
          loop={false}
          autoPlay={false}
          speed={1}
          resizeMode="cover"
          onAnimationFinish={() => setIsAnimating(false)}
          onAnimationFailure={(error) => {
            console.error('Animation failed to load:', error);
            setIsAnimating(false);
          }}
        />
      </View>
      
      {/* Bottom instruction text - like in the image */}
      <Text style={styles.instructionText}>
        {disabled ? 'Tasbih is disabled' : 'Click or swipe to count'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: scale(-32),
    padding: 16,
    marginVertical: 16,
  },
  counterHeader: {
    width: '100%',
    alignItems: 'flex-start',
  },
  counterTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  currentIndex: {
    color: '#8A57DC', // Purple color
    fontSize: 29,
    lineHeight: 40,
  },
  counterSeparator: {
    color: '#6B7280',
    fontSize: 20,
    marginHorizontal: 4,
  },
  totalVerses: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '500',
  },
  roundText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  lottieContainer: {
    width: '100%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  disabledContainer: {
    opacity: 0.6,
  },
  instructionText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Beads;