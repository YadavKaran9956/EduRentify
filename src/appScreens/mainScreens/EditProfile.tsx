import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Text,
  IconButton,
  Checkbox,
} from 'react-native-paper';
import { COLORS } from '../../constants/Theme';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentUser,
  setUserCredentials,
} from '../../reduxStore/slices/authSlice';
import {
  launchCamera,
  launchImageLibrary,
  ImageLibraryOptions,
  CameraOptions,
} from 'react-native-image-picker';
import { useUpdateProfileMutation } from '../../reduxStore/slices/apiSlice';
import { Toaster } from '../../components/toast';
import { storageService } from '../../services/storageService';

export default function EditProfile({ navigation }: any) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [updateProfile, { data, isLoading, error }] =
    useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    university: '',
    avatar: null as string | null,
    wantsToList: false,
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipcode: user.zipcode || '',
        country: user.country || '',
        university: user.university || '',
        avatar: user.avatar || null,
        wantsToList: user.role == 'customer' ? user.wantToList == false : true,
      });
    }
  }, [user]);

  React.useEffect(() => {
    if (data) {
      console.log('Update profile successful:', data);
      const updatedUser = {
        ...user,
        ...(data as any).data,
      };
      console.log('Updated user:', updatedUser);

      dispatch(
        setUserCredentials({
          user: updatedUser,
          token: user?.token || null,
        }),
      );
      storageService.setCredentials(
        JSON.stringify(updatedUser),
        user?.token || '',
        'edurentify_user',
      );
      Toaster.toastInfo('Profile updated successfully');
      navigation.goBack();
    }
    if (error) {
      console.log('Update profile error:', error);
      Toaster.toastError(
        (error as any)?.data?.message || 'Failed to update profile',
      );
    }
  }, [data, error]);

  const handleImageUpload = () => {
    Alert.alert(
      'Image Upload',
      'Image upload functionality is not implemented due to Camera Plugin issue.',
    );
    // Alert.alert(
    //   'Profile Image Upload',
    //   'Select where you want to pick the image from?',
    //   [
    //     {
    //       text: 'Cancel',
    //       style: 'cancel',
    //     },
    //     {
    //       text: 'Camera',
    //       onPress: () => handleCamera(),
    //     },
    //     {
    //       text: 'Gallery',
    //       onPress: () => handleImagePick(),
    //     },
    //   ],
    // );
  };

  // const handleCamera = useCallback(async () => {
  //   const options: CameraOptions = {
  //     mediaType: 'photo',
  //     quality: 0.5,
  //   };

  //   const result = await launchCamera(options);
  //   console.log('Camera result', result);
  //   if (result.didCancel) {
  //     console.log('User cancelled camera picker');
  //   } else if (result.errorCode) {
  //     console.log('Camera Error: ', result.errorMessage);
  //   } else {
  //     console.log('Image URI: ', result?.assets?.[0]?.uri);
  //     setFormData(prev => ({
  //       ...prev,
  //       avatar: result.assets?.[0]?.uri || null,
  //     }));
  //   }
  // }, []);

  // const handleImagePick = useCallback(async () => {
  //   const options: ImageLibraryOptions = {
  //     mediaType: 'photo',
  //     quality: 0.5,
  //     selectionLimit: 1,
  //   };

  //   const result = await launchImageLibrary(options);
  //   console.log('Image picker result', result);
  //   if (result.didCancel) {
  //     console.log('User cancelled camera picker');
  //   } else if (result.errorCode) {
  //     console.log('ImagePicker Error: ', result.errorMessage);
  //   } else {
  //     console.log('Image URI: ', result?.assets?.[0]?.uri);
  //     setFormData(prev => ({
  //       ...prev,
  //       avatar: result.assets?.[0]?.uri || null,
  //     }));
  //   }
  // }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getAvatarSource = () => {
    if (formData.avatar) {
      return { uri: formData.avatar };
    }
    return {
      uri: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
    };
  };

  const handleFormSubmit = async () => {
    console.log('Form data', formData);
    await updateProfile(formData);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.imageContainer}>
                <View style={styles.avatarContainer}>
                  <Image source={getAvatarSource()} style={styles.avatar} />
                  <TouchableOpacity
                    style={styles.editAvatarButton}
                    onPress={handleImageUpload}
                    disabled={isLoading}
                  >
                    <IconButton icon="camera" iconColor="#fff" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.label}>
                Personal Information
              </Text>

              <TextInput
                mode="outlined"
                label="Name *"
                value={formData.name}
                onChangeText={value => handleInputChange('name', value)}
                style={styles.input}
                outlineColor={COLORS.primary}
                activeOutlineColor={COLORS.primary}
                selectionColor={COLORS.primary}
                disabled={isLoading}
              />

              <TextInput
                mode="outlined"
                label="Phone Number *"
                value={formData.phone}
                onChangeText={value => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                style={styles.input}
                outlineColor={COLORS.primary}
                activeOutlineColor={COLORS.primary}
                selectionColor={COLORS.primary}
                disabled={isLoading}
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.label}>
                Address Informations
              </Text>

              <TextInput
                mode="outlined"
                label="Street Address"
                value={formData.address}
                onChangeText={value => handleInputChange('address', value)}
                style={styles.input}
                outlineColor={COLORS.primary}
                activeOutlineColor={COLORS.primary}
                selectionColor={COLORS.primary}
                disabled={isLoading}
              />

              <TextInput
                mode="outlined"
                label="City"
                value={formData.city}
                onChangeText={value => handleInputChange('city', value)}
                style={styles.input}
                outlineColor={COLORS.primary}
                activeOutlineColor={COLORS.primary}
                selectionColor={COLORS.primary}
                disabled={isLoading}
              />

              <TextInput
                mode="outlined"
                label="State/Province"
                value={formData.state}
                onChangeText={value => handleInputChange('state', value)}
                style={styles.input}
                outlineColor={COLORS.primary}
                activeOutlineColor={COLORS.primary}
                selectionColor={COLORS.primary}
                disabled={isLoading}
              />

              <TextInput
                mode="outlined"
                label="ZIP/Postal Code"
                value={formData.zipcode}
                onChangeText={value => handleInputChange('zipcode', value)}
                style={styles.input}
                outlineColor={COLORS.primary}
                activeOutlineColor={COLORS.primary}
                selectionColor={COLORS.primary}
                disabled={isLoading}
              />

              <TextInput
                mode="outlined"
                label="College/University"
                value={formData.university}
                onChangeText={value => handleInputChange('university', value)}
                style={styles.input}
                outlineColor={COLORS.primary}
                activeOutlineColor={COLORS.primary}
                selectionColor={COLORS.primary}
                disabled={isLoading}
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={formData.wantsToList ? 'checked' : 'unchecked'}
                  onPress={() =>
                    handleInputChange('wantsToList', !formData.wantsToList)
                  }
                  disabled={isLoading}
                  color={COLORS.primary}
                />
                <Text style={styles.checkboxLabel}>
                  I want to become a lister
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={handleFormSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    backgroundColor: COLORS.white,
    elevation: 2,
    borderRadius: 8,
  },
  label: {
    fontWeight: '600',
    marginBottom: 12,
    color: COLORS.text,
    fontSize: 16,
  },
  input: {
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
  },
  submitButtonContent: {
    paddingVertical: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
  },
});
