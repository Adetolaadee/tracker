import React, { useState, useCallback } from "react";
import { Api } from "../../api/api.config";

const isAdmin = localStorage.getItem("isAdmin");

function Report() {
  const [reportData, setReportData] = useState([]);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [message, setMessage] = useState("");
  const [isPictureModalVisible, setIsPictureModalVisible] = useState(false);
  const [selectedUserPictures, setSelectedUserPictures] = useState([]);
  const [loadingPictures, setLoadingPictures] = useState(false);
  const [expandedPicture, setExpandedPicture] = useState(null); // State for expanded picture
  const [selectedUserName, setSelectedUserName] = useState(""); // To store selected user's name

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchReportData = useCallback(async () => {
    if (!dateFrom || !dateTo) {
      alert("Please select both start and end dates.");
      return;
    }

    const formattedDateFrom = formatDate(dateFrom);
    const formattedDateTo = formatDate(dateTo);

    console.log("Fetching report data from", formattedDateFrom, "to", formattedDateTo); // Debug log

    try {
      const response = await Api.post("viewaccounts", {
        dateFrom: formattedDateFrom,
        dateTo: formattedDateTo,
      });

      if (response.status === 200) {
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        console.log("Report data fetched:", data); // Debug log

        if (data.length === 0) {
          setMessage("No data available for the selected date range.");
        } else {
          setReportData(data);
          setMessage("Report data fetched for preview.");
        }
      } else {
        setMessage("Error: Unable to fetch report data.");
      }
    } catch (error) {
      setMessage(`Error: ${error.message || "An unexpected error occurred."}`);
      console.error("Error fetching report data:", error); // Debug log
    }
  }, [dateFrom, dateTo]);

  // Fetch user pictures dynamically based on userId and type (checkin/checkout)
  const fetchUserPictures = async (userId, type, userName) => {
    if (!dateFrom || !dateTo) {
      alert("Please select both start and end dates.");
      return;
    }

    const formattedDateFrom = formatDate(dateFrom);
    const formattedDateTo = formatDate(dateTo);

    console.log(`Fetching ${type} pictures for user ${userName} (ID: ${userId}) from ${formattedDateFrom} to ${formattedDateTo}`); // Debug log

    const url =
      type === "checkin"
        ? `https://odl-contractattendance-e3v0.onrender.com/api/v1/checkinpictures/${userId}`
        : `https://odl-contractattendance-e3v0.onrender.com/api/v1/checkoutpictures/${userId}`;

    setLoadingPictures(true); // Set a loading indicator while fetching pictures
    setSelectedUserPictures([]); // Clear any previous pictures
    setSelectedUserName(userName); // Set selected user's name

    try {
      const response = await Api.post(url, {
        dateFrom: formattedDateFrom,
        dateTo: formattedDateTo,
      });

      if (response.status === 200 && Array.isArray(response.data.pictures)) {
        const pictures = response.data.pictures.map((picture) => ({
          url: picture.attendancePicture.pictureUrl,
          id: picture._id,
          userName: userName,
          pictureType: type === "checkin" ? "Check-In" : "Check-Out",
        }));

        console.log("Pictures fetched:", pictures); // Debug log
        setSelectedUserPictures(pictures); // Set pictures for the selected user
        setIsPictureModalVisible(true); // Show the modal
      } else {
        alert("No pictures available for this user.");
      }
    } catch (error) {
      alert("Error fetching pictures. Please try again.");
      console.error("Error fetching pictures:", error); // Debug log
    } finally {
      setLoadingPictures(false); // Turn off the loading indicator
    }
  };

  // Function to expand picture
  const expandPicture = (url) => {
    console.log("Expanding picture:", url); // Debug log
    setExpandedPicture(url);
  };

  // Function to close expanded picture or modal
  const closeExpandedPicture = () => {
    console.log("Closing expanded picture"); // Debug log
    setExpandedPicture(null);
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen">
      {isAdmin === "true" ? (
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <h2 className="text-3xl font-bold text-center mb-5">Report Page</h2>

          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="flex flex-col">
              <label htmlFor="start-date">Select Start Date: </label>
              <input
                type="date"
                onChange={(e) => setDateFrom(new Date(e.target.value))}
                className="w-[150px] border border-gray-400 rounded-md p-2 cursor-pointer"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="end-date">Select End Date: </label>
              <input
                type="date"
                onChange={(e) => setDateTo(new Date(e.target.value))}
                className="w-[150px] border border-gray-400 rounded-md p-2 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <button
              className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
              onClick={fetchReportData}
            >
              Preview
            </button>
          </div>

          {message && <p className="text-center text-orange-500">{message}</p>}

          <div className="report-results mt-10 px-2 lg:px-8">
            {reportData.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border">
                  <thead className="bg-blue-600 text-sm text-white h-20 font-semibold">
                    <tr>
                      <th className="border">Full Name</th>
                      <th className="border">Role</th>
                      <th className="border">Account Number</th>
                      <th className="border">Bank</th>
                      <th className="border">Location</th>
                      <th className="border">Phone Number</th>
                      <th className="border">Early Check-In Count</th>
                      <th className="border">Late Check-In Count</th>
                      <th className="border">Early Check-Out Count</th>
                      <th className="border">Late Check-Out Count</th>
                      <th className="border">View Check-In Pictures</th>
                      <th className="border">View Check-Out Pictures</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((user) => (
                      <tr key={user.userId} className="hover:bg-gray-100">
                        <td className="border text-center font-bold text-lg">
                          {user.fullName}
                        </td>
                        <td className="border text-center">{user.role}</td>
                        <td className="border text-center">
                          {user.accountNumber}
                        </td>
                        <td className="border text-center">{user.bankName}</td>
                        <td className="border text-center">
                          {user.location || "N/A"}
                        </td>
                        <td className="border text-center">
                          {user.phoneNumber || "N/A"}
                        </td>
                        <td className="border text-center font-bold text-xl">
                          {user.checkInDetails.earlyCount || 0}
                        </td>
                        <td className="border text-center font-bold text-xl">
                          {user.checkInDetails.lateCount || 0}
                        </td>
                        <td className="border text-center font-bold text-xl">
                          {user.checkOutDetails.earlyCount || 0}
                        </td>
                        <td className="border text-center font-bold text-xl">
                          {user.checkOutDetails.lateCount || 0}
                        </td>
                        <td className="border text-center">
                          <button
                            className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600"
                            onClick={() =>
                              fetchUserPictures(
                                user.userId,
                                "checkin",
                                user.fullName
                              )
                            }
                          >
                            Check-In Pictures
                          </button>
                        </td>
                        <td className="border text-center">
                          <button
                            className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700"
                            onClick={() =>
                              fetchUserPictures(
                                user.userId,
                                "checkout",
                                user.fullName
                              )
                            }
                          >
                            Check-Out Pictures
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-red-600">Access denied</p>
      )}

      {/* Modal for displaying pictures */}
      {isPictureModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-3/4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-center mb-4">
              Pictures for {selectedUserName}
            </h2>
            <button
              onClick={() => setIsPictureModalVisible(false)}
              className="absolute top-4 right-6 text-xl text-red-600 font-bold"
            >
              X
            </button>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedUserPictures.map((pic) => (
                <div key={pic.id} className="relative">
                  <img
                    src={pic.url}
                    alt={`${pic.userName} - ${pic.pictureType}`}
                    className="w-full h-auto rounded-md cursor-pointer"
                    onClick={() => expandPicture(pic.url)}
                  />
                  <p className="text-center text-sm mt-2">{pic.pictureType}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expanded Picture View */}
      {expandedPicture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <img
            src={expandedPicture}
            alt="Expanded View"
            className="max-w-full max-h-full"
          />
          <button
            onClick={closeExpandedPicture}
            className="absolute top-4 right-6 text-white text-xl"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default Report;
