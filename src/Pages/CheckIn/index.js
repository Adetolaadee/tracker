import React, { useState, useRef } from "react";
import { ReactComponent as GallIcon } from "../../../src/assets/icons/gallery-svgrepo-co.svg";
import { ReactComponent as GalIcon } from "../../../src/assets/icons/gallery-svgrepo-co copy.svg";
import { ReactComponent as UploadIcon } from "../../../src/assets/icons/upload.svg";
import { useDispatch, useSelector } from "react-redux";
import { requestSignIn } from "../../features/user/UserSlice";

const CheckInForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [checkInMessage, setCheckInMessage] = useState(""); // State for check-in message
  const dispatch = useDispatch();
  const { userApproval } = useSelector((state) => state.user);
  const today = new Date().toLocaleDateString(); // Get today's date

  const fileInputRef = useRef(null);
  console.log("userApproval: ", userApproval, selectedFile);

  // Check if already checked in today
  const hasCheckedInToday = localStorage.getItem("checkedInDate") === today;

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    validateFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateFile(file);
  };

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError(
        "Unsupported file type. Please upload a JPG, JPEG, or PNG file."
      );
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("File size exceeds 2MB.");
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
  };

  const token = localStorage.getItem("token");
  console.log(token);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select or drag a picture for check-in.");
      return;
    }

    if (hasCheckedInToday) {
      setCheckInMessage("You have already checked in for today."); // Set the message
      return;
    }

    const formData = new FormData();
    formData.append("checkIn", selectedFile);

    try {
      dispatch(requestSignIn(formData));
      localStorage.setItem("checkedInDate", today); // Store today's date in local storage
      setSelectedFile(null); // Reset the file after submission
      setPreview(null); // Clear the preview
      setCheckInMessage("Check-in successful!"); // Set success message
    } catch (error) {
      console.error("Error during check-in:", error);
      setError(error.response?.data || "Error occurred during check-in.");
      setCheckInMessage(""); // Clear message on error
    }
  };

  return (
    <div>
      {token && (
        <div className="flex flex-col items-center justify-center min-h-screen lg:-mt-20 lg:-ml-32 px-4 md:px-0">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <UploadIcon className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Upload Picture</h2>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-4 mb-4 transition-colors ${
                dragOver ? "bg-orange-50" : "bg-gray-50"
              } flex justify-center items-center`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-28 object-cover mx-auto mb-2"
                  />
                ) : (
                  <div className="h-24 flex flex-col justify-center text-sm">
                    <p>
                      Drag & drop image here or click Browse Image to upload
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 mb-4 text-center">{error}</div>
            )}

            {/* Display the check-in message */}
            {checkInMessage && (
              <div className="text-center mb-4 text-orange-600">
                {checkInMessage}
              </div>
            )}

            <div className="text-center">
              <p className="text-sm mb-2">Supported Media Formats</p>
              <div className="flex justify-center space-x-4">
                <div>
                  <GallIcon />
                  <p className="text-xs text-center">JPG</p>
                </div>
                <div>
                  <GalIcon />
                  <p className="text-xs text-center">PNG</p>
                </div>
                <div>
                  <GallIcon />
                  <p className="text-xs text-center">JPEG</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between space-x-4 mt-6">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="bg-orange-500 text-white w-full py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                Browse Image
              </button>

              <button
                type="button"
                className={`bg-orange-500 text-white w-full py-2 rounded-md ${
                  selectedFile
                    ? "hover:bg-orange-600 transition-colors"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleSubmit}
                disabled={!selectedFile}
              >
                Check In
              </button>
            </div>
          </div>

          {userApproval && (
            <div className="mt-6 bg-green-100 p-4 rounded-lg shadow-lg max-w-xl w-full">
              <h3 className="text-green-800 font-bold">Check-In Successful!</h3>
              <p>Message: {userApproval.message}</p>
              <p>Location: {userApproval?.location}</p>
              <p>Check In: {userApproval?.CheckIn}</p>
              {userApproval?.attendancePicture?.pictureUrl && (
                <img
                  src={userApproval?.attendancePicture?.pictureUrl}
                  alt="Attendance"
                  className="w-32 h-32 object-cover mt-4"
                />
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-100 p-4 rounded-lg shadow-lg max-w-xl w-full">
              <h3 className="text-red-800 font-bold">Error:</h3>
              <p>{typeof error === "string" ? error : JSON.stringify(error)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckInForm;
