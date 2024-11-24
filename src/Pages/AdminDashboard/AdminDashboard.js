import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const navigateToUserApproval = () => {
    navigate("/admin/approve/user");
  };

  const navigateAssignedLocation = () => {
    navigate("/admin/assign/location");
  };

  return (
    <div className="flex justify-center gap-8 items-center h-screen">
      <button
        onClick={navigateToUserApproval}
        className="py-2 px-6 rounded-lg bg-orange-600 text-white font-medium text-sm hover:bg-opacity-80"
      >
        Approve User
      </button>
      <button
        onClick={navigateAssignedLocation}
        className="py-2 px-6 rounded-lg bg-orange-600 text-white font-medium text-sm hover:bg-opacity-80"
      >
        Assign Location
      </button>
    </div>
  );
};

export default AdminDashboard;
