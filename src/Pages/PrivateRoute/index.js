import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, roles }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // Check if the user is an admin
  const userRole = isAdmin ? "admin" : "user"; // Set userRole based on the admin check

  // Check if the user has access to the requested route
  const hasAccess = roles.includes(userRole);

  return hasAccess ? element : <Navigate to="/Loginpage" />; // Redirect to login if no access
};

export default PrivateRoute;
