import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddItems from '../appScreens/mainScreens/AddItems';
import BookItem from '../appScreens/mainScreens/BookItem';
import EditProfile from '../appScreens/mainScreens/EditProfile';
import Home from '../appScreens/mainScreens/Home';
import ItemDetails from '../appScreens/mainScreens/ItemDetails';
import MyListings from '../appScreens/mainScreens/MyListings';
import MyProfile from '../appScreens/mainScreens/MyProfile';
import MyRentals from '../appScreens/mainScreens/MyRentals';

export type AppStackParamList = {
  Home: undefined;
  ItemDetails: { productId: string };
  AddItems: undefined;
  BookItem: { productId: string };
  MyListings: undefined;
  MyProfile: undefined;
  EditProfile: undefined;
  MyRentals: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ItemDetails"
        component={ItemDetails}
        options={{
          title: 'Item Details',
        }}
      />
      <Stack.Screen
        name="AddItems"
        component={AddItems}
        options={{
          title: 'Add Item',
        }}
      />
      <Stack.Screen
        name="BookItem"
        component={BookItem}
        options={{
          title: 'Book Item',
        }}
      />
      <Stack.Screen
        name="MyListings"
        component={MyListings}
        options={{
          title: 'My Listings',
        }}
      />
      <Stack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{
          title: 'My Profile',
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          title: 'Edit Profile',
        }}
      />
      <Stack.Screen
        name="MyRentals"
        component={MyRentals}
        options={{
          title: 'My Rentals',
        }}
      />
    </Stack.Navigator>
  );
}
