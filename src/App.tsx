import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/rootNavigator';
import { Provider } from 'react-redux';
import { store } from './reduxStore/store';
import { enableScreens } from 'react-native-screens';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
enableScreens();

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <Toast />
        </SafeAreaProvider>
      </PaperProvider>
    </Provider>
  );
}
