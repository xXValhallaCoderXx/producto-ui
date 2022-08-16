import { configureStore } from "@reduxjs/toolkit";
import todaySlice from "../screens/App/Today/today-slice";
import { taskApi } from "../api";
export default configureStore({
  reducer: {
    today: todaySlice,
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(taskApi.middleware),
});
