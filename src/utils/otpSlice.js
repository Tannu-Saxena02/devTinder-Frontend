import { createSlice } from "@reduxjs/toolkit";
const otpSlice = createSlice({
  name: "isOtp",
  initialState: false,

  reducers: {
    addOtp: (state, action) => {
      return action.payload;
    },
  },
});

export const {addOtp} = otpSlice.actions;
export default otpSlice.reducer;
