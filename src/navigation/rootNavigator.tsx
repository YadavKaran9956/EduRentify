import { useSelector, useDispatch } from 'react-redux';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { storageService } from '../services/storageService';
import { isAuthChecked, loginSuccess } from '../reduxStore/slices/authSlice';
import { useEffect } from 'react';

export default function RootNavigator() {
  const { isLoggedin, isAuthLoading } = useSelector((state: any) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrapAuth = async () => {
      const user = await storageService.getCredentials('loggedUser');
      if (user) {
        dispatch(loginSuccess(user));
      } else {
        dispatch(isAuthChecked());
      }
    };

    bootstrapAuth();
  }, []);
  console.log('isAuthLoading', isAuthLoading);
  if (isAuthLoading) return null;
  return isLoggedin ? <AppNavigator /> : <AuthNavigator />;
}
