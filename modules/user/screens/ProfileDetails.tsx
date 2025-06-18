// dependencies
import {Pressable, StyleSheet, View, ActivityIndicator, Alert, Platform, TouchableOpacity, Modal, Keyboard, ViewStyle, TextInput, findNodeHandle} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// components
import {Body1Title2Medium, Body1Title2Bold, Divider} from '@/components';
import CustomTextInput from './components/ProfileDetails/CustomTextInput';
import Avatar from './components/ProfileDetails/Avatar';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import { CdnSvg } from '@/components/CdnSvg';

// hooks
import {useAuthStore} from '@/modules/auth/store/authStore';
import {useUserDetails, useUpdateUserDetails} from '../hooks/useUserProfile';
import { UserDetails, UserUpdateDTO } from '../services/userService';
import { ImagePickerHelper } from '../utils/imagePickerHelper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  datePickerContainer: {
    position: 'relative',
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#8A57DC',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8A57DC',
  },
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
  
  // Refs for text inputs and scroll view
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null); // Ref for KeyboardAwareScrollView

  // Refs for layout measurements to scroll to specific elements
  const genderRadioRef = useRef<View>(null);
  const dobInputRef = useRef<View>(null);

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

  // State to store layout positions for scrolling
  const [genderRadioY, setGenderRadioY] = useState(0);
  const [dobInputY, setDobInputY] = useState(0);

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
          date > new Date() // Prevent future dates
        ) {
          errors.dob = 'Please enter a valid date (no future dates)';
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

  // Handle profile image update
  const handleProfileImageUpdate = async (fileUrl: string) => {
    if (!userDetails?.userId) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    try {
      updateUser({
        userId: userDetails.userId,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        phone: userDetails.phone || undefined,
        dob: userDetails.dob,
        gender: userDetails.gender as 'MALE' | 'FEMALE' | 'OTHER' | undefined,
        profileImage: fileUrl,
      }, {
        onSuccess: () => {
          Alert.alert('Success', 'Profile image updated successfully');
        },
        onError: (error: Error) => {
          Alert.alert('Error', error.message);
        },
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile image');
    }
  };

  // Handle image selection with permissions
  const handleImageSelection = async () => {
    try {
      // Show image picker options
      const selectedImage = await ImagePickerHelper.showImagePickerOptions();
      
      if (!selectedImage) {
        return;
      }

      // Update profile with selected image
      handleProfileImageUpdate(selectedImage.uri);
    } catch (error: any) {
      console.error('Image selection error:', error);
      Alert.alert('Error', error.message || 'Failed to select image');
    }
  };

  // Radio button component
  const RadioButton = ({ label, value, selected, onPress }: { 
    label: string; 
    value: string; 
    selected: boolean; 
    onPress: () => void; 
  }) => (
    <TouchableOpacity style={styles.radioOption} onPress={onPress}>
      <View style={[styles.radioButton, selected && styles.radioButtonSelected]}>
        {selected && <View style={styles.radioButtonInner} />}
      </View>
      <Body1Title2Medium color={selected ? "primary" : "sub-heading"}>
        {label}
      </Body1Title2Medium>
    </TouchableOpacity>
  );

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
        innerRef={r => (scrollViewRef.current = r as any)} // Use innerRef to access internal methods
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingTop: 32 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={100}>
        <Avatar 
          imageUrl={userDetails?.profileImage || user?.photoUrl || ''}
          userId={userDetails?.userId || user?.id || ''}
          onImageUploaded={handleProfileImageUpdate}
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
                ref={firstNameRef}
                label="First name" 
                value={firstName}
                onChangeText={(text: string) => setFirstName(text)} 
                onSubmitEditing={() => lastNameRef.current?.focus()} 
                returnKeyType="next"
                onFocus={() => setFocusedInput('firstName')}
                onBlur={() => setFocusedInput('')}
                customStyle={focusedInput === 'firstName' ? { borderColor: '#8A57DC', borderWidth: 1 } : undefined}
                error={formErrors.firstName}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomTextInput 
                ref={lastNameRef}
                label="Last name" 
                value={lastName}
                onChangeText={(text: string) => setLastName(text)} 
                onSubmitEditing={() => phoneRef.current?.focus()} 
                returnKeyType="next"
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
              ref={phoneRef}
              label="Phone number" 
              value={phone}
              onChangeText={(text: string) => setPhone(text.replace(/[^0-9]/g, ''))} 
              onSubmitEditing={() => {
                Keyboard.dismiss(); // Dismiss keyboard
                // Scroll to the gender radio buttons after phone number is entered
                if (genderRadioRef.current && scrollViewRef.current) {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd(true);
                  }, 100); // Add a small delay
                }
              }} 
              keyboardType="phone-pad"
              returnKeyType="done"
              onFocus={() => setFocusedInput('phone')}
              onBlur={() => setFocusedInput('')}
              customStyle={focusedInput === 'phone' ? { borderColor: '#8A57DC', borderWidth: 1 } : undefined}
              error={formErrors.phone}
            />
          </View>
          <View
            ref={genderRadioRef}
            onLayout={(event) => {
              const { y } = event.nativeEvent.layout;
              setGenderRadioY(y);
            }} 
          >
            <View style={styles.radioContainer}>
              <Body1Title2Medium color="sub-heading" style={styles.inputLabel}>
                Gender
              </Body1Title2Medium>
              <View style={styles.radioGroup}>
                <RadioButton
                  label="Male"
                  value="MALE"
                  selected={gender === 'MALE'}
                  onPress={() => {
                    setGender('MALE');
                    if (dobInputRef.current && scrollViewRef.current) {
                      setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd(true);
                      }, 100);
                    }
                  }}
                />
                <RadioButton
                  label="Female"
                  value="FEMALE"
                  selected={gender === 'FEMALE'}
                  onPress={() => {
                    setGender('FEMALE');
                    if (dobInputRef.current && scrollViewRef.current) {
                      setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd(true);
                      }, 100);
                    }
                  }}
                />
              </View>
              {formErrors.gender && (
                <Body1Title2Medium color="sub-heading" style={[styles.errorText, {color: '#FF0000'}]}>
                  {formErrors.gender}
                </Body1Title2Medium>
              )}
            </View>
          </View>
          <View
            ref={dobInputRef} // Attach ref for layout measurement
            onLayout={(event) => {
              const { y } = event.nativeEvent.layout;
              setDobInputY(y);
            }} 
          >
            <View style={styles.datePickerContainer}>
              <CustomTextInput 
                label="Date of Birth" 
                value={dob}
                onFocus={() => setFocusedInput('dob')}
                onBlur={() => setFocusedInput('')}
                customStyle={focusedInput === 'dob' ? { borderColor: '#8A57DC', borderWidth: 1 } : undefined}
                onChangeText={(text: string) => {
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
                    <CdnSvg path={DUA_ASSETS.CALENDAR_ICON} width={20} height={20} />
                  </TouchableOpacity>
                }
                // No onSubmitEditing for Date of Birth as it uses a picker
              />
            </View>
            
            {/* Date Picker Modal */}
            {showDatePicker && (
              <DateTimePicker
                value={datePickerDate}
                mode="date"
                display="default"
                maximumDate={new Date()} // Disable future dates
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android
                  if (selectedDate) {
                    // Check if selected date is not in the future
                    if (selectedDate <= new Date()) {
                      setDatePickerDate(selectedDate);
                      // Format date as dd-mm-yyyy
                      const day = selectedDate.getDate().toString().padStart(2, '0');
                      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
                      const year = selectedDate.getFullYear();
                      setDob(`${day}-${month}-${year}`);
                    }
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