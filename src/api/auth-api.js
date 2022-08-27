import { api } from "./index";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => {
        console.log("EMAIL: ", email);
        console.log("PASSWORD", password);
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
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
