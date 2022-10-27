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
      providesTags: ["IncompleteTasks"],
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
    getIncompleteDetailTasks: builder.query({
      query: () => {
        return `/task/incomplete-detail`;
      },
      providesTags: ["IncompleteTasks"],
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
      invalidatesTags: ["IncompleteTasks"]
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
            const task = draft.find((todo) => todo.id === id);
            task.title = title;
            return draft;
          })
        );
        try {
          await queryFulfilled;
        } catch (e) {
          // optimisticUpdate.undo();
          dispatch(api.util.invalidateTags(['Tasks']))
        }
      },
    }),
    createTask: builder.mutation({
      // invalidatesTags: ["Tasks", "IncompleteTasks"],
      query: ({ title, deadline, date }) => {
        return {
          url: `/task`,
          method: "POST",
          body: { title, deadline },
        };
      },
      async onQueryStarted({ title, deadline, date }, { dispatch, queryFulfilled }) {
        const optimisticUpdate = dispatch(
          api.util.updateQueryData("getTodaysTasks", { date }, (draft) => {
            draft.push({
              completed: false,
              focus: false,
              id: Math.floor(Math.random() * 100),
              createdAt: deadline,
              deadline,
              title
            })
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
    moveIncompleteTasks: builder.mutation({
      invalidatesTags: ["Tasks", "IncompleteTasks"],
      query: ({ from, to }) => ({
        url: `/task/move-incomplete`,
        method: "POST",
        body: { from, to },
      }),
    }),
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
  useMoveIncompleteTasksMutation,
  useGetIncompleteTasksQuery,
  useUpdateTaskMutation,
  useGetIncompleteDetailTasksQuery,
  useMoveSpecificTasksMutation,
  useDeleteTaskMutation
} = taskApi;
