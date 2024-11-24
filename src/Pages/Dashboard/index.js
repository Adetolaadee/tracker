import React, { useEffect, useState } from "react";
import { Api } from "../../api/api.config";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    state: "",
    location: "",
    fullName: "",
    phoneNumber: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!token) {
          setError("Authorization token is missing. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await Api.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setDashboardData(response.data.data);
          setFormData({
            state: response.data.data.state || "",
            location: response.data.data.location || "",
            fullName: response.data.data.fullName || "",
            phoneNumber: response.data.data.phoneNumber || "",
            bankName: response.data.data.bankName || "",
            accountNumber: response.data.data.accountNumber || "",
            accountName: response.data.data.accountName || "",
          });
          setLoading(false);
        } else {
          setError("Unexpected response status: " + response.status);
          setLoading(false);
        }
      } catch (err) {
        handleError(err);
      }
    };

    fetchDashboardData();
  }, [token]);

  const handleError = (err) => {
    console.error("Error fetching dashboard data:", err);
    if (err.response) {
      setError(
        err.response.data.message ||
          "Failed to load dashboard data. Please try again."
      );
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userId = dashboardData?._id;

    if (!userId) {
      setError("User ID is missing or invalid.");
      return;
    }

    try {
      const response = await Api.put(`/updateinfo/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Information updated successfully!");
        setDashboardData(response.data.data);
      } else {
        setError("Unexpected response status: " + response.status);
      }
    } catch (err) {
      handleError(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const role = dashboardData?.role || "N/A"; // Add role handling

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {dashboardData && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <img
              src={dashboardData.profilePicture?.pictureUrl || ""}
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4 max-sm:hidden"
            />
            <div className="">
              <h2 className="text-xl font-bold">{dashboardData.fullName}</h2>
              <p className="text-gray-500">{dashboardData.email}</p>
              <p className="text-gray-500">{dashboardData.phoneNumber}</p>
              <p className="text-gray-500">Role: {role}</p> {/* Display role */}
            </div>
          </div>

          <form onSubmit={handleUpdate} className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name (optional)"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number (optional)"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Bank Name (optional)"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Account Number (optional)"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                placeholder="Account Name (optional)"
                className="border rounded p-2"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
