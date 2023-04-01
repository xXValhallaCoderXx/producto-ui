import { api } from "./index";

const taskApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTodaysTasks: builder.query({
      query: ({ date, ...params }) => ({
        url: `/task`,
        params,
      }),
      providesTags: (result, error, arg) => {
        return [{ type: "Tasks", id: arg.start }];
      },
    }),

    createTask: builder.mutation({
      invalidatesTags: ["Tasks", "IncompleteTasks"],
      query: ({ title, deadline }) => {
        return {
          url: `/task`,
          method: "POST",
          body: { title, deadline },
        };
      },
      async onQueryStarted(
        { title, deadline, start, end },
        { dispatch, queryFulfilled }
      ) {
        const optimisticUpdate = dispatch(
          api.util.updateQueryData(
            "getTodaysTasks",
            { end, start },
            (draft) => {
              draft.push({
                completed: false,
                focus: false,
                id: Math.floor(Math.random() * 100),
                createdAt: deadline,
                deadline,
                title,
              });
              return draft;
            }
          )
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData(
              "getTodaysTasks",
              { start, end },
              (draft) => {
                const task = draft.find((todo) => todo.title === data.title);
                task.id = data.id;
                task.createdAt = task.createdAt;
                return draft;
              }
            )
          );
        } catch (e) {
          optimisticUpdate.undo();
        }
      },
    }),

    updateTask: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/task/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      // invalidatesTags: ["Tasks"],
      async onQueryStarted(
        { id, data, start, end },
        { dispatch, queryFulfilled }
      ) {
        const optimisticUpdate = dispatch(
          api.util.updateQueryData(
            "getTodaysTasks",
            { start, end },
            (draft) => {
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
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (e) {
          optimisticUpdate.undo();
        }
      },
    }),

    deleteTask: builder.mutation({
      invalidatesTags: ["Tasks", "IncompleteTasks"],
      query: ({ id }) => {
        return {
          url: `/task/${id}`,
          method: "DELETE",
        };
      },
      async onQueryStarted({ id, start, end }, { dispatch, queryFulfilled }) {
        const optimisticUpdate = dispatch(
          api.util.updateQueryData(
            "getTodaysTasks",
            { start, end },
            (draft) => {
              draft = draft.filter((todo) => todo.id !== id);
              return draft;
            }
          )
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
