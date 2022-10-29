import { api } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import todaySlice from "../screens/App/Today/today-slice";
import globalSlice from "../shared/slice/global-slice";
import taskSortSlice from "../shared/slice/task-sort-slice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["today", "global", api.reducerPath],
};

const rootReducer = combineReducers({
  persist: taskSortSlice,
  today: todaySlice,
  global: globalSlice,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);
export default store;
