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
  }),
});

export const { useGetProfileQuery, useUpdatePrefsMutation } = userApi;
