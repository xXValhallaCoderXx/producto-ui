import { configureStore } from "@reduxjs/toolkit";
import todaySlice from "../screens/App/Today/today-slice";
// import { api } from "../api";
export default configureStore({
  reducer: {
    today: todaySlice,
    // [api.reducerPath]: api.reducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(api.middleware),
});
