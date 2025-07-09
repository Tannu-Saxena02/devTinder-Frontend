import { createSlice } from "@reduxjs/toolkit";
const privacySlice = createSlice({
  name: "isprivacy",
  initialState: "false",

  reducers: {
    addPrivacy: (state, action) => {
      return action.payload;
    },
  },
});

export const { addPrivacy } = privacySlice.actions;
export default privacySlice.reducer;