import { createSlice, configureStore } from "@reduxjs/toolkit";

// Helper function to get the token from localStorage
const getTokenFromLocalStorage = () => {
  return localStorage.getItem("userToken") || null;
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLogin: !!getTokenFromLocalStorage(), // Initialize based on localStorage
    token: getTokenFromLocalStorage(), // Load token from localStorage
  },
  reducers: {
    login(state, action) {
      state.isLogin = true;
      state.token = action.payload; // Set the token when logging in
    },
    logout(state) {
      state.isLogin = false;
      state.token = null; // Clear the token when logging out
      localStorage.removeItem("userToken"); // Remove token from localStorage
    },
  },
});

// Exporting the actions for use in components
export const authActions = authSlice.actions;

// Configuring the store with the auth slice reducer
export const store = configureStore({
  reducer: authSlice.reducer,
});
