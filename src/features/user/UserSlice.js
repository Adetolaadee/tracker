import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "./userApi";

const initialState = {
  users: [],
  pendingUsers: [],
  status: "idle",
  account: "",
  actionMessage: "",
  userApproval: null,
  error: null,
};

// Fetch all users
export const fetchAllUser = createAsyncThunk("user/fetchAll", async () => {
  try {
    return await api.fetchAllUsers();
  } catch (error) {
    throw new Error(error.message);
  }
});

// Fetch all users
export const approvalUser = createAsyncThunk(
  "user/approvaluser",
  async (data) => {
    try {
      console.log("slice ", data);
      return await api.approvalUser(data.accountId, data.approveData);
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

// Fetch all users
export const allUserWaitingApproval = createAsyncThunk(
  "user/pendingApproval",
  async () => {
    try {
      return await api.allUserThatNeedsApproval();
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

// Fetch all users
export const updateUserApprovalResponse = createAsyncThunk(
  "user/updatedUserApproval",
  async () => {
    try {
      return await api.updateApprovalResponse();
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

// Request user sign-in
export const requestSignIn = createAsyncThunk(
  "user/requestSignIn",
  async (data) => {
    try {
      return await api.signInUser(data);
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

// Request user sign-out (newly added)
export const requestSignOut = createAsyncThunk(
  "user/requestSignOut",
  async (token) => {
    try {
      // Here you can implement your sign-out logic,
      // e.g., clearing the user token, making an API call to log out, etc.
      // For example:
      await api.signOutUser(token); // Assuming you have a signOutUser method in your API
      return "Sign out successful"; // Return a message or other data if needed
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      return initialState; // Reset state on logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = "success";
          state.users = action.payload;
        }
      })
      .addCase(fetchAllUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(approvalUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(approvalUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = "success";
          if (
            action.payload &&
            action.payload.data &&
            typeof action.payload.data === "string" &&
            action.payload.data.includes("approved")
          ) {
            // state.pendingUsers.filter((it) => it.)
          }
          state.actionMessage = action.payload;
        }
      })
      .addCase(approvalUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(allUserWaitingApproval.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(allUserWaitingApproval.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = "success";
          state.pendingUsers = action.payload.data;
        }
      })
      .addCase(allUserWaitingApproval.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUserApprovalResponse.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserApprovalResponse.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = "success";
          state.account = action.payload;
        }
      })
      .addCase(updateUserApprovalResponse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(requestSignIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(requestSignIn.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = "success";
          state.userApproval = action.payload;
        }
      })
      .addCase(requestSignIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(requestSignOut.fulfilled, (state) => {
        state.status = "idle"; // Reset to idle or another state you prefer after sign out
        state.userApproval = null; // Clear user approval on sign out
      });
  },
});

// Action creators
export const { logout } = userSlice.actions;

// Selector functions to access state
export const selectUsers = (state) => state.user.users;
export const selectUserStatus = (state) => state.user.status;
export const selectUserApproval = (state) => state.user.userApproval;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;
