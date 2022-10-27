import { createSlice } from "@reduxjs/toolkit";
import { convertUTCDateToLocalDate } from "../../../shared/utils/date-utils";

export const todaySlice = createSlice({
  name: "today-slice",
  initialState: {
    editMode: true,
    calendarOpen: false,
  },
  reducers: {
    toggleEdit: (state, action) => {
      state.editMode = action.payload.editMode ?? !state.editMode;
    },
    toggleCalendar: (state, action) => {
      state.calendarOpen = !state.calendarOpen;
    },
  },
});

export const { toggleEdit, toggleCalendar } = todaySlice.actions;

export default todaySlice.reducer;
