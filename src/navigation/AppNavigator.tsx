import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddItems from '../appScreens/afterLogin/addItems';
import Home from '../appScreens/afterLogin/Home';
import ItemDetails from '../appScreens/afterLogin/itemDetails';

export type AppStackParamList = {
  Home: undefined;
  ItemDetails: undefined;
  AddItems: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ItemDetails" component={ItemDetails} />
      <Stack.Screen name="AddItems" component={AddItems} />
    </Stack.Navigator>
  );
}
