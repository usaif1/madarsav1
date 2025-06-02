// dependencies
import {Pressable, StyleSheet, View, ActivityIndicator, Alert, Platform, TouchableOpacity, Modal} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import React, {useState, useEffect} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

// assets
import {Avatar} from './components/ProfileDetails';
import CustomTextInput from './components/ProfileDetails/CustomTextInput';
import {Divider} from '@/components';
import {Body1Title2Bold, Body1Title2Medium} from '@/components';
import {useAuthStore} from '@/modules/auth/store/authStore';
import Icon from 'react-native-vector-icons/MaterialIcons';

// hooks
import {useUserDetails, useUpdateUserDetails} from '../hooks/useUserProfile';
import {UserDetails, UserUpdateDTO} from '../services/userService';

const ProfileDetails: React.FC = () => {
  const {user} = useAuthStore();
  
  // Fetch user details from API
  const {data: userDetails, isLoading: isLoadingDetails, error: userError} = useUserDetails();
  
  // Update user details mutation
  const {mutate: updateUser, isPending: isUpdating} = useUpdateUserDetails();
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const [formErrors, setFormErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
    dob?: string;
    gender?: string;
  }>({});
  
  // Initialize form with user data
  useEffect(() => {
    if (userDetails) {
      setFirstName(userDetails.firstName || '');
      setLastName(userDetails.lastName || '');
      setPhone(userDetails.phone?.toString() || '');
      setDob(userDetails.dob || '');
      setGender(userDetails.gender || '');
      
      // Initialize date picker with existing date if available
      if (userDetails.dob) {
        const [day, month, year] = userDetails.dob.split('-').map(Number);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          setDatePickerDate(new Date(year, month - 1, day));
        }
      }
      
      setHasChanges(false); // Reset changes flag when new data is loaded
    } else if (user) {
      // Fallback to auth store data if API data not available yet
      const nameParts = user.name?.split(' ') || ['', ''];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setPhone(user.phone || '');
      setDob(user.dob || '');
      setGender(user.gender || '');
      
      // Initialize date picker with existing date if available
      if (user.dob) {
        const [day, month, year] = user.dob.split('-').map(Number);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          setDatePickerDate(new Date(year, month - 1, day));
        }
      }
    }
  }, [userDetails, user]);
  
  // Check if form has changes
  useEffect(() => {
    if (userDetails) {
      const hasNameChanges = 
        firstName !== userDetails.firstName || 
        lastName !== userDetails.lastName ||
        phone !== (userDetails.phone?.toString() || '') ||
        dob !== userDetails.dob ||
        gender !== userDetails.gender;
      
      setHasChanges(hasNameChanges);
    }
  }, [firstName, lastName, phone, dob, gender, userDetails]);
  
  // Validate form
  const validateForm = (): boolean => {
    const errors: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      dob?: string;
      gender?: string;
    } = {};
    
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

    // Validate phone if provided
    if (phone && !/^\d{10}$/.test(phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Validate DOB if provided
    if (dob) {
      const dobRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
      if (!dobRegex.test(dob)) {
        errors.dob = 'Please enter date in dd-mm-yyyy format';
      } else {
        const [dayStr, monthStr, yearStr] = dob.split('-');
        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);
        const date = new Date(year, month - 1, day);
        
        if (
          date.getDate() !== day ||
          date.getMonth() !== month - 1 ||
          date.getFullYear() !== year ||
          year < 1900 ||
          year > new Date().getFullYear()
        ) {
          errors.dob = 'Please enter a valid date';
        }
      }
    }

    // Validate gender if provided
    if (gender && !['MALE', 'FEMALE'].includes(gender)) {
      errors.gender = 'Please select a valid gender';
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
    const updateData: UserUpdateDTO = {
      userId: userDetails.userId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender: (gender || undefined) as 'MALE' | 'FEMALE' | 'OTHER' | undefined,
      dob: dob || undefined,
      phone: phone ? parseInt(phone, 10) : undefined,
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
            value={phone}
            onChange={(text: string) => setPhone(text.replace(/[^0-9]/g, ''))}
            error={formErrors.phone}
          />
        </View>
        <View>
          <View style={styles.pickerContainer}>
            <Body1Title2Medium color="sub-heading" style={styles.inputLabel}>
              Gender
            </Body1Title2Medium>
            <View style={[styles.pickerWrapper, formErrors.gender ? styles.pickerError : null]}>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue: string) => {
                  // Clear selection if placeholder is somehow selected
                  if (itemValue === 'placeholder') {
                    setGender('');
                    return;
                  }
                  setGender(itemValue);
                }}
                style={styles.picker}
              >
                <Picker.Item 
                  label="Select Gender"
                  value="placeholder"
                  enabled={!gender} // Only disable if no gender is selected
                  color="#A3A3A3"
                />
                <Picker.Item label="Male" value="MALE" />
                <Picker.Item label="Female" value="FEMALE" />
              </Picker>
            </View>
            {formErrors.gender && (
              <Body1Title2Medium color="sub-heading" style={[styles.errorText, {color: '#FF0000'}]}>
                {formErrors.gender}
              </Body1Title2Medium>
            )}
          </View>
        </View>
        <View>
          <View style={styles.datePickerContainer}>
            <CustomTextInput 
              label="Date of Birth" 
              value={dob}
              onChange={(text: string) => {
                // Only allow digits and -
                const cleaned = text.replace(/[^0-9-]/g, '');
                // Prevent multiple dashes
                const formatted = cleaned.split('-').slice(0, 3).join('-');
                if (formatted.length <= 10) {
                  setDob(formatted);
                }
              }}
              error={formErrors.dob}
              placeholder="dd-mm-yyyy"
              rightIcon={
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Icon name="calendar-month" size={24} color="#8A57DC" />
                </TouchableOpacity>
              }
              customStyle={{ borderColor: '#8A57DC', borderWidth: 1 }}
            />
          </View>
          
          {/* Date Picker Modal */}
          {showDatePicker && (
            <DateTimePicker
              value={datePickerDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android
                if (selectedDate) {
                  setDatePickerDate(selectedDate);
                  // Format date as dd-mm-yyyy
                  const day = selectedDate.getDate().toString().padStart(2, '0');
                  const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
                  const year = selectedDate.getFullYear();
                  setDob(`${day}-${month}-${year}`);
                }
              }}
            />
          )}
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
  datePickerContainer: {
    position: 'relative',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  pickerError: {
    borderColor: '#FF0000',
  },
  picker: {
    height: 50,
  },
  inputLabel: {
    marginBottom: 4,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
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
