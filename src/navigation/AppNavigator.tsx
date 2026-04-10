import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../appScreens/afterLogin/Home';
import { IconButton } from 'react-native-paper';
import { AlertComp } from '../components/alert';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../reduxStore/slices/authSlice';
import { storageService } from '../services/storageService';

export type AppStackParamList = {
  Home: undefined;
  PokemonDetails: { url: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    console.log('executed');
    storageService.deleteCredentials('loggedUser');
    dispatch(logoutSuccess());
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={() => ({
          title: 'Pokemons',
          headerBackButtonDisplayMode: 'minimal',
          headerRight: () => (
            <IconButton
              icon="logout"
              onPress={() => AlertComp.logoutAlert({ onConfirm: handleLogout })}
            />
          ),
        })}
      />
      {/* <Stack.Screen
        name="PokemonDetails"
        component={PokemonDetails}
        options={{
          title: 'Pokemon Details',
          headerBackButtonDisplayMode: 'minimal',
        }}
      /> */}
    </Stack.Navigator>
  );
}
