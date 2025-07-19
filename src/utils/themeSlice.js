import { createSlice } from "@reduxjs/toolkit";
const storedTheme = localStorage.getItem("theme");

const themeSlice = createSlice({
  name: "theme",
  initialState: storedTheme ||"dark",

  reducers: {
    addTheme: (state, action) => {
      localStorage.setItem("theme", action.payload);
      return action.payload;
    },
  },
});

export const { addTheme } = themeSlice.actions;
export default themeSlice.reducer;
