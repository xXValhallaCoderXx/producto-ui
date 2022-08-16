import Constants from "expo-constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${Constants.manifest.extra.baseUrl}/api/v1/`,
  }),
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => `task`,
    }),
  }),
});

export const { useGetTasksQuery } = taskApi;
