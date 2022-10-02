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
    refreshToken: builder.query({
      query: ({ refreshToken }) => {
        return {
          url: "/auth/refresh-jwt",
          method: "GET",
          headers: {
            authorization: refreshToken,
          },
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLazyVerifyEmailQuery,
  useLazyRefreshTokenQuery
} = authApi;
