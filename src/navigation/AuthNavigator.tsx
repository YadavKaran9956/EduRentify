import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../appScreens/authScreens/Login';
import SignupScreen from '../appScreens/authScreens/Signup';
import ForgotPasswordScreen from '../appScreens/authScreens/ForgotPassword';
import VerifyOtpScreen from '../appScreens/authScreens/VerifyOtp';
import ResetPasswordScreen from '../appScreens/authScreens/ResetPassword';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  VerifyOtp: undefined;
  ResetPassword: undefined;
  Home: undefined;
  ItemDetails: undefined;
  AddItems: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
