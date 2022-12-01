import { createSlice } from "@reduxjs/toolkit";

export const todaySlice = createSlice({
  name: "today-slice",
  initialState: {
    focusMode: true,
    editMode: null,
    calendarOpen: false,
    isToday: true,
  },
  reducers: {
    toggleFocusMode: (state, action) => {
      state.focusMode = action.payload.focusMode ?? !state.focusMode;
    },
    toggleEditMode: (state, action) => {
      state.editMode = action.payload.editMode ?? null;
    },
    toggleCalendar: (state, action) => {
      state.calendarOpen = !state.calendarOpen;
    },
    toggleIsToday: (state, action) => {
      state.isToday = action.payload;
    },
  },
});

export const { toggleFocusMode, toggleCalendar, toggleIsToday, toggleEditMode } =
  todaySlice.actions;

export default todaySlice.reducer;
