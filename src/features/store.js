import { configureStore, combineReducers } from "@reduxjs/toolkit";
import UserReducer from "./user/UserSlice"; // Ensure the file name matches

// Combine reducers
const reducers = combineReducers({
  user: UserReducer, // Add your slice here
});

// Create and export the store
export const store = configureStore({
  reducer: reducers, // Directly use combined reducers
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Optional, if you don't want serializable check errors
    }),
});
