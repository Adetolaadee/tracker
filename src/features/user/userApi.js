import { Api } from "../../api/api.config";

// Function to set up headers
// let token1 = JSON.parse(localStorage.getItem("token"));
let token = localStorage.getItem("token");

const getHeaders = (token, contentType) => {
  if (token === null) {
    const headers = {
      "Content-Type": contentType,
    };

    return headers;
  } else {
    const headers = {
      "Content-Type": contentType,
      Authorization: `Bearer ${token}`,
    };

    return headers;
  }
};
// "Content-Type": "multipart/form-data", application/json
export const fetchAllUsers = async () => {
  try {
    const response = await Api.get(
      "/all",
      getHeaders(token, "application/json")
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const signInUser = async (userDetails) => {
  try {
    const res = await Api.post(
      "/checkin",
      userDetails,
      getHeaders(token, "multipart/form-data")
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error signing in user:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const signOutUser = async (userDetails) => {
  try {
    const res = await Api.post(
      "/checkOut",
      userDetails,
      getHeaders(token, "multipart/form-data")
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error signing out user:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const approvalUser = async (accountId, approveData) => {
  try {
    console.log("token ", token, approveData);
    const response = await Api.put(
      `/approve/${accountId}`,
      approveData,
      getHeaders(token, "application/json")
    );
    console.log("hsjs ".response);
    return response.data;
  } catch (error) {
    console.error("Error approving user:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const allUserThatNeedsApproval = async () => {
  try {
    const response = await Api.get(
      `/pending`,
      getHeaders(token, "application/json")
    );
    return response.data;
  } catch (error) {
    console.error("Error approving user:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const updateApprovalResponse = async () => {
  try {
    const res = await Api.get(
      "/allaccounts",
      getHeaders(token, "application/json")
    );
    return res.data;
  } catch (error) {
    console.error("Error updating approved user:", error);
    throw error;
  }
};
