import { api } from "./index";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ data }) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      providesTags: ["Auth"]
    }),
    register: builder.mutation({
        query: (email,password) => ({
          url: "/auth/register",
          method: "POST",
          body: {email, password}
        }),
        providesTags: ["Auth"]
      })
  })
});

export const { useLoginMutation, useRegisterMutation } = authApi;
