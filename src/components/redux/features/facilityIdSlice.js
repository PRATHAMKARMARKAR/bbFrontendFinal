import { createSlice } from "@reduxjs/toolkit";

const initialState={
    facilityId: "",
}

export const facilityIdSlice = createSlice({
    name: "facilityId",
    initialState,
    reducers: {
        setFacilityId: (state, action) => {
            state.facilityId = action.payload;
        },
      
    },
})

export const {facilityId} = facilityIdSlice.actions;
export default facilityIdSlice.reducer;