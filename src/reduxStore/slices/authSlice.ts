import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedin: false,
  user: null,
  isAuthLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isLoggedin = true;
      state.user = action.payload;
      state.isAuthLoading = false;
    },
    logoutSuccess(state) {
      state.isLoggedin = false;
      state.user = null;
    },
    isAuthChecked(state) {
      state.isAuthLoading = false;
    },
  },
});

export const { loginSuccess, logoutSuccess, isAuthChecked } = authSlice.actions;
export default authSlice.reducer;
