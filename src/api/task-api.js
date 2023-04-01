import { api } from "./index";

const taskApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTodaysTasks: builder.query({
      query: ({ date, ...params }) => ({
        url: `/task`,
        params,
      }),
      providesTags: (result, error, arg) => {
        console.log("ARG ", arg);
        return [{ type: "Tasks", id: arg.date }];
      },
    }),

    createTask: builder.mutation({
      // invalidatesTags: ["Tasks", "IncompleteTasks"],
      query: ({ title, deadline }) => {
        return {
          url: `/task`,
          method: "POST",
          body: { title, deadline },
        };
      },
      async onQueryStarted(
        { title, deadline, date, end, start },
        { dispatch, queryFulfilled }
      ) {
        const optimisticUpdate = dispatch(
          api.util.updateQueryData(
            "getTodaysTasks",
            { date, end, start },
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
              { date, start, end },
              (draft) => {
                const task = draft.find((todo) => todo.title === data.title);
                task.id = data.id;
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
      query: ({ id, data, date }) => {
        return {
          url: `/task/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      // invalidatesTags: ["Tasks"],
      async onQueryStarted({ id, data, date }, { dispatch, queryFulfilled }) {
        const optimisticUpdate = dispatch(
          api.util.updateQueryData("getTodaysTasks", { date }, (draft) => {
            console.log("DRAAAFT: ", draft);
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
