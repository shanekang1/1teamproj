import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import businessReducer from "./slices/businessSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    ui: uiReducer,
  },
});
