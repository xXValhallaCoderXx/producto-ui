import { createSlice } from "@reduxjs/toolkit";

export const globalSlice = createSlice({
  name: "global",
  initialState: {
    init: false,
    isAuthenticated: false,
  },
  reducers: {
    toggleInit: (state, action) => {
      state.init = action.payload.isInit;
    },
    toggleIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
    },
  },
});

export const { toggleInit, toggleIsAuthenticated } = globalSlice.actions;

export default globalSlice.reducer;
