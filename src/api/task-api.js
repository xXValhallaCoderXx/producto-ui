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

    updateTask: builder.mutation({
      query: ({ id, data, date }) => {
        return {
          url: `/task/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      async onQueryStarted({ id, data, date }, { dispatch, queryFulfilled }) {
        const optimisticUpdate = dispatch(
          api.util.updateQueryData("getTodaysTasks", { date }, (draft) => {
            const optimisticTodo = draft.find((todo) => todo.id === id);
            if ("completed" in data) {
              optimisticTodo.completed = data.completed;
            }
            if ("focus" in data) {
              optimisticTodo.focus = data.focus;
            }
            if ("title" in data) {
              optimisticTodo.title = data.title;
            }
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
  useCreateTaskMutation,
  useGetIncompleteTasksQuery,
  useUpdateTaskMutation,
  useGetIncompleteDetailTasksQuery,
  useMoveSpecificTasksMutation,
  useDeleteTaskMutation,
} = taskApi;
