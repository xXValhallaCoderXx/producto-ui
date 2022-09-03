import { api } from "./index";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: { email, password },
        };
      },
    }),
    register: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/register",
        method: "POST",
        body: { email, password },
      }),
    }),
    verifyEmail: builder.query({
      query: ({ email }) => {
        return `/auth/verify-email?email=${email}`;
      },
    }),
    userProfile: builder.query({
      query: ({ email }) => {
        return `/auth/profile`;
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLazyVerifyEmailQuery,
  useUserProfileQuery,
} = authApi;
