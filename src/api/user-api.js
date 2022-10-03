import { api } from "./index";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => {
        return `/user/profile`;
      },
      providesTags: ["User"],
    }),
    updatePrefs: builder.mutation({
      invalidatesTags: ["User"],
      query: ({ ...prefs }) => {
        return {
          url: `/user/update-prefs`,
          method: "PATCH",
          body: { ...prefs },
        };
      },
    }),
    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => {
        return {
          url: `/user/update-password`,
          method: "PATCH",
          body: { oldPassword, newPassword },
        };
      },
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdatePrefsMutation,
  useUpdatePasswordMutation,
} = userApi;
