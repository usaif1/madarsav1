// modules/error/components/ErrorToast.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useErrorStore } from '../store/errorStore';
import { ErrorType } from '@/api/utils/errorHandling';

// Toast duration in milliseconds
const TOAST_DURATION = 3000;

const ErrorToast: React.FC = () => {
  const { errors, removeError, isOffline } = useErrorStore();
  const [visible, setVisible] = useState(false);
  const translateY = new Animated.Value(-100);
  
  // Show first error in the queue
  const currentError = errors[0];
  
  useEffect(() => {
    if (currentError || isOffline) {
      setVisible(true);
      
      // Slide in animation
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Auto-hide after duration (except for offline notification)
      if (!isOffline) {
        const timer = setTimeout(() => {
          hideToast();
        }, TOAST_DURATION);
        
        return () => clearTimeout(timer);
      }
    }
  }, [currentError, isOffline]);
  
  const hideToast = () => {
    // Slide out animation
    Animated.timing(translateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      if (currentError) {
        removeError(0);
      }
    });
  };
  
  if (!visible) return null;
  
  // Determine background color based on error type or offline status
  let backgroundColor = '#333';
  let icon = '⚠️';
  
  if (isOffline) {
    backgroundColor = '#555';
    icon = '📶';
  } else if (currentError) {
    switch (currentError.type) {
      case ErrorType.NETWORK:
        backgroundColor = '#555';
        icon = '📶';
        break;
      case ErrorType.AUTH:
        backgroundColor = '#c0392b';
        icon = '🔒';
        break;
      case ErrorType.VALIDATION:
        backgroundColor = '#e67e22';
        icon = '⚠️';
        break;
      case ErrorType.SERVER:
        backgroundColor = '#c0392b';
        icon = '⚙️';
        break;
      default:
        backgroundColor = '#333';
        icon = '❗';
    }
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View 
        style={[
          styles.container, 
          { backgroundColor, transform: [{ translateY }] }
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.message}>
          {isOffline 
            ? 'No internet connection' 
            : currentError?.message || 'An error occurred'
          }
        </Text>
        <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  message: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorToast;