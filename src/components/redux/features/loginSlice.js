import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: "",
};
export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state , action) => {
      state.isLoggedIn = action.payload; // Set login state
      console.log("Login state changed (from redux):", state.isLoggedIn);
    },
  },
});

export const { login } = loginSlice.actions;
export default loginSlice.reducer;
