import { createSlice } from "@reduxjs/toolkit";
const termsSlice = createSlice({
  name: "isterms",
  initialState: "false",

  reducers: {
    addTerms: (state, action) => {
      return action.payload;
    },
  },
});

export const { addTerms } = termsSlice.actions;
export default termsSlice.reducer;