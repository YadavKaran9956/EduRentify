import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'edurentifyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.190:8000/api',
    prepareHeaders: (headers: any, { getState }: any) => {
      const token = getState().auth.token;
      console.log('apiSlice token:', token);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Products'],
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
    resetPassword: builder.mutation({
      query: (data: any) => ({
        url: '/resetPassword',
        method: 'POST',
        body: data,
      }),
    }),
    updateProfile: builder.mutation({
      query: (data: any) => ({
        url: '/updateProfile',
        method: 'POST',
        body: data,
      }),
    }),
    createProduct: builder.mutation({
      query: (data: any) => ({
        url: '/createProduct',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    getProducts: builder.query({
      query: () => ({
        url: '/getProducts',
        method: 'GET',
      }),
      providesTags: ['Products'],
    }),
    getProduct: builder.query({
      query: (id: string) => ({
        url: `/getProduct/${id}`,
        method: 'GET',
      }),
      providesTags: ['Products'],
    }),
    getMyProducts: builder.query({
      query: () => ({
        url: '/getMyProducts',
        method: 'GET',
      }),
      providesTags: ['Products'],
    }),
    getMyBookings: builder.query({
      query: () => ({
        url: '/getMyBookings',
        method: 'GET',
      }),
    }),
    bookProduct: builder.mutation({
      query: (data: any) => ({
        url: '/bookProduct',
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id: string) => ({
        url: `/deleteProduct/${id}`,
        method: 'DELETE',
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
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useCreateProductMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useGetMyProductsQuery,
  useGetMyBookingsQuery,
  useBookProductMutation,
  useDeleteProductMutation,
} = apiSlice;
