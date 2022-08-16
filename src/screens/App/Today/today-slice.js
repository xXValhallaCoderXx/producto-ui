import { createSlice } from "@reduxjs/toolkit";

export const todaySlice = createSlice({
  name: "today-slice",
  initialState: {
    editMode: false,
  },
  reducers: {
    toggleEdit: (state, action) => {
      state.editMode = action.payload.editMode ?? !state.editMode;
    },
  },
});

export const { toggleEdit } = todaySlice.actions;

export default todaySlice.reducer;
