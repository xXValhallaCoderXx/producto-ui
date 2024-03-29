import { createSlice } from "@reduxjs/toolkit";

export const globalSlice = createSlice({
  name: "global",
  initialState: {
    init: false,
    isAuthenticated: false,
    firstLoad: false,
    email: "",
  },
  reducers: {
    toggleInit: (state, action) => {
      state.init = action.payload;
    },
    toggleIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    toggleFirstLoad: (state, action) => {
      state.firstLoad = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

export const { toggleInit, toggleIsAuthenticated, toggleFirstLoad, setEmail } =
  globalSlice.actions;

export default globalSlice.reducer;
