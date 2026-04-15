import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { storageService } from '../services/storageService';
import { setUserCredentials } from '../reduxStore/slices/authSlice';

export default function RootNavigator() {
  const token = useSelector((state: any) => state.auth.token);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const userCreds = await storageService.getCredentials(
          'edurentify_user',
        );
        console.log('Retrieved userCreds:', userCreds);

        if (userCreds) {
          const user = JSON.parse((userCreds as any).username);
          const token = (userCreds as any).password;
          dispatch(setUserCredentials({ user: user, token: token }));
        } else {
          console.log('No user credentials found');
          dispatch(setUserCredentials({ user: null, token: null }));
        }
      } catch (error) {
        console.error('Auth bootstrap error:', error);
        dispatch(setUserCredentials({ user: null, token: null }));
      } finally {
        setIsAuthLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  if (isAuthLoading) return null;

  console.log('Final token state:', token);
  return token ? <AppNavigator /> : <AuthNavigator />;
}
