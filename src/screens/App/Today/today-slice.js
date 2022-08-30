import { createSlice } from "@reduxjs/toolkit";
import { convertUTCDateToLocalDate } from "../../../shared/utils/date-utils";

export const todaySlice = createSlice({
  name: "today-slice",
  initialState: {
    editMode: true,
    dates: {
      utc: "",
      local: "",
    },
  },
  reducers: {
    toggleEdit: (state, action) => {
      state.editMode = action.payload.editMode ?? !state.editMode;
    },
    setCurrentDate: (state, action) => {
      state.dates.utc = new Date(action.payload.date).toString();
      state.dates.local = convertUTCDateToLocalDate(
        new Date(action.payload.date)
      ).toString();
    },
  },
});

export const { toggleEdit, setCurrentDate } = todaySlice.actions;

export default todaySlice.reducer;
