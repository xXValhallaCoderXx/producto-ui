import { Mutex } from 'async-mutex';
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const mutex = new Mutex();

const baseQueryWithReauth = async (args, api, extraOptions) => {
  console.log("LETS GOOOO")
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  console.log("REEESULT: ", result);
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      console.log("HEHEHEA")
      // try {
      //   const refreshResult = await baseQuery(
      //     {
      //       url: 'auth/refresh/',
      //       method: 'POST',
      //       body: { hehe: "" },
      //     },
      //     api,
      //     extraOptions,
      //   );

      //   if (refreshResult.data) {
      //     api.dispatch(tokenUpdated(refreshResult.data));

      //     // retry the initial query
      //     result = await baseQuery(args, api, extraOptions);
      //   } else {
      //     api.dispatch(logout());
      //   }
      // } finally {
      //   release();
      // }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

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
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["Tasks"],
});
