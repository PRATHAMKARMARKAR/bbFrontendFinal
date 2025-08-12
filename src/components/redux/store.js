import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./features/loginSlice";
import facilityIdReducer from "./features/facilityIdSlice";
import partnerReducer from "./features/partnerSlice";
import tokenReducer from "./features/tokenSlice";
import roleReducer from "./features/roleSlice";
import detailsReducer from "./features/detailsSlice";
export const store = configureStore({
  reducer: {
    login: loginReducer,
    facilityId: facilityIdReducer,
    partner: partnerReducer,
    token: tokenReducer,
    role: roleReducer,
    details: detailsReducer,
  },
});
