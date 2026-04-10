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

export default function LoginScreen({ navigation }: any) {
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

  // const handleFormSubmit = async () => {
  //   console.log('validateform()', validateForm());
  //   if (validateForm()) {
  //     try {
  //       setLoading(true);
  //       await new Promise(resolve => setTimeout(() => resolve(null), 2000));
  //       const user = await authService.login(email, password);
  //       const res = storageService.setCredentials(
  //         user.username,
  //         user.accessToken,
  //         'loggedUser',
  //       );
  //       console.log('res=>', res);
  //       // dispatch(loginSuccess(user));
  //       setEmail('');
  //       setPassword('');
  //       setError({});
  //     } catch (e: any) {
  //       // e.message == 'Network Error' ||
  //       // e.message == 'timeout of 5000ms exceeded'
  //       //   ? Toaster.toastError(e.message)
  //       //   : Toaster.toastError(e?.response?.data?.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   } else {
  //     console.log(errors);
  //     console.log(email);
  //     console.log(password);
  //   }
  // };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Image
            source={require('../../assets/noBgLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Please log in into your account!</Text>

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

          <TouchableOpacity style={styles.forgetPassContainer}>
            <Text
              style={styles.forgotText}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            // onPress={() => handleFormSubmit()}
            onPress={() => navigation.navigate('Home')}
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
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <View style={styles.signupInfoContainer}>
            <Text style={styles.memberText}>New member?</Text>
            <TouchableOpacity
              onPress={() => {
                console.log('Navigating to Signup...');
                navigation.navigate('Signup');
              }}
            >
              <Text style={styles.signupInfoText}> Create new account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 400,
    height: 150,
    marginBottom: 25,
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
  forgetPassContainer: {
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 20,
  },
  forgotText: {
    textAlign: 'right',
    marginTop: 15,
    color: COLORS.primary,
    fontSize: 18,
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
  signupInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  memberText: {
    fontSize: 16,
    color: COLORS.text,
  },
  signupInfoText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
