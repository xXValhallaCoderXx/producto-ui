import { api } from "./index";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => {
        return `/user/profile`;
      },
      providesTags: ["User"],
    }),
    deleteAccount: builder.query({
      query: () => {
        return {
          url: "/user/delete-account",
          method: "GET",
        };
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
      async onQueryStarted({ ...prefs }, { dispatch, queryFulfilled }) {
        const optimisticUpdate = dispatch(
          api.util.updateQueryData("getProfile", {}, (draft) => {
            draft.prefs.autoMove = !draft.prefs.autoMove;
            return draft;
          })
        );
        try {
          await queryFulfilled;
        } catch (e) {
          optimisticUpdate.undo();
        }
      },
    }),
    updatePassword: builder.mutation({
      query: ({ currentPassword, newPassword }) => {
        return {
          url: `/user/update-password`,
          method: "PATCH",
          body: { currentPassword, newPassword },
        };
      },
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdatePrefsMutation,
  useUpdatePasswordMutation,
  useLazyDeleteAccountQuery,
} = userApi;
