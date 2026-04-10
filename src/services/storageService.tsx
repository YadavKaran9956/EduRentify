import * as Keychain from 'react-native-keychain';

export const storageService = {
  setCredentials: async (email: string, password: string, token: string) => {
    await Keychain.setGenericPassword(email, password, {
      service: token,
    });
    return 'Data stored successfully!';
  },

  getCredentials: async (token: string) => {
    try {
      const storageData = await Keychain.getGenericPassword({
        service: token,
      });

      if (storageData) {
        console.log('loggedUser==>', storageData);
        return storageData;
      } else {
        console.log('loggedUser creds not found!');
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  deleteCredentials: async (token: string) => {
    await Keychain.resetGenericPassword({ service: token });
  },
};
