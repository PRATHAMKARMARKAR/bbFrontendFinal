import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    phoneNo: "",
    email: "",
};

const detailsSlice = createSlice({
    name: "details",
    initialState,
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setPhoneNo: (state, action) => {
            state.phoneNo = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
    },
});

export const { setName, setPhoneNo, setEmail } = detailsSlice.actions;

export default detailsSlice.reducer;