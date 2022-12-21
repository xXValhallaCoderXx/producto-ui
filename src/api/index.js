import * as Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { JWT_KEY_STORE, REFRESH_JWT_KEY_STORE } from "../shared/constants";

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
console.log("WHAT IS THIS: ", Constants.default.manifest2.extra.expoClient.extra)
const refetchBaseQuery = fetchBaseQuery({
  // baseUrl: `http://10.0.2.2:3000/api/v1`,
  // baseUrl: `https://deep-mails-jog-116-86-1-104.loca.lt/api/v1`,
  baseUrl: `${Constants.default.manifest2.extra.expoClient.extra.baseUrl}/api/v1`,
  prepareHeaders: async (headers) => {
    // If we have a token set in state, let's assume that we should be passing it.
    const jwtToken = await SecureStore.getItemAsync(REFRESH_JWT_KEY_STORE);

    headers.set("authorization", `Bearer ${jwtToken}`);
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const customBaseQuery = async (args, api, extraOptions) => {
  let result;
  //
  try {
    result = await baseQuery(args, api, extraOptions);
   
    if (
      result?.error?.status === 401 ||
      result?.error?.status === "FETCH_ERROR"
    ) {
      // Unauthorized - Check Refresh Token
      const refreshToken = await SecureStore.getItemAsync(
        REFRESH_JWT_KEY_STORE
      );
      console.log("API MIDDLEWARE - 401");
      if (refreshToken) {
        try {
          const res = await refetchBaseQuery(
            "/auth/refresh-jwt",
            api,
            extraOptions
          );
          const { accessToken, refreshToken } = res.data;
          await SecureStore.setItemAsync(JWT_KEY_STORE, accessToken);
          await SecureStore.setItemAsync(REFRESH_JWT_KEY_STORE, refreshToken);
          api.dispatch(globalSlice.actions.toggleIsAuthenticated(true));
          result = await baseQuery(args, api, extraOptions);
        } catch (err) {
          await SecureStore.setItemAsync(JWT_KEY_STORE, "");
          await SecureStore.setItemAsync(REFRESH_JWT_KEY_STORE, "");
          api.dispatch(globalSlice.actions.toggleIsAuthenticated(false));
          // ToastAndroid.show("You have been logged out", ToastAndroid.SHORT);
        }
      } else {
        await SecureStore.setItemAsync(JWT_KEY_STORE, "");
        await SecureStore.setItemAsync(REFRESH_JWT_KEY_STORE, "");
        api.dispatch(globalSlice.actions.toggleIsAuthenticated(false));
        // api.dispatch(globalSlice.actions.toggleInit(true));
      }
    } else if (result?.meta?.response?.status === 200) {
      // const isAuthenticated = api.getState().global.isAuthenticated;
      const isInit = api.getState().global.init;
      if (!isInit) {
        api.dispatch(globalSlice.actions.toggleIsAuthenticated(true));
      }
    }

    // if (!isAuthenticated && !isInit) {
    //   if (args === "/user/profile" && result.meta.response.status === 200) {
    //     // Remounting App

    //     api.dispatch(globalSlice.actions.toggleInit(true));
    //     api.dispatch(
    //       globalSlice.actions.toggleIsAuthenticated(true)
    //     );
    //   }
    // }
    // if (!isInit && result.meta.response.status === 404) {
    //   api.dispatch(globalSlice.actions.toggleInit(true));
    //   api.dispatch(
    //     globalSlice.actions.toggleIsAuthenticated(false)
    //   );
    // }

    // Handle unauthorized
    // if (result.meta.response.status === 401) {
    //   const refreshToken = await SecureStore.getItemAsync(
    //     REFRESH_JWT_KEY_STORE
    //   );

    //   if (refreshToken) {
    //     try {
    //       const res = await refetchBaseQuery(
    //         "/auth/refresh-jwt",
    //         api,
    //         extraOptions
    //       );
    //       const { accessToken, refreshToken } = res.data;
    //       await SecureStore.setItemAsync(JWT_KEY_STORE, accessToken);
    //       await SecureStore.setItemAsync(REFRESH_JWT_KEY_STORE, refreshToken);
    //       api.dispatch(globalSlice.actions.toggleIsAuthenticated(true));
    //       result = await baseQuery(args, api, extraOptions);
    //     } catch (err) {
    //       await SecureStore.setItemAsync("producto-jwt-token", "");
    //       await SecureStore.setItemAsync("producto-jwt-refresh-token", "");
    //       api.dispatch(globalSlice.actions.toggleIsAuthenticated(false));
    //       ToastAndroid.show("You have been logged out", ToastAndroid.SHORT);
    //     }
    //   } else {
    //     await SecureStore.setItemAsync("producto-jwt-token", "");
    //     await SecureStore.setItemAsync("producto-jwt-refresh-token", "");
    //     api.dispatch(globalSlice.actions.toggleIsAuthenticated(false));
    //   }

    // }

    api.dispatch(globalSlice.actions.toggleInit(true));
    return result;
  } catch (err) {
    console.log("API ERROR: ", JSON.stringify(err));
    return err;
  }
};
const baseQuery = fetchBaseQuery({
  
  // baseUrl: `https://deep-mails-jog-116-86-1-104.loca.lt/api/v1`,
  // baseUrl: `http://10.0.2.2:3000/api/v1`,
  baseUrl: `${Constants.default.manifest2.extra.expoClient.extra.baseUrl}/api/v1`,
  prepareHeaders: async (headers) => {
    // If we have a token set in state, let's assume that we should be passing it.
    const jwtToken = await SecureStore.getItemAsync(JWT_KEY_STORE);
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
