import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const apiCall = () => {
//   const defaultOptions = {
//     baseURL: `${Constants.manifest.extra.baseUrl}/api/v1`,
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };

//   // Create instance
//   let instance = axios.create(defaultOptions);

//   // Set the AUTH token for any request
//   instance.interceptors.request.use( async (config) => {

//     const jwtToken = await AsyncStorage.getItem("@producto-jwt-token");
//     if (jwtToken) {
//       config.headers.Authorization =  token ? `Bearer ${jwtToken}` : '';
//     }
//     return config;
//   });

//   return instance;
// };

// export default apiCall;

const httpClient = axios.create({
  baseURL: `${Constants.manifest.extra.baseUrl}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(async (config) => {
  const jwtToken = await AsyncStorage.getItem("@producto-jwt-token");
  if (jwtToken) {
    config.headers.Authorization = jwtToken ? `Bearer ${jwtToken}` : "";
  }
  return config;
});

export default httpClient;
