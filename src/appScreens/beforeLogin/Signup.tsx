import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../constants/Theme';
import { Button, TextInput } from 'react-native-paper';
import { isValidEmail } from '../../utils/validators';
import { useRegisterMutation } from '../../reduxStore/slices/apiSlice';
import { Toaster } from '../../components/toast';

interface FormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setzipcode] = useState('');
  const [college, setCollege] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  const [errors, setError] = useState<FormErrors>({});

  const [register, { data, isLoading, error }] = useRegisterMutation();

  const validateForm = () => {
    let err: FormErrors = {};

    if (!name) err.name = 'Name is required.';
    if (!email) err.email = 'Email is required.';
    if (!phoneNumber) err.phoneNumber = 'Phone number is required.';
    if (!password) err.password = 'Password is required.';
    if (!password_confirmation)
      err.confirmPassword = 'Confirm password is required.';
    if (password && password_confirmation && password !== password_confirmation)
      err.confirmPassword = 'Passwords do not match.';
    if (email && !isValidEmail(email)) {
      err.email = 'Email is not valid';
    }

    setError(err);

    return Object.keys(err).length === 0;
  };

  const handleFormSubmit = async () => {
    if (validateForm()) {
      await register({
        name,
        email,
        phoneNumber,
        address,
        city,
        state,
        zipcode,
        college,
        password,
        password_confirmation,
      });
    } else {
      console.log(errors);
    }
  };

  React.useEffect(() => {
    if (data) {
      console.log('Registration successful:', data);
      setName('');
      setEmail('');
      setPhoneNumber('');
      setAddress('');
      setCity('');
      setState('');
      setzipcode('');
      setCollege('');
      setPassword('');
      setConfirmPassword('');
      setError({});
      Toaster.toastSuccess((data as any)?.message);
      navigation.navigate('Login');
    }
  }, [data]);

  React.useEffect(() => {
    if (error) {
      console.log('Registration error:', error);
      const errorMessage =
        (error as any)?.data?.message || 'Registration failed';
      Toaster.toastError(errorMessage);
    }
  }, [error]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.innerContainer}>
            <Image
              source={require('../../assets/noBgLogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Please create a new account!</Text>

            <TextInput
              style={styles.input}
              label="Name*"
              mode="outlined"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              disabled={isLoading}
            />
            {errors.name ? (
              <View style={styles.errContainer}>
                <Text style={styles.errorMsg}>{errors.name}</Text>
              </View>
            ) : null}

            <TextInput
              style={styles.input}
              label="Email*"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              disabled={isLoading}
            />
            {errors.email ? (
              <View style={styles.errContainer}>
                <Text style={styles.errorMsg}>{errors.email}</Text>
              </View>
            ) : null}

            <TextInput
              style={styles.input}
              label="Phone Number*"
              mode="outlined"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              disabled={isLoading}
            />
            {errors.phoneNumber ? (
              <View style={styles.errContainer}>
                <Text style={styles.errorMsg}>{errors.phoneNumber}</Text>
              </View>
            ) : null}

            <TextInput
              style={styles.input}
              label="Address"
              mode="outlined"
              value={address}
              onChangeText={setAddress}
              autoCapitalize="words"
              disabled={isLoading}
            />

            <View style={styles.rowContainer}>
              <View style={styles.rowItem}>
                <TextInput
                  style={styles.inputRow}
                  label="City"
                  mode="outlined"
                  value={city}
                  onChangeText={setCity}
                  autoCapitalize="words"
                  disabled={isLoading}
                />
              </View>

              <View style={styles.rowItem}>
                <TextInput
                  style={styles.inputRow}
                  label="State"
                  mode="outlined"
                  value={state}
                  onChangeText={setState}
                  autoCapitalize="words"
                  disabled={isLoading}
                />
              </View>
            </View>

            <TextInput
              style={styles.input}
              label="zipcode"
              mode="outlined"
              value={zipcode}
              onChangeText={setzipcode}
              keyboardType="numeric"
              disabled={isLoading}
            />

            <TextInput
              style={styles.input}
              label="College/University"
              mode="outlined"
              value={college}
              onChangeText={setCollege}
              autoCapitalize="words"
              disabled={isLoading}
            />

            <TextInput
              style={styles.input}
              label="Password*"
              mode="outlined"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
              right={
                <TextInput.Icon
                  icon={secureText ? 'eye-off' : 'eye'}
                  onPress={() => setSecureText(!secureText)}
                />
              }
              disabled={isLoading}
            />
            {errors.password ? (
              <View style={styles.errContainer}>
                <Text style={styles.errorMsg}>{errors.password}</Text>
              </View>
            ) : null}

            <TextInput
              style={styles.input}
              label="Confirm Password*"
              mode="outlined"
              value={password_confirmation}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureConfirmText}
              right={
                <TextInput.Icon
                  icon={secureConfirmText ? 'eye-off' : 'eye'}
                  onPress={() => setSecureConfirmText(!secureConfirmText)}
                />
              }
              disabled={isLoading}
            />
            {errors.confirmPassword ? (
              <View style={styles.errContainer}>
                <Text style={styles.errorMsg}>{errors.confirmPassword}</Text>
              </View>
            ) : null}

            {isLoading ? (
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: COLORS.primary, opacity: 0.7 },
                ]}
                disabled={true}
              >
                <View
                  style={{
                    height: 50,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={[styles.buttonText, { color: '#fff' }]}>
                    Please wait...
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Button
                mode="contained"
                onPress={() => handleFormSubmit()}
                style={styles.button}
                contentStyle={{
                  height: 50,
                  width: '100%',
                }}
                labelStyle={styles.buttonText}
              >
                Sign Up
              </Button>
            )}

            <View style={styles.loginInfoContainer}>
              <Text style={styles.memberText}>Already a member?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginInfoText}> Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingBottom: 40,
    paddingTop: 20,
  },
  logo: {
    width: 400,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.text,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderColor: COLORS.muted,
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
    marginBottom: 10,
  },
  rowItem: {
    flex: 1,
  },
  inputRow: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderColor: COLORS.muted,
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginTop: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 0,
  },
  errContainer: {
    width: '100%',
    marginBottom: 10,
  },
  errorMsg: {
    color: COLORS.danger,
  },
  loginInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  memberText: {
    fontSize: 16,
    color: COLORS.text,
  },
  loginInfoText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
