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
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../constants/Theme';
import { Button, TextInput } from 'react-native-paper';
import { storageService } from '../../services/storageService';
import { Toaster } from '../../components/toast';
import { isValidEmail } from '../../utils/validators';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../reduxStore/slices/apiSlice';
import { setUserCredentials } from '../../reduxStore/slices/authSlice';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [errors, setError] = useState<FormErrors>({});
  const [login, { data, isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();

  const validateForm = () => {
    let err: FormErrors = {};

    if (!email) err.email = 'Email is required.';
    if (!password) err.password = 'Password is required.';
    if (email && !isValidEmail(email)) {
      err.email = 'Email is not valid';
    }

    setError(err);

    return Object.keys(err).length === 0;
  };

  const handleFormSubmit = async () => {
    if (validateForm()) {
      await login({ email, password });
    } else {
      console.log(errors);
    }
  };

  React.useEffect(() => {
    if (data) {
      console.log('Login successful:', data);
      setEmail('');
      setPassword('');
      setError({});
      const user = (data as any).data;
      console.log('User:', user);
      storageService.setCredentials(
        JSON.stringify(user),
        (data as any).data?.token,
        'edurentify_user',
      );
      dispatch(
        setUserCredentials({ user: data, token: (data as any).data?.token }),
      );
      Toaster.toastSuccess((data as any)?.message);
    }
  }, [data]);

  React.useEffect(() => {
    if (error) {
      console.log('Login error:', error);
      Toaster.toastError(
        (error as any).data?.message
          ? (error as any).data?.message
          : 'Network disconnected!',
      );
    }
  }, [error]);

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
            disabled={isLoading}
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
            disabled={isLoading}
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
                  Logging in...
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
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              labelStyle={styles.buttonText}
            >
              Login
            </Button>
          )}

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
