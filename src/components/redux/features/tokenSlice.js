import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tokenValue: "",
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setTokenValue: (state, action) => {
      state.tokenValue = action.payload;
      console.log("token state changed (from redux):", state.tokenValue);
    },
  },
});

export const { setTokenValue } = tokenSlice.actions;
export default tokenSlice.reducer;
