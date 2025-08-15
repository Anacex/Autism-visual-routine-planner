// src/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { uid: null, email: null, isAuthenticated: false },
  reducers: {
    setUser: (state, action) => {
      const { uid, email } = action.payload;
      state.uid = uid;
      state.email = email;
      state.isAuthenticated = !!uid; // Set based on presence of uid
    },
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;