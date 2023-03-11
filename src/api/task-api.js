import { api } from "./index";

const taskApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTodaysTasks: builder.query({
      query: ({ date }) => {
        return `/task?date=${date}`;
      },
      providesTags: (result, error, arg) => [{ type: "Tasks", id: arg.date }],
      keepUnusedDataFor: 0,
    }),

    createTask: builder.mutation({
      invalidatesTags: ["IncompleteTasks"],
      query: ({ title, deadline, date }) => {
        return {
          url: `/task`,
          method: "POST",
          body: { title, deadline },
        };
      },
      async onQueryStarted(
        { title, deadline, date },
        { dispatch, queryFulfilled }
      ) {
        const optimisticUpdate = dispatch(
          api.util.updateQueryData("getTodaysTasks", { date }, (draft) => {
            console.log("DRAFT: ", draft);
            console.log("WHAT IS DATE: ", date);
            draft.push({
              completed: false,
              focus: false,
              id: Math.floor(Math.random() * 100),
              createdAt: deadline,
              deadline,
              title,
            });
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
      invalidatesTags: ["IncompleteTasks"],
    }),
    moveSpecificTasks: builder.mutation({
      invalidatesTags: ["Tasks", "IncompleteTasks"],
      query: ({ tasks, to }) => {
        return {
          url: `/task/move-specific`,
          method: "POST",
          body: { tasks, to },
        };
      },
    }),

    // WORKING ON CLEANUP
    getIncompleteTasks: builder.query({
      query: () => {
        return `/task/incomplete`;
      },
      providesTags: ["IncompleteTasks"],
    }),

    getIncompleteDetailTasks: builder.query({
      query: () => {
        return `/task/incomplete-detail`;
      },
      providesTags: ["IncompleteTasks"],
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
            const task = draft.find((todo) => todo.id === id);
            task.title = title;
            return draft;
          })
        );
        try {
          await queryFulfilled;
        } catch (e) {
          // optimisticUpdate.undo();
          dispatch(api.util.invalidateTags(["Tasks"]));
        }
      },
    }),

    // moveIncompleteTasks: builder.mutation({
    //   invalidatesTags: ["Tasks", "IncompleteTasks"],
    //   query: ({ from, to }) => ({
    //     url: `/task/move-incomplete`,
    //     method: "POST",
    //     body: { from, to },
    //   }),
    // }),
    deleteTask: builder.mutation({
      invalidatesTags: ["Tasks", "IncompleteTasks"],
      query: ({ id }) => {
        return {
          url: `/task/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetTodaysTasksQuery,
  useToggleTaskMutation,
  useCreateTaskMutation,
  useToggleTaskFocusMutation,
  // useMoveIncompleteTasksMutation,
  useGetIncompleteTasksQuery,
  useUpdateTaskMutation,
  useGetIncompleteDetailTasksQuery,
  useMoveSpecificTasksMutation,
  useDeleteTaskMutation,
} = taskApi;
