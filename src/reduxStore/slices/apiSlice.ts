import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'edurentifyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.29.164:8000/api',
    prepareHeaders: (headers: any, { getState }: any) => {
      const token = getState().auth.token;
      console.log('apiSlice token:', token);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder: any) => ({
    register: builder.mutation({
      query: (data: any) => ({
        url: '/register',
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data: any) => ({
        url: '/login',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data: any) => ({
        url: '/forgotPassword',
        method: 'POST',
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data: any) => ({
        url: '/verifyOtp',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
} = apiSlice;
