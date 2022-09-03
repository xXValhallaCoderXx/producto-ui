import { createSlice } from "@reduxjs/toolkit";

export const globalSlice = createSlice({
  name: "global-slice",
  initialState: {
    init: false,
  },
  reducers: {
    toggleInit: (state, action) => {
      state.editMode = !state.editMode;
    },
  },
});

export const { toggleInit } = globalSlice.actions;

export default globalSlice.reducer;
