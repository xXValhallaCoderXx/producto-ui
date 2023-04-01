import { createSlice, createSelector } from "@reduxjs/toolkit";
import { isSameDay, parseISO } from "date-fns";

export const todaySlice = createSlice({
  name: "today-slice",
  initialState: {
    focusMode: false,
    editMode: false,
    addTaskMode: false,
    calendarOpen: false,
    editingTask: null,
    currentDate: new Date().toISOString(),
  },
  reducers: {
    toggleFocusMode: (state, action) => {
      state.focusMode = action.payload.focusMode ?? !state.focusMode;
    },
    toggleCalendar: (state, action) => {
      state.calendarOpen = !state.calendarOpen;
    },
    toggleEditMode: (state, action) => {
      state.editMode = action.payload.editMode ?? !state.editMode;
    },
    toggleAddTaskMode: (state, action) => {
      state.addTaskMode = action.payload ?? !state.addTaskMode;
    },
    setCurrentDate: (state, action) => {
      state.currentDate = action.payload;
    },
    setEditingTask: (state, action) => {
      state.editingTask = action.payload;
    },
  },
});

const selectSelf = (state) => state;

export const selectIsToday = createSelector(selectSelf, (state) => {
  if (isSameDay(new Date(state.today.currentDate), new Date())) {
    return true;
  }
  return false;
});

export const selectCurrentDate = createSelector(selectSelf, (state) => {
  return parseISO(state.today.currentDate);
});

export const {
  toggleFocusMode,
  toggleCalendar,
  toggleIsToday,
  toggleEditMode,
  toggleAddTaskMode,
  setCurrentDate,
  setEditingTask,
} = todaySlice.actions;

export default todaySlice.reducer;
