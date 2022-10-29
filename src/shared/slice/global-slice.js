import { createSlice } from "@reduxjs/toolkit";

export const globalSlice = createSlice({
  name: "global",
  initialState: {
    init: false,
    isAuthenticated: false,
    firstLoad: false,
    editMode: false,
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
    toggleEditMode: (state, action) => {
      state.editMode = action.payload;
    },
  },
});

export const {
  toggleInit,
  toggleIsAuthenticated,
  toggleFirstLoad,
  toggleEditMode,
} = globalSlice.actions;

export default globalSlice.reducer;
