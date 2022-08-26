import { api } from "./index";

const taskApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTodaysTasks: builder.query({
      query: (date) => `/task?date=${date}`,
      providesTags: ["Tasks"],
    }),
    toggleTask: builder.mutation({
      invalidatesTags: ["Tasks"],
      query: (id, completed) => ({
        url: `/task/${id}`,
        method: "POST",
        body: { completed },
      }),
    }),
  }),
});

export const { useGetTodaysTasksQuery, useToggleTaskMutation } = taskApi;
