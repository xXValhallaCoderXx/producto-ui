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
  endpoints: () => ({}),
  tagTypes: ["Tasks"],
});
