// LogOut.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user data from local storage
    localStorage.removeItem("userToken"); // Adjust this key based on your implementation
    // localStorage.removeItem("isAdmin"); // Remove any other related data as necessary

    localStorage.setItem("isAdmin", "false");
    navigate("/Home");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h2 className="text-xl">Logging you out...</h2>
    </div>
  );
};

export default LogOut;
