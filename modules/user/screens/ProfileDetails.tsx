// dependencies
import {Pressable, StyleSheet, View, ActivityIndicator, Alert, Platform} from 'react-native';
import React, {useState, useEffect} from 'react';

// assets
import {Avatar} from './components/ProfileDetails';
import CustomTextInput from './components/ProfileDetails/CustomTextInput';
import {Divider} from '@/components';
import {Body1Title2Bold} from '@/components';
import {useAuthStore} from '@/modules/auth/store/authStore';

// hooks
import {useUserDetails, useUpdateUserDetails} from '../hooks/useUserProfile';
import {UserDetails} from '../services/userService';

const ProfileDetails: React.FC = () => {
  const {user} = useAuthStore();
  
  // Fetch user details from API
  const {data: userDetails, isLoading: isLoadingDetails, error: userError} = useUserDetails();
  
  // Update user details mutation
  const {mutate: updateUser, isPending: isUpdating} = useUpdateUserDetails();
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [formErrors, setFormErrors] = useState<{firstName?: string; lastName?: string}>({});
  
  // Initialize form with user data
  useEffect(() => {
    if (userDetails) {
      setFirstName(userDetails.firstName || '');
      setLastName(userDetails.lastName || '');
      setHasChanges(false); // Reset changes flag when new data is loaded
    } else if (user) {
      // Fallback to auth store data if API data not available yet
      const nameParts = user.name?.split(' ') || ['', ''];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
    }
  }, [userDetails, user]);
  
  // Check if form has changes
  useEffect(() => {
    if (userDetails) {
      const hasNameChanges = 
        firstName !== userDetails.firstName || 
        lastName !== userDetails.lastName;
      
      setHasChanges(hasNameChanges);
    }
  }, [firstName, lastName, userDetails]);
  
  // Validate form
  const validateForm = (): boolean => {
    const errors: {firstName?: string; lastName?: string} = {};
    
    // Validate first name
    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    
    // Validate last name
    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle save changes
  const handleSaveChanges = () => {
    if (!validateForm()) {
      return;
    }
    
    if (!userDetails?.userId) {
      Alert.alert('Error', 'User ID is missing. Please try again later.');
      return;
    }
    
    // Prepare update data
    const updateData = {
      userId: userDetails.userId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      // We're only updating names for now, other fields are kept the same
      gender: userDetails.gender as 'MALE' | 'FEMALE' | 'OTHER',
      dob: userDetails.dob,
      phone: userDetails.phone || undefined,
      profileImage: userDetails.profileImage,
    };
    
    // Call update mutation
    updateUser(updateData, {
      onSuccess: () => {
        Alert.alert('Success', 'Profile updated successfully');
        setHasChanges(false);
      },
      onError: (error: Error) => {
        Alert.alert('Error', `Failed to update profile: ${error.message}`);
      },
    });
  };

  // Show loading state
  if (isLoadingDetails && !userDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A57DC" />
      </View>
    );
  }

  // Show error state
  if (userError) {
    return (
      <View style={styles.errorContainer}>
        <Body1Title2Bold color="sub-heading">Failed to load profile</Body1Title2Bold>
        <Pressable 
          style={styles.retryButton}
          onPress={() => {
            // Reload the page - this is platform specific
            if (Platform.OS === 'web') {
              // @ts-ignore - window is available on web
              window.location.reload();
            }
          }}>
          <Body1Title2Bold color="white">Retry</Body1Title2Bold>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingTop: 32,
      }}>
      <Avatar imageUrl={userDetails?.profileImage || user?.photoUrl || ''} />
      <Divider height={24} />
      <View style={styles.form}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            columnGap: 20,
            justifyContent: 'space-between',
            overflow: 'scroll',
          }}>
          <View style={{flex: 1}}>
            <CustomTextInput 
              label="First Name" 
              value={firstName} 
              onChange={(text: string) => setFirstName(text)}
              error={formErrors.firstName}
            />
          </View>
          <View style={{flex: 1}}>
            <CustomTextInput 
              label="Last Name" 
              value={lastName} 
              onChange={(text: string) => setLastName(text)}
              error={formErrors.lastName}
            />
          </View>
        </View>
        <View>
          <CustomTextInput 
            label="Email" 
            value={userDetails?.email || user?.email || ''} 
            disabled={true}
          />
        </View>
        <View>
          <CustomTextInput 
            label="Phone number" 
            value={userDetails?.phone?.toString() || user?.phone || ''} 
            disabled={true}
          />
        </View>
        <View>
          <CustomTextInput 
            label="Gender" 
            value={userDetails?.gender || user?.gender || ''} 
            disabled={true}
          />
        </View>
        <View>
          <CustomTextInput 
            label="Date of Birth" 
            value={userDetails?.dob || user?.dob || ''} 
            disabled={true}
          />
        </View>

        <Pressable 
          style={[styles.submitBtn, hasChanges ? styles.submitBtnActive : {}]}
          onPress={handleSaveChanges}
          disabled={!hasChanges || isUpdating}>
          {isUpdating ? (
            <ActivityIndicator size="small" color="#8A57DC" />
          ) : (
            <Body1Title2Bold color={hasChanges ? "primary" : "sub-heading"}>
              Save Changes
            </Body1Title2Bold>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default ProfileDetails;

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 18,
    rowGap: 12,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#8A57DC',
    borderRadius: 100,
  },
  submitBtn: {
    position: 'absolute',
    bottom: 31,
    height: 40,
    backgroundColor: '#F5F5F5',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  submitBtnActive: {
    backgroundColor: '#F9F6FF',
    borderWidth: 1,
    borderColor: '#8A57DC',
  },
});
