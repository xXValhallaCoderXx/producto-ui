import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
const baseQuery = fetchBaseQuery({
  baseUrl: `${Constants.manifest.extra.baseUrl}/api/v1`,
  prepareHeaders: async (headers) => {
    // If we have a token set in state, let's assume that we should be passing it.
    const jwtToken = await AsyncStorage.getItem("@producto-jwt-token");
    if (jwtToken) {
      headers.set("authorization", `Bearer ${jwtToken}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (email, password) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    register: builder.mutation({
      query: (email, password) => ({
        url: "/auth/register",
        method: "POST",
        body: { email, password },
      }),
    }),
    getTodaysTasks: builder.query({
      query: (name) => `/task`,
    }),
    toggleTask: builder.mutation({
      query: (id, completed) => ({
        url: `/task/${id}`,
        method: "POST",
        body: { completed },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetTodaysTasksQuery,
  useToggleTaskMutation,
} = api;
