import { createSlice } from "@reduxjs/toolkit";

export const todaySlice = createSlice({
  name: "today-slice",
  initialState: {
    focusMode: true,
    editMode: false,
    calendarOpen: false,
    isToday: true,
  },
  reducers: {
    toggleFocusMode: (state, action) => {
      state.focusMode = action.payload.focusMode ?? !state.focusMode;
    },
    toggleCalendar: (state, action) => {
      state.calendarOpen = !state.calendarOpen;
    },
    toggleIsToday: (state, action) => {
      state.isToday = action.payload;
    },
    toggleEditMode: (state, action) => {
      state.editMode = action.payload.editMode ?? !state.editMode;
    },
  },
});

export const {
  toggleFocusMode,
  toggleCalendar,
  toggleIsToday,
  toggleEditMode,
} = todaySlice.actions;

export default todaySlice.reducer;
