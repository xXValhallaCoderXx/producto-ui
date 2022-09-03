import { configureStore } from "@reduxjs/toolkit";
import todaySlice from "../screens/App/Today/today-slice";
import globalSlice from "../shared/slice/global-slice";
import { api } from "../api";
export default configureStore({
  reducer: {
    today: todaySlice,
    global: globalSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
