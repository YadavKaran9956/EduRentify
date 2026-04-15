import Toast from 'react-native-toast-message';

export const Toaster = {
  toastSuccess: (msg: string) => {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: msg,
      position: 'bottom',
      visibilityTime: 3000,
    });
  },

  toastError: (msg: string) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: msg,
      position: 'bottom',
      visibilityTime: 4000,
    });
  },

  toastInfo: (msg: string) => {
    Toast.show({
      type: 'info',
      text1: 'Info',
      text2: msg,
      position: 'bottom',
      visibilityTime: 3000,
    });
  },
};
