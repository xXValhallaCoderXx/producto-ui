import { api } from "./index";

const taskApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTodaysTasks: builder.query({
      query: (date) => `/task?date=${date}`,
      providesTags: ["Tasks"],
    }),
    toggleTask: builder.mutation({
      invalidatesTags: ["Tasks"],
      query: ({ id, completed }) => {
        return ({
          url: `/task/${id}`,
          method: "PATCH",
          body: { completed },
        })
      },
    }),
    toggleTaskFocus: builder.mutation({
      invalidatesTags: ["Tasks"],
      query: ({ id, focus }) => {
        console.log("WHAT IS THIS: ", focus)
        return ({
          url: `/task/${id}`,
          method: "PATCH",
          body: { focus },
        })
      },
    }),
    createTask: builder.mutation({
      invalidatesTags: ["Tasks"],
      query: ({ title }) => ({
        url: `/task`,
        method: "POST",
        body: { title },
      }),
    }),
  }),
});

export const {
  useGetTodaysTasksQuery,
  useToggleTaskMutation,
  useCreateTaskMutation,
  useToggleTaskFocusMutation
} = taskApi;
