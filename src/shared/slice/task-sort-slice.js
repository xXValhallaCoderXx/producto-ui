import { createSlice } from "@reduxjs/toolkit";

export const taskSortSlice = createSlice({
  name: "taskSort",
  initialState: {
    data: {},
  },
  reducers: {
    setSortedData: (state, action) => {
      state.data[action.payload.date] = action.payload.tasks;
    },
  },
});

export const { setSortedData } = taskSortSlice.actions;

export default taskSortSlice.reducer;
