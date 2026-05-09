import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/rootNavigator';
import { Provider } from 'react-redux';
import { store } from './reduxStore/store';
import { enableScreens } from 'react-native-screens';
import { PaperProvider } from 'react-native-paper';
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';
enableScreens();

const toastConfig = {
  success: (props: any) => <BaseToast {...props} text2NumberOfLines={0} />,
  error: (props: any) => <ErrorToast {...props} text2NumberOfLines={0} />,
  info: (props: any) => <InfoToast {...props} text2NumberOfLines={0} />,
};

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </PaperProvider>
    </Provider>
  );
}
