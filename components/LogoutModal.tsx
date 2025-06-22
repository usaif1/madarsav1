import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import { Body1Title2Regular, H5Bold } from './Typography/Typography';
import { scale } from '@/theme/responsive';
import { CdnSvg } from '@/components/CdnSvg';

interface LogoutModalProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const LogoutRedIcon = () => (
  <CdnSvg 
    path="/assets/profile/logout-red.svg" 
    width={scale(21.88)} 
    height={scale(21.88)} 
  />
);

const LogoutModal: React.FC<LogoutModalProps> = ({ 
  isVisible, 
  onClose, 
  onLogout 
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.5}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriverForBackdrop // For smoother backdrop animation
    >
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.iconContainer}>
            <LogoutRedIcon/>
          </View>
          
          <H5Bold style={styles.title}>Logout from Madrasa?</H5Bold>
          
          <Body1Title2Regular color='sub-heading' style={styles.message}>
            Are you sure you would like to logout of your Madrasa account?
          </Body1Title2Regular>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]} 
            onPress={onLogout}
          >
            <Text style={styles.logoutButtonText}>Yes, Logout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>No, Keep it</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerIndicator} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end', // Aligns modal to bottom
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: scale(32),
    paddingHorizontal: scale(24), // Added horizontal padding for content
    paddingBottom: scale(24), // Added bottom padding
    width: screenWidth, // Modal takes full width
    alignItems: 'center',
    gap: scale(23), // Gap between elements as per spec (applied via margins below)
  },
  topContainer: {
    alignItems: 'center',
    gap: scale(8), // Gap between elements as per spec (applied via margins below)
  },
  iconContainer: {
    width: scale(52),
    height: scale(52),
    borderRadius: 85.71, // As per spec
    backgroundColor: '#FEF3F2',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 23, // Replaced by gap in container
  },
  title: {
    fontSize: scale(20), // Assuming title size from image, not body1title2regular
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    // marginBottom: 8, // Replaced by gap in container
  },
  message: {
    fontSize: scale(14), // body1title2regular size14
    color: '#666666', // Standard message color, can be adjusted
    textAlign: 'center',
    // marginBottom: 24, // Replaced by gap in container
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // To place buttons side-by-side with space
    gap: scale(16), // Gap between buttons if needed, or manage with button width
  },
  button: {
    width: (screenWidth - 48 - 10) / 2, // (screenWidth - paddingHorizontal*2 - gapBetweenButtons) / 2
    height: scale(40),
    borderRadius: 60, // rs-60
    // paddingTop: 10, // Primitives/space-10 - Handled by height and justifyContent
    // paddingBottom: 10, // Primitives/space-10 - Handled by height and justifyContent
    // paddingHorizontal: 20, // Primitives/space-20 - Handled by width and alignItems
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: '#F0EAFB', // Light purple from image
  },
  logoutButtonText: {
    color: '#6D2DD3', // Purple from image
    fontSize: scale(16),
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#6D2DD3', // Solid purple from image
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: scale(16),
    fontWeight: '600',
  },
  footerIndicator: {
    width: scale(40),
    height: scale(5),
    backgroundColor: '#E0E0E0',
    borderRadius: scale(2.5),
    marginTop: scale(16), // Space above indicator
  },
});

export default LogoutModal;
