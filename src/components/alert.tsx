import { Alert } from 'react-native';

export const AlertComp = {
  logoutAlert: ({ onConfirm }: any) => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => onConfirm(),
      },
    ]);
  },
};
