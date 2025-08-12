import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roleValue: "",
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRoleValue: (state, action) => {
      state.roleValue = action.payload;
      console.log("role state changed (from redux):", state.roleValue);
    },
  },
});

export const { setRoleValue } = roleSlice.actions;
export default roleSlice.reducer;
