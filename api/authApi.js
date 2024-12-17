import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi', // Unique key for the API reducer
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://app.dfwcz.com/api', // Base API URL is defined here
    prepareHeaders: async (headers) => {
      try {
        const token = await AsyncStorage.getItem('authToken'); // Retrieve token from storage
        if (token) {
          headers.set('Authorization', `Bearer ${token}`); // Add Authorization header
        }
      } catch (err) {
        console.error('Error retrieving token from AsyncStorage:', err);
      }
      return headers;
    },
  }),
  tagTypes: ['ToolboxTalks', 'Projects' , 'Employee'], // Adding Projects tag

  endpoints: (builder) => ({
    // Endpoint for user login
    login: builder.mutation({
      query: (credentials) => ({
        url: '/users/login/',
        method: 'POST',
        body: credentials,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            await AsyncStorage.setItem('authToken', data.token); // Save the token
          } else {
            console.error('No token found in response data:', data);
          }
        } catch (err) {
          console.error('Error storing token during login:', err);
        }
      },
    }),

    // Endpoint for user registration
    register: builder.mutation({
      query: (userData) => {
        const formData = new FormData();
        Object.keys(userData).forEach((key) => {
          formData.append(key, userData[key]);
        });
        return {
          url: '/users/register/',
          method: 'POST',
          body: formData,
        };
      },
    }),

    // Endpoint for fetching all companies
    getAllCompanies: builder.query({
      query: () => '/company/all_companies/',
      // providesTags: (result) =>
      //   result?.map(({ id }) => ({ type: 'Companies', id })) || [],
    }),

    // Endpoint for fetching toolbox talks
    getToolboxTalk: builder.query({
      query: () => '/toolbox-talks/',
      providesTags: ['ToolboxTalks'],
    }),



    getProjects: builder.query({
      query: () => '/projects/', // Endpoint to fetch projects
      providesTags: ['Projects'], // Tag the response to use in invalidations
    }),

    getEmployee: builder.query({
      query: () => '/users/employees/', // Endpoint to fetch projects
      providesTags: ['Employee'], // Tag the response to use in invalidations
    }),


    // Endpoint for updating SDS search
    getSdsSearch: builder.query({
      query: () => '/sds_searches/',
      
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetAllCompaniesQuery,
  useGetToolboxTalkQuery,
  useGetSdsSearchQuery,
  useGetProjectsQuery,
  useGetEmployeeQuery, // Exporting this hook to fetch project data

} = authApi;
