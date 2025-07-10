import { createSlice } from "@reduxjs/toolkit";
const forgotSlice = createSlice({
  name: "forgot",
  initialState: false,

  reducers: {
    addForgot: (state, action) => {
      return action.payload;
    },
  },
});

export const {addForgot} = forgotSlice.actions;
export default forgotSlice.reducer;
