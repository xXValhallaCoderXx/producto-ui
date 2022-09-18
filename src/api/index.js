import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { store } from "../config/store";
import { globalSlice } from "../shared/slice/global-slice";
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

const customBaseQuery = async (args, api, extraOptions) => {
  let result;
  try {
    result = await baseQuery(args, api, extraOptions);
  

    const isAuthenticated = api.getState().global.isAuthenticated;
    const isInit = api.getState().global.init;

    console.log("ARGS", result.meta.response.status);
    if(!isAuthenticated && !isInit){
      if(args === "/auth/profile" && result.meta.response.status === 200){
      // Remounting App
     
      api.dispatch(globalSlice.actions.toggleInit({isInit: true}))
      api.dispatch(globalSlice.actions.toggleIsAuthenticated({isAuthenticated: true}))
      }

    }
   
    // Handle unauthorized
    if (result.meta.response.status === 401) {
      api.dispatch(globalSlice.actions.toggleInit({isInit: true}))
      api.dispatch(
        globalSlice.actions.toggleIsAuthenticated({ isAuthenticated: false })
      );
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
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
  tagTypes: ["Tasks"],
});
