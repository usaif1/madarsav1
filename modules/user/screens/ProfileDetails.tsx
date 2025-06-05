// dependencies
import {Pressable, StyleSheet, View, ActivityIndicator, Alert, Platform, TouchableOpacity, Modal, Keyboard, ViewStyle} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// components
import {Body1Title2Medium, Body1Title2Bold, Divider} from '@/components';
import CustomTextInput from './components/ProfileDetails/CustomTextInput';
import Avatar from './components/ProfileDetails/Avatar';
import CalendarIcon from '@/assets/profile/calendar_icon.svg';

// hooks
import {useAuthStore} from '@/modules/auth/store/authStore';
import {useUserDetails, useUpdateUserDetails} from '../hooks/useUserProfile';
import {UserDetails, UserUpdateDTO} from '../services/userService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
    width: '100%',
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  pickerItem: {
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  placeholderText: {
    color: '#999999',
  },
  pickerModal: Platform.select({
    android: {
      backgroundColor: '#FFFFFF',
    } as ViewStyle,
    ios: {
      backgroundColor: '#FFFFFF',
    } as ViewStyle,
    default: {
      backgroundColor: '#FFFFFF',
    } as ViewStyle,
  }) as ViewStyle,
  inputLabel: {
    marginBottom: 4,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#FF0000',
  },
  form: {
    paddingHorizontal: 18,
    // gap: 12, // Moved to formInputsContainer
    flex: 1,
    width: '100%',
  },
  formInputsContainer: {
    flex: 1, // This will push the button down
    gap: 12, // Spacing between input groups
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
    // position: 'absolute', // Removed
    // bottom: 31, // Removed
    height: 40,
    backgroundColor: '#F5F5F5',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginTop: 24, // Added space above the button
    marginBottom: 31, // Added space below the button (for when keyboard is closed)
  },
  submitBtnActive: {
    backgroundColor: '#F9F6FF',
    borderWidth: 1,
    borderColor: '#8A57DC',
  },
});

const ProfileDetails: React.FC = () => {
  // Setup keyboard dismiss handler
  const handleScreenPress = () => {
    Keyboard.dismiss();
  };
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
  const [focusedInput, setFocusedInput] = useState<string>('');

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

    const updateData: UserUpdateDTO = {
      userId: userDetails?.userId || '',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone ? parseInt(phone, 10) : undefined,
      dob: dob || undefined,
      gender: (gender || undefined) as 'MALE' | 'FEMALE' | 'OTHER' | undefined,
    };

    updateUser(updateData, {
      onSuccess: () => {
        Alert.alert('Success', 'Profile updated successfully');
      },
      onError: (error: Error) => {
        Alert.alert('Error', error.message);
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
        <Body1Title2Medium color="sub-heading">
          {userError.message}
        </Body1Title2Medium>
        <Pressable 
          style={styles.retryButton}
          onPress={() => {
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
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleScreenPress}
      style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingTop: 32 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}>
        <Avatar 
          imageUrl={userDetails?.profileImage || user?.photoUrl || ''}
          userId={userDetails?.userId || user?.id || ''}
          onImageUploaded={(fileUrl) => {
            // Update user details with new profile image
            if (userDetails?.userId) {
              updateUser({
                userId: userDetails.userId,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                phone: userDetails.phone || undefined,
                dob: userDetails.dob,
                gender: userDetails.gender as 'MALE' | 'FEMALE' | 'OTHER' | undefined,
                profileImage: fileUrl,
              });
            }
          }}
        />
        <Divider height={24} />

        <View style={styles.form}>
          <View style={styles.formInputsContainer}>
            <View
            style={{
              width: '100%',
              flexDirection: 'row',
              columnGap: 20,
              justifyContent: 'space-between',
              overflow: 'scroll',
            }}>
            <View style={{ flex: 1 }}>
              <CustomTextInput 
                label="First name" 
                value={firstName}
                onChange={(text: string) => setFirstName(text)}
                onFocus={() => setFocusedInput('firstName')}
                onBlur={() => setFocusedInput('')}
                customStyle={focusedInput === 'firstName' ? { borderColor: '#8A57DC', borderWidth: 1 } : undefined}
                error={formErrors.firstName}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomTextInput 
                label="Last name" 
                value={lastName}
                onChange={(text: string) => setLastName(text)}
                onFocus={() => setFocusedInput('lastName')}
                onBlur={() => setFocusedInput('')}
                customStyle={focusedInput === 'lastName' ? { borderColor: '#8A57DC', borderWidth: 1 } : undefined}
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
              onFocus={() => setFocusedInput('phone')}
              onBlur={() => setFocusedInput('')}
              customStyle={focusedInput === 'phone' ? { borderColor: '#8A57DC', borderWidth: 1 } : undefined}
              error={formErrors.phone}
            />
          </View>
          <View>
            <View style={styles.pickerContainer}>
              <Body1Title2Medium color="sub-heading" style={styles.inputLabel}>
                Gender
              </Body1Title2Medium>
              <View style={[styles.pickerWrapper, formErrors.gender && styles.pickerError]}>
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue: string) => setGender(itemValue)}
                  style={styles.picker}
                  enabled={true}
                  itemStyle={styles.pickerItem}
                  dropdownIconColor="#000000"
                  mode="dropdown"
                  prompt="Select Gender"
                  {...Platform.select({
                    android: {
                      style: [styles.picker, styles.pickerModal],
                    },
                  })}>
                  <Picker.Item label="Select Gender" value="" style={styles.placeholderText} color="#999999" />
                  <Picker.Item label="Male" value="MALE" style={styles.pickerItem} color="#000000" />
                  <Picker.Item label="Female" value="FEMALE" style={styles.pickerItem} color="#000000" />
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
                onFocus={() => setFocusedInput('dob')}
                onBlur={() => setFocusedInput('')}
                customStyle={focusedInput === 'dob' ? { borderColor: '#8A57DC', borderWidth: 1 } : undefined}
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
                    <CalendarIcon/>
                  </TouchableOpacity>
                }
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
          </View> {/* Closing formInputsContainer */} 

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
      </KeyboardAwareScrollView>
    </TouchableOpacity>
  );
};

export default ProfileDetails;