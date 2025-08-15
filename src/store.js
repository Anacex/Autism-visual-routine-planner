import { configureStore } from "@reduxjs/toolkit";
import routineReducer from "./slices/routineSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    routine: routineReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/setUser"], // Ignore setUser action
        ignoredPaths: ["auth"], // Ignore auth slice during checks
      },
    }),
});