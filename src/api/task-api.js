import { api } from "./index";
import { format, add, sub, isEqual } from "date-fns";

const taskApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTodaysTasks: builder.query({
      query: ({ date }) => {
        console.log("WHAT IS DATE: ", date);
        return `/task?date=${date}`;
      },
      providesTags: ["Tasks"],
    }),
    toggleTask: builder.mutation({
      invalidatesTags: ["Tasks"],
      query: ({ id, completed }) => {
        return {
          url: `/task/${id}`,
          method: "PATCH",
          body: { completed },
        };
      },
      async onQueryStarted({ id, completed }, { dispatch, queryFulfilled }) {
        const date = format(new Date(), "yyyy-MM-dd");
        const optimisticUpdate = dispatch(
          api.util.updateQueryData("getTodaysTasks", { date }, (draft) => {
            const optimisticTodo = draft.find((todo) => todo.id === id);
            optimisticTodo.completed = completed;
            return draft;
          })
        );
        try {
          await queryFulfilled;
        } catch (e) {
          optimisticUpdate.undo();
          console.log(e);
        }
      },
    }),
    toggleTaskFocus: builder.mutation({
      invalidatesTags: ["Tasks"],
      query: ({ id, focus }) => {
        console.log("WHAT IS THIS: ", focus);
        return {
          url: `/task/${id}`,
          method: "PATCH",
          body: { focus },
        };
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
  useToggleTaskFocusMutation,
} = taskApi;
