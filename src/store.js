import { configureStore } from "@reduxjs/toolkit";
    import routineReducer from './slices/routineSlice';
    import authReducer from './slices/authSlice';

    export const store = configureStore({
      reducer: {
        routine: routineReducer,
        auth: authReducer,
      },
    });