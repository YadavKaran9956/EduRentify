import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS } from '../../constants/Theme';
import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
} from '../../reduxStore/slices/apiSlice';
import { Toaster } from '../../components/toast';

const OTP_LENGTH = 6;

export default function VerifyOtpScreen({ navigation, route }: any) {
  const { email } = route.params;
  const [verifyOtp, { data, isLoading, error }] = useVerifyOtpMutation();
  const [
    forgotPassword,
    {
      data: forgotPasswordData,
      isLoading: forgotPasswordLoading,
      error: forgotPasswordError,
    },
  ] = useForgotPasswordMutation();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (value: any, index: number) => {
    if (!/^\d*$/.test(value)) return; // allow digits only

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < OTP_LENGTH) {
      Toaster.toastError('Please enter a 6 digit OTP');
      return;
    } else {
      await verifyOtp({ email, otp: enteredOtp });
    }
  };

  const handleKeyPress = ({ nativeEvent }: any, index: number) => {
    if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resendOtp = async () => {
    await forgotPassword({ email });
    Toaster.toastSuccess('OTP resent successfully');
  };

  React.useEffect(() => {
    if (data) {
      console.log('OTP verified successfully:', data);
      navigation.navigate('ResetPassword', { email });
    }
    if (error) {
      console.log('OTP verification failed:', error);
      Toaster.toastError(
        (error as any)?.data?.message ||
          'OTP verification failed. Please try again.',
      );
    }
  }, [data, error]);

  React.useEffect(() => {
    if (forgotPasswordData) {
      console.log('OTP resent successfully:', forgotPasswordData);
      Toaster.toastSuccess('OTP resent successfully');
    }
    if (forgotPasswordError) {
      console.log('OTP resend failed:', forgotPasswordError);
      Toaster.toastError(
        (forgotPasswordError as any)?.data?.message ||
          'OTP resend failed. Please try again.',
      );
    }
  }, [forgotPasswordData, forgotPasswordError]);

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

          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to your registered email address.
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => {
                  inputRefs.current[index] = ref;
                }}
                style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                value={digit}
                onChangeText={value => handleChange(value, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                textContentType="oneTimeCode"
                selectTextOnFocus
                editable={!isLoading}
              />
            ))}
          </View>

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
                  Verifying...
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <Button
              mode="contained"
              onPress={() => handleVerifyOtp()}
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
              Verify
            </Button>
          )}

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <TouchableOpacity
              onPress={() => {
                resendOtp();
              }}
            >
              <Text style={styles.resendLink}> Resend OTP</Text>
            </TouchableOpacity>
          </View>

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
    marginBottom: 35,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 35,
    gap: 10,
  },
  otpInput: {
    flex: 1,
    height: 55,
    borderWidth: 1.5,
    borderColor: COLORS.text,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    backgroundColor: '#fff',
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10', // subtle tint when filled
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.text,
  },
  resendLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  loginInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
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
