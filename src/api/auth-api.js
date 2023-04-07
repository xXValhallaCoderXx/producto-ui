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
      query: ({ email, password, timezone }) => ({
        url: "/auth/register",
        method: "POST",
        body: { email, password, timezone },
      }),
    }),
    verifyEmail: builder.query({
      query: ({ email }) => {
        return {
          url: `/auth/verify-email?email=${email}`,
          method: "GET",
        };
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
    updateEmail: builder.mutation({
      query: ({ password, email }) => {
        return {
          url: `/user/update-email`,
          method: "PATCH",
          body: { password, email },
        };
      },
      invalidatesTags: ["User"],
    }),
    requestOtp: builder.mutation({
      query: ({ email }) => {
        return {
          url: `/auth/otp-request`,
          method: "POST",
          body: { email },
        };
      },
    }),
    verifyOtp: builder.mutation({
      query: ({ email, code }) => {
        return {
          url: `/auth/otp-verify`,
          method: "POST",
          body: { email, code },
        };
      },
    }),
    forgotPasswordUpdate: builder.mutation({
      query: ({ newPassword }) => {
        return {
          url: `/auth/forgot-password-update`,
          method: "POST",
          body: { newPassword },
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLazyVerifyEmailQuery,
  useLazyRefreshTokenQuery,
  useUpdateEmailMutation,
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useForgotPasswordUpdateMutation,
} = authApi;
