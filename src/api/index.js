import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { JWT_KEY_STORE, REFRESH_JWT_KEY_STORE } from "../shared/constants";
import { globalSlice } from "../shared/slice/global-slice";

const baseUrl = Constants.expoConfig.extra.baseUrl;
console.log("BASE RUL: ", baseUrl);
const refetchBaseQuery = fetchBaseQuery({
  // baseUrl: `http://192.168.10.132:3000/api/v1`,
  baseUrl: `https://producto-dev.herokuapp.com/api/v1`,
  // baseUrl: `${baseUrl}/api/v1`,
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
  console.log("START API", args, api, extraOptions);
  try {
    result = await baseQuery(args, api, extraOptions);
    console.log("RESULT RESPONSE: ", result);
    if (
      result?.error?.status === 401 ||
      result?.error?.status === "FETCH_ERROR"
    ) {
      // Unauthorized - Check Refresh Token
      const refreshToken = await SecureStore.getItemAsync(
        REFRESH_JWT_KEY_STORE
      );
      if (refreshToken) {
        try {
          const res = await refetchBaseQuery(
            "/auth/refresh-jwt",
            api,
            extraOptions
          );
          console.log("WHAT IS THIS : ", res);
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
    } else if ((result.error.status = "FETCH_ERROR")) {
      if (result.error.error === "TypeError: Network request failed") {
        await SecureStore.setItemAsync(JWT_KEY_STORE, "");
        await SecureStore.setItemAsync(REFRESH_JWT_KEY_STORE, "");
        api.dispatch(globalSlice.actions.toggleIsAuthenticated(false));
        api.dispatch(globalSlice.actions.toggleInit(true));
      }
    } else if (result?.meta?.response?.status === 200) {
      // const isAuthenticated = api.getState().global.isAuthenticated;
      const isInit = api.getState().global.init;
      if (!isInit) {
        api.dispatch(globalSlice.actions.toggleIsAuthenticated(true));
      }
    }
    console.log("LALALA");
    api.dispatch(globalSlice.actions.toggleInit(true));
    return result;
  } catch (err) {
    console.log("ERROR: ", err);
    return err;
  }
};
const baseQuery = fetchBaseQuery({
  // baseUrl: `${baseUrl}/api/v1`,
  // baseUrl: `http://192.168.10.132:3000/api/v1`,
  baseUrl: `https://producto-dev.herokuapp.com/api/v1`,
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
