// store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: null,
};

export const authSlice = createSlice({
  name: "authStore",
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.auth = action.payload;
    },
    logOut: (state) => {
      state.auth = null;
    },
  },
});

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;
