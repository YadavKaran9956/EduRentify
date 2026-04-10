import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../appScreens/beforeLogin/Login';
import SignupScreen from '../appScreens/beforeLogin/Signup';
import ForgotPasswordScreen from '../appScreens/beforeLogin/ForgotPassword';
import VerifyOtpScreen from '../appScreens/beforeLogin/VerifyOtp';
import ResetPasswordScreen from '../appScreens/beforeLogin/ResetPassword';
import Home from '../appScreens/afterLogin/Home';
import ItemDetails from '../appScreens/afterLogin/itemDetails';
import AddItems from '../appScreens/afterLogin/addItems';

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
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ItemDetails" component={ItemDetails} />
      <Stack.Screen name="AddItems" component={AddItems} />
    </Stack.Navigator>
  );
}
