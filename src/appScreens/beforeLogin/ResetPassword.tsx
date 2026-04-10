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

export default function ResetPasswordScreen({ navigation }: any) {
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
        // dispatch(loginSuccess(user));
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

          {/* New Password */}
          <TextInput
            style={styles.input}
            label="New Password"
            mode="outlined"
            // value={newPassword}
            // onChangeText={setNewPassword}
            // secureTextEntry={secureNewText}
            // right={
            //   <TextInput.Icon
            //     icon={secureNewText ? 'eye-off' : 'eye'}
            //     onPress={() => setSecureNewText(!secureNewText)}
            //   />
            // }
          />
          {/* {errors.newPassword ? (
            <View style={styles.errContainer}>
              <Text style={styles.errorMsg}>{errors.newPassword}</Text>
            </View>
          ) : null} */}

          {/* Confirm New Password */}
          <TextInput
            style={styles.input}
            label="Confirm New Password"
            mode="outlined"
            // value={confirmNewPassword}
            // onChangeText={setConfirmNewPassword}
            // secureTextEntry={secureConfirmText}
            // right={
            //   <TextInput.Icon
            //     icon={secureConfirmText ? 'eye-off' : 'eye'}
            //     onPress={() => setSecureConfirmText(!secureConfirmText)}
            //   />
            // }
          />
          {/* {errors.confirmNewPassword ? (
            <View style={styles.errContainer}>
              <Text style={styles.errorMsg}>{errors.confirmNewPassword}</Text>
            </View>
          ) : null} */}

          <Button
            mode="contained"
            // onPress={() => handleResetPassword()}
            onPress={() =>
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
            }
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
            {loading ? 'Submitting...' : 'Submit'}
          </Button>

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
