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
import { useResetPasswordMutation } from '../../reduxStore/slices/apiSlice';

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

export default function ResetPasswordScreen({ navigation, route }: any) {
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  const [errors, setError] = useState<FormErrors>({});
  const { email } = route.params;
  const { otp } = route.params;
  const [resetPassword, { data, isLoading, error }] =
    useResetPasswordMutation();

  const validateForm = () => {
    let err: FormErrors = {};

    if (!password) err.password = 'Password is required.';
    if (!password_confirmation)
      err.confirmPassword = 'Confirm password is required.';
    if (password && password_confirmation && password !== password_confirmation)
      err.confirmPassword = 'Passwords do not match.';

    setError(err);

    return Object.keys(err).length === 0;
  };

  const handleFormSubmit = async () => {
    if (validateForm()) {
      await resetPassword({ email, password, password_confirmation, otp: otp });
    } else {
      console.log(errors);
    }
  };

  React.useEffect(() => {
    if (data) {
      console.log('Password reset successful', data);
      setPassword('');
      setPasswordConfirmation('');
      setError({});
      Toaster.toastSuccess((data as any)?.message);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
    if (error) {
      console.log('Password reset error:', error);
      Toaster.toastError(
        (error as any).data?.message
          ? (error as any).data?.message
          : 'Network disconnected!',
      );
    }
  }, [data, error]);

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

          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Your new password must be different from your previously used
            password.
          </Text>

          <TextInput
            style={styles.input}
            label="New Password*"
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
            label="Confirm New Password*"
            mode="outlined"
            value={password_confirmation}
            onChangeText={setPasswordConfirmation}
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
                  Updating password...
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
              Update Password
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
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderColor: COLORS.text,
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
