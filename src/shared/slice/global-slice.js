import { createSlice } from "@reduxjs/toolkit";

export const globalSlice = createSlice({
  name: "global",
  initialState: {
    init: false,
    isAuthenticated: false,
    firstLoad: false,
  },
  reducers: {
    toggleInit: (state, action) => {
      state.init = action.payload;
    },
    toggleIsAuthenticated: (state, action) => {
      console.log("ACTION: ", action);
      state.isAuthenticated = action.payload;
    },
    toggleFirstLoad: (state, action) => {
      console.log("WHATSS", action)
      state.firstLoad = action.payload;
    },
  },
});

export const { toggleInit, toggleIsAuthenticated, toggleFirstLoad } = globalSlice.actions;

export default globalSlice.reducer;
