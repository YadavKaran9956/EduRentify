import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { COLORS } from '../../constants/Theme';
import { Button, TextInput } from 'react-native-paper';
import { authService } from '../../services/apiService';
import { storageService } from '../../services/storageService';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../reduxStore/slices/authSlice';
// import { Toaster } from '../../components/toast';
// import { isValidEmail } from '../../utils/validators';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [errors, setError] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const validateForm = () => {
    let err: FormErrors = {};

    if (!email) err.email = 'Email is required.';
    if (!password) err.password = 'Password is required.';
    // if (email && !isValidEmail(email)) {
    //   err.email = 'Email is not valid';
    // }

    setError(err);

    return Object.keys(err).length === 0;
  };

  const handleFormSubmit = async () => {
    console.log('validateform()', validateForm());
    if (validateForm()) {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(() => resolve(null), 2000));
        const user = await authService.login(email, password);
        const res = storageService.setCredentials(
          user.username,
          user.accessToken,
          'loggedUser',
        );
        console.log('res=>', res);
        dispatch(loginSuccess(user));
        setEmail('');
        setPassword('');
        setError({});
      } catch (e: any) {
        // e.message == 'Network Error' ||
        // e.message == 'timeout of 5000ms exceeded'
        //   ? Toaster.toastError(e.message)
        //   : Toaster.toastError(e?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    } else {
      console.log(errors);
      console.log(email);
      console.log(password);
    }
  };

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

            {/* Name */}
            <TextInput
              style={styles.input}
              label="Name"
              mode="outlined"
              //   value={name}
              //   onChangeText={setName}
              autoCapitalize="words"
            />
            {/* {errors.name ? (
              <View style={styles.errContainer}>
                <Text style={styles.errorMsg}>{errors.name}</Text>
              </View>
            ) : null} */}

            {/* Email */}
            <TextInput
              style={styles.input}
              label="Email"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? (
              <View style={styles.errContainer}>
                <Text style={styles.errorMsg}>{errors.email}</Text>
              </View>
            ) : null}

            {/* Phone Number */}
            <TextInput
              style={styles.input}
              label="Phone Number"
              mode="outlined"
              //   value={phoneNumber}
              //   onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            {/* {errors.phoneNumber ? (
              <View style={styles.errContainer}>
                <Text style={styles.errorMsg}>{errors.phoneNumber}</Text>
              </View>
            ) : null} */}

            {/* Address */}
            <TextInput
              style={styles.input}
              label="Address"
              mode="outlined"
              //   value={address}
              //   onChangeText={setAddress}
              autoCapitalize="words"
            />
            {/* {errors.address ? (
              <View style={styles.errContainer}>
                <Text style={styles.errorMsg}>{errors.address}</Text>
              </View>
            ) : null} */}

            {/* City and State - Single Line */}
            <View style={styles.rowContainer}>
              <View style={styles.rowItem}>
                <TextInput
                  style={styles.inputRow}
                  label="City"
                  mode="outlined"
                  //   value={city}
                  //   onChangeText={setCity}
                  autoCapitalize="words"
                />
                {/* {errors.city ? (
                  <View style={styles.errContainer}>
                    <Text style={styles.errorMsg}>{errors.city}</Text>
                  </View>
                ) : null} */}
              </View>

              <View style={styles.rowItem}>
                <TextInput
                  style={styles.inputRow}
                  label="State"
                  mode="outlined"
                  //   value={state}
                  //   onChangeText={setState}
                  autoCapitalize="words"
                />
                {/* {errors.state ? (
                  <View style={styles.errContainer}>
                    <Text style={styles.errorMsg}>{errors.state}</Text>
                  </View>
                ) : null} */}
              </View>
            </View>

            {/* Zipcode */}
            <TextInput
              style={styles.input}
              label="Zipcode"
              mode="outlined"
              //   value={zipcode}
              //   onChangeText={setZipcode}
              keyboardType="numeric"
            />
            {/* {errors.zipcode ? (
              <View style={styles.errContainer}>
                <Text style={styles.errorMsg}>{errors.zipcode}</Text>
              </View>
            ) : null} */}

            {/* College/University */}
            <TextInput
              style={styles.input}
              label="College/University"
              mode="outlined"
              //   value={college}
              //   onChangeText={setCollege}
              autoCapitalize="words"
            />
            {/* {errors.college ? (
              <View style={styles.errContainer}>
                <Text style={styles.errorMsg}>{errors.college}</Text>
              </View>
            ) : null} */}

            {/* Password */}
            <TextInput
              style={styles.input}
              label="Password"
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
            />
            {errors.password ? (
              <View style={styles.errContainer}>
                <Text style={styles.errorMsg}>{errors.password}</Text>
              </View>
            ) : null}

            {/* Confirm Password */}
            <TextInput
              style={styles.input}
              label="Confirm Password"
              mode="outlined"
              //   value={confirmPassword}
              //   onChangeText={setConfirmPassword}
              //   secureTextEntry={secureConfirmText}
              //   right={
              //     <TextInput.Icon
              //       icon={secureConfirmText ? 'eye-off' : 'eye'}
              //       onPress={() => setSecureConfirmText(!secureConfirmText)}
              //     />
              //   }
            />
            {/* {errors.confirmPassword ? (
              <View style={styles.errContainer}>
                <Text style={styles.errorMsg}>{errors.confirmPassword}</Text>
              </View>
            ) : null} */}

            <Button
              mode="contained"
              onPress={() => handleFormSubmit()}
              style={styles.button}
              contentStyle={{
                height: 50,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              labelStyle={styles.buttonText}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>

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
