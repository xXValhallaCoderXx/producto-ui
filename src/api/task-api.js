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
    getIncompleteTasks: builder.query({
      query: () => {
        return `/task/incomplete`;
      },
      providesTags: ["Tasks"],
    }),
    moveSpecificTasks: builder.mutation({
      invalidatesTags: ["Tasks"],
      query: ({ tasks }) => {
        return {
          url: `/task/move-specfic`,
          method: "POST",
          body: { tasks },
        };
      },
    }),
    getIncompleteDetailTasks: builder.query({
      query: () => {
        return `/task/incomplete-detail`;
      },
      providesTags: ["Tasks"],
    }),
    toggleTask: builder.mutation({
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
        }
      },
    }),
    toggleTaskFocus: builder.mutation({
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
        }
      },
    }),
    updateTask: builder.mutation({
      query: ({ id, title, date }) => {
        return {
          url: `/task/${id}`,
          method: "PATCH",
          body: { title },
        };
      },
      async onQueryStarted({ id, title, date }, { dispatch, queryFulfilled }) {
        const optimisticUpdate = dispatch(
          api.util.updateQueryData("getTodaysTasks", { date }, (draft) => {
            const optimisticTodo = draft.find((todo) => todo.id === id);
            optimisticTodo.title = title;
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
    createTask: builder.mutation({
      invalidatesTags: ["Tasks"],
      query: ({ title, deadline }) => {
        return {
          url: `/task`,
          method: "POST",
          body: { title, deadline },
        };
      },
      // async onQueryStarted({ title, deadline, date }, { dispatch, queryFulfilled }) {
      //   const optimisticUpdate = dispatch(
      //     api.util.updateQueryData("getTodaysTasks", { date }, (draft) => {
      //       const optimisticTodo = draft.find((todo) => todo.id === id);
      //       optimisticTodo.title = title;
      //       draft.push(optimisticTodo)
      //       return draft;
      //     })
      //   );
      //   try {
      //     await queryFulfilled;
      //   } catch (e) {
      //     optimisticUpdate.undo();
      //     console.log(e);
      //   }
      // },
    }),
    moveIncompleteTasks: builder.mutation({
      invalidatesTags: ["Tasks"],
      query: ({ from, to }) => ({
        url: `/task/move-incomplete`,
        method: "POST",
        body: { from, to },
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
  useGetIncompleteTasksQuery,
  useUpdateTaskMutation,
  useGetIncompleteDetailTasksQuery,
  useMoveSpecificTasksMutation
} = taskApi;
