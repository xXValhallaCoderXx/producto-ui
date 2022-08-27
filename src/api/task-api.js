import { api } from "./index";

const taskApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTodaysTasks: builder.query({
      query: ({ date }) => {
        return `/task?date=${date}`;
      },
      providesTags: (result, error, arg) => {
        return result
          ? [...result.map(() => ({ type: "Tasks", id: arg.date })), "Tasks"]
          : ["Tasks"];
      },
    }),
    toggleTask: builder.mutation({
      invalidatesTags: ["Tasks"],
      query: ({ id, completed, date }) => {
        return {
          url: `/task/${id}`,
          method: "PATCH",
          body: { completed },
        };
      },
      async onQueryStarted(
        { id, completed, date },
        { dispatch, queryFulfilled }
      ) {
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
      query: ({ id, focus, date }) => {
        return {
          url: `/task/${id}`,
          method: "PATCH",
          body: { focus },
        };
      },
      async onQueryStarted({ id, focus, date }, { dispatch, queryFulfilled }) {
        const optimisticUpdate = dispatch(
          api.util.updateQueryData("getTodaysTasks", { date }, (draft) => {
            const optimisticTodo = draft.find((todo) => todo.id === id);
            optimisticTodo.focus = focus;
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
    createTask: builder.mutation({
      invalidatesTags: ["Tasks"],
      query: ({ title, deadline }) => {
        console.log("TITLE: ", title);
        console.log("DEADLINE: ", deadline);
        return {
          url: `/task`,
          method: "POST",
          body: { title, deadline },
        };
      },
    }),
    moveIncompleteTasks: builder.mutation({
      invalidatesTags: ["Tasks"],
      query: ({ date }) => ({
        url: `/task/move-incomplete`,
        method: "POST",
        body: { date },
      }),
    }),
  }),
});

export const {
  useGetTodaysTasksQuery,
  useToggleTaskMutation,
  useCreateTaskMutation,
  useToggleTaskFocusMutation,
  useMoveIncompleteTasksMutation,
} = taskApi;
