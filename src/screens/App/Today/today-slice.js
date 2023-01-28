import { createSlice } from "@reduxjs/toolkit";

export const todaySlice = createSlice({
  name: "today-slice",
  initialState: {
    focusMode: true,
    editMode: false,
    addTaskMode: false,
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
    toggleAddTaskMode: (state, action) => {
      state.addTaskMode = action.payload ?? !state.addTaskMode;
    },
  },
});

export const {
  toggleFocusMode,
  toggleCalendar,
  toggleIsToday,
  toggleEditMode,
  toggleAddTaskMode,
} = todaySlice.actions;

export default todaySlice.reducer;
