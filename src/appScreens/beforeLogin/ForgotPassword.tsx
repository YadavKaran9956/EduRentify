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
import { Toaster } from '../../components/toast';
import { isValidEmail } from '../../utils/validators';
import { useForgotPasswordMutation } from '../../reduxStore/slices/apiSlice';

interface FormErrors {
  email?: string;
}

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [errors, setError] = useState<FormErrors>({});
  const [forgotPassword, { data, isLoading, error }] =
    useForgotPasswordMutation();

  const validateForm = () => {
    let err: FormErrors = {};

    if (!email) err.email = 'Email is required.';
    if (email && !isValidEmail(email)) {
      err.email = 'Email is not valid';
    }

    setError(err);

    return Object.keys(err).length === 0;
  };

  const handleFormSubmit = async () => {
    if (validateForm()) {
      await forgotPassword({ email });
    } else {
      console.log(errors);
    }
  };

  React.useEffect(() => {
    if (data) {
      console.log('Forgot password successful:', data);
      setEmail('');
      setError({});
      Toaster.toastSuccess((data as any)?.message);
      navigation.navigate('VerifyOtp', { email });
    }
  }, [data]);

  React.useEffect(() => {
    if (error) {
      console.log('Forgot password error:', error);
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

          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your registered email address and we'll send you an OTP to
            reset your password.
          </Text>

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
                  Sending email...
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
              Send Email
            </Button>
          )}

          <View style={styles.loginInfoContainer}>
            <Text style={styles.memberText}>Remembered your password?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginInfoText}> Login</Text>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
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
  errContainer: {
    width: '100%',
    marginBottom: 10,
  },
  errorMsg: {
    color: COLORS.danger,
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
