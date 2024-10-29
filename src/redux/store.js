import { createSlice, configureStore } from "@reduxjs/toolkit";

// Helper function to get the token and userId from localStorage
const getTokenFromLocalStorage = () => {
  return localStorage.getItem("userToken") || null;
};

const getUserIdFromLocalStorage = () => {
  return localStorage.getItem("userId") || null;
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLogin: !!getTokenFromLocalStorage(), // Initialize based on localStorage
    token: getTokenFromLocalStorage(), // Load token from localStorage
    userId: getUserIdFromLocalStorage(), // Load userId from localStorage
  },
  reducers: {
    login(state, action) {
      state.isLogin = true;
      state.token = action.payload.token; // Set the token when logging in
      state.userId = action.payload.userId; // Set the userId when logging in
      localStorage.setItem("userToken", action.payload.token); // Store token in localStorage
      localStorage.setItem("userId", action.payload.userId); // Store userId in localStorage
    },
    logout(state) {
      state.isLogin = false;
      state.token = null; // Clear the token when logging out
      state.userId = null; // Clear the userId when logging out
      localStorage.removeItem("userToken"); // Remove token from localStorage
      localStorage.removeItem("userId"); // Remove userId from localStorage
    },
  },
});

// Exporting the actions for use in components
export const authActions = authSlice.actions;

// Configuring the store with the auth slice reducer
export const store = configureStore({
  reducer: authSlice.reducer,
});
