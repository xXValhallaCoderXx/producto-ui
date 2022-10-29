import { createSlice } from "@reduxjs/toolkit";

export const taskSortSlice = createSlice({
  name: "taskSort",
  initialState: {
    onboarded: false,
    data: {},
  },
  reducers: {
    setSortedData: (state, action) => {
      state.data[action.payload.date] = action.payload.tasks;
    },
    setOnboarding: (state, action) => {
      state.onboarded = action.payload;
    },
  },
});

export const { setSortedData, setOnboarding } = taskSortSlice.actions;

export default taskSortSlice.reducer;
