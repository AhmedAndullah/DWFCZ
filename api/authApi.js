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
  tagTypes: ['ToolboxTalks', 'Projects', 'Employee'], // Adding Projects tag

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
    }),

    getUserProfile  : builder.query({
      query: () => '/users/profile/',
    }),

    // Endpoint for fetching toolbox talks
    getToolboxTalk: builder.query({
      query: () => '/toolbox-talks/',
      providesTags: ['ToolboxTalks'],
    }),

    getDocuments: builder.query({
      query: () => `/documents/`,
      // providesTags: ['Documents'],
    }),

    // Endpoint for fetching projects
    getProjects: builder.query({
      query: () => '/projects/',
      providesTags: ['Projects'],
    }),

    // Endpoint for fetching employees
    getEmployee: builder.query({
      query: () => '/users/employees/',
      providesTags: ['Employee'],
    }),

    

    // Endpoint for updating SDS search
    getSdsSearch: builder.query({
      query: () => '/sds_searches/',
    }),

    getDepartments: builder.query({
      query: () => '/departments/',
    }),

    getEquipment: builder.query({
      query: () => '/equipment/',
    }),

    getLessons: builder.query({
      query: () => '/lessons/',
    }),

    getForms: builder.query({
      query: () => '/forms/',
    }),

    getLessonsProgress: builder.query({
      query: (id) => `/lessons/${id}/progress/`,
    }),

    getFormsProgress: builder.query({
      query: (id) => `/forms/${id}/`,
    }),

    getDivisionById: builder.query({
      query: (id) => `/companies/${id}/`,
    }),

    getCompanies: builder.query({
      query: () => '/companies/',
    }),

    getFormAssignments: builder.query({
      query: () => '/form-assignments/',
    }),
    getFormAssignmentsDetail: builder.query({
      query: (id) => `/form-assignment/${id}/`,
    }),


    // Endpoint for conducting toolbox talks
    conductToolboxTalk: builder.mutation({
      query: (formData) => ({
        url: '/conducted_toolbox_talks/', // Note the corrected endpoint path
        method: 'POST',
        body: formData,
      }),
    }),

    submitFormResponse: builder.mutation({
      query: (formData) => ({
        url: '/submit-form-response/',
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    getAnnouncements: builder.query({
      query: () => '/announcements/',
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
  useGetEmployeeQuery,
  useConductToolboxTalkMutation, 
  useGetAnnouncementsQuery,
  useGetDocumentsQuery,
  useGetEquipmentQuery,
  useGetUserProfileQuery,
  useGetLessonsQuery,
  useGetLessonsProgressQuery,
  useGetFormsQuery,
  useGetFormsProgressQuery,
  useGetCompaniesQuery,
  useGetDivisionByIdQuery,
  useGetDepartmentsQuery,
  useSubmitFormResponseMutation,
  useGetFormAssignmentsQuery,
  useGetFormAssignmentsDetailQuery,

} = authApi;
