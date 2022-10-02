import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { store } from "../config/store";
import { globalSlice } from "../shared/slice/global-slice";
import axios from "axios";
// Define a service using a base URL and expected endpoints
// const baseQuery = fetchBaseQuery({
//   baseUrl: `${Constants.manifest.extra.baseUrl}/api/v1`,
//   prepareHeaders: async (headers) => {
//     // If we have a token set in state, let's assume that we should be passing it.
//     const jwtToken = await AsyncStorage.getItem("@producto-jwt-token");
//     if (jwtToken) {
//       headers.set("authorization", `Bearer ${jwtToken}`);
//     }
//     headers.set("Content-Type", "application/json");
//     return headers;
//   },
// });

const refetchBaseQuery = fetchBaseQuery({
  baseUrl: `${Constants.manifest.extra.baseUrl}/api/v1`,
  prepareHeaders: async (headers) => {
    // If we have a token set in state, let's assume that we should be passing it.
    const jwtToken = await SecureStore.getItemAsync(
      "producto-jwt-refresh-token"
    );

    headers.set("authorization", `Bearer ${jwtToken}`);
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const customBaseQuery = async (args, api, extraOptions) => {
  let result;
  try {
    console.log("ARGS", args);
    result = await baseQuery(args, api, extraOptions);

    const isAuthenticated = api.getState().global.isAuthenticated;
    const isInit = api.getState().global.init;

    if (!isAuthenticated && !isInit) {
      if (args === "/user/profile" && result.meta.response.status === 200) {
        // Remounting App

        api.dispatch(globalSlice.actions.toggleInit({ isInit: true }));
        api.dispatch(
          globalSlice.actions.toggleIsAuthenticated({ isAuthenticated: true })
        );
      }
    }
    if (!isInit && result.meta.response.status === 404) {
      api.dispatch(globalSlice.actions.toggleInit({ isInit: true }));
      api.dispatch(
        globalSlice.actions.toggleIsAuthenticated({ isAuthenticated: false })
      );
    }

    // Handle unauthorized
    if (result.meta.response.status === 401) {
      console.log("internal base query 401");
      const refreshToken = await SecureStore.getItemAsync(
        "producto-jwt-refresh-token"
      );

      if (refreshToken) {
        console.log("DO I HAVE A REFRESH TOKEN")
        try {
          const res = await axios.get(
            `${Constants.manifest.extra.baseUrl}/api/v1/auth/refresh-jwt`,
            {
              headers: {
                authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          console.log("X", res.data);
          const { accessToken, refreshToken } = res.data;
          await SecureStore.setItemAsync("producto-jwt-token", accessToken);
          await SecureStore.setItemAsync(
            "producto-jwt-refresh-token",
            refreshToken
          );
          api.dispatch(
            globalSlice.actions.toggleIsAuthenticated({ isAuthenticated: true })
          );
        } catch (err) {
          console.log("REFAUTH ERROR AXIOS", err);
          await SecureStore.setItemAsync("producto-jwt-token", "");
          await SecureStore.setItemAsync("producto-jwt-refresh-token", "");
          api.dispatch(
            globalSlice.actions.toggleIsAuthenticated({
              isAuthenticated: false,
            })
          );
        }
      }

      api.dispatch(globalSlice.actions.toggleInit({ isInit: true }));
    }

    return result;
  } catch (err) {
    return err;
  }
};

const baseQuery = fetchBaseQuery({
  baseUrl: `${Constants.manifest.extra.baseUrl}/api/v1`,
  prepareHeaders: async (headers) => {
    // If we have a token set in state, let's assume that we should be passing it.
    const jwtToken = await SecureStore.getItemAsync("producto-jwt-token");
    console.log("WHAT IS THIS: ", jwtToken);
    if (jwtToken) {
      headers.set("authorization", `Bearer ${jwtToken}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
  tagTypes: ["Tasks", "User", "IncompleteTasks"],
});
