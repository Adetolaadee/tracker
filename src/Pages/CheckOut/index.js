import React, { useState, useRef } from "react";
import { ReactComponent as UploadIcon } from "../../../src/assets/icons/upload.svg"; // Ensure this SVG is correct
import { useDispatch, useSelector } from "react-redux";
import { requestSignOut } from "../../features/user/UserSlice";

const CheckOutForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();
  const { userApproval } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

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

  const isCheckOutAllowed = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    return currentHour >= 17 && currentHour <= 23; // Check if current time is between 5 PM and 11:59 PM
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select or drag a picture for check-out.");
      return;
    }

    if (!isCheckOutAllowed()) {
      alert("Check-out is only allowed between 5:00 PM and 11:59 PM.");
      return;
    }

    const formData = new FormData();
    formData.append("checkOut", selectedFile);

    try {
      const result = await dispatch(requestSignOut(formData));
      if (result.meta.requestStatus === "fulfilled") {
        setResponse(result.payload); // Assuming the response from API comes here
        setSelectedFile(null); // Reset the file after submission
        setPreview(null); // Clear the preview
      }
    } catch (error) {
      console.error("Error during check-out:", error);
      setError(error.response?.data || "Error occurred during check-out.");
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
                Check Out
              </button>
            </div>
          </div>

          {userApproval && (
            <div className="mt-6 bg-green-100 p-4 rounded-lg shadow-lg max-w-xl w-full">
              <h3 className="text-green-800 font-bold">
                Check-Out Successful!
              </h3>
              <p>Message: {userApproval.message}</p>
              <p>Location: {userApproval?.location}</p>
              <p>Check Out: {userApproval?.CheckOut}</p>
              <p>Recommended Rating: {response?.recommendedRating}</p>
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

export default CheckOutForm;

// import React, { useState, useRef } from "react";
// import { ReactComponent as UploadIcon } from "../../../src/assets/icons/upload.svg"; // Ensure this SVG is correct
// import { useDispatch, useSelector } from "react-redux";
// import { requestSignOut } from "../../features/user/UserSlice";

// const CheckOutForm = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState(null);
//   const [dragOver, setDragOver] = useState(false);
//   const [preview, setPreview] = useState(null);
//   const dispatch = useDispatch();
//   const { userApproval } = useSelector((state) => state.user);
//   const fileInputRef = useRef(null);
//   const token = localStorage.getItem("token");

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setDragOver(true);
//   };

//   const handleDragLeave = () => {
//     setDragOver(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragOver(false);
//     const file = e.dataTransfer.files[0];
//     validateFile(file);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     validateFile(file);
//   };

//   const validateFile = (file) => {
//     const validTypes = ["image/jpeg", "image/png", "image/jpg"];
//     if (!validTypes.includes(file.type)) {
//       setError(
//         "Unsupported file type. Please upload a JPG, JPEG, or PNG file."
//       );
//       return;
//     }
//     if (file.size > 2 * 1024 * 1024) {
//       setError("File size exceeds 2MB.");
//       return;
//     }
//     setSelectedFile(file);
//     setPreview(URL.createObjectURL(file));
//     setError(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedFile) {
//       alert("Please select or drag a picture for check-out.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("checkOut", selectedFile);

//     try {
//       const result = await dispatch(requestSignOut(formData));
//       if (result.meta.requestStatus === "fulfilled") {
//         setResponse(result.payload); // Assuming the response from API comes here
//         setSelectedFile(null); // Reset the file after submission
//         setPreview(null); // Clear the preview
//       }
//     } catch (error) {
//       console.error("Error during check-out:", error);
//       setError(error.response?.data || "Error occurred during check-out.");
//     }
//   };

//   return (
//     <div>
//       {token && (
//         <div className="flex flex-col items-center justify-center min-h-screen lg:-mt-20 lg:-ml-32 px-4 md:px-0">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
//             <div className="text-center">
//               <div className="flex justify-center mb-2">
//                 <UploadIcon className="w-10 h-10" />
//               </div>
//               <h2 className="text-2xl font-semibold mb-4">Upload Picture</h2>
//             </div>

//             <div
//               className={`border-2 border-dashed rounded-lg p-4 mb-4 transition-colors ${
//                 dragOver ? "bg-orange-50" : "bg-gray-50"
//               } flex justify-center items-center`}
//               onDragOver={handleDragOver}
//               onDragLeave={handleDragLeave}
//               onDrop={handleDrop}
//             >
//               <div className="text-center">
//                 {preview ? (
//                   <img
//                     src={preview}
//                     alt="Preview"
//                     className="h-28 object-cover mx-auto mb-2"
//                   />
//                 ) : (
//                   <div className="h-24 flex flex-col justify-center text-sm">
//                     <p>
//                       Drag & drop image here or click Browse Image to upload
//                     </p>
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </div>
//             </div>

//             {error && (
//               <div className="text-red-600 mb-4 text-center">{error}</div>
//             )}

//             <div className="flex justify-between space-x-4 mt-6">
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current.click()}
//                 className="bg-orange-500 text-white w-full py-2 rounded-md hover:bg-orange-600 transition-colors"
//               >
//                 Browse Image
//               </button>

//               <button
//                 type="button"
//                 className={`bg-orange-500 text-white w-full py-2 rounded-md ${
//                   selectedFile
//                     ? "hover:bg-orange-600 transition-colors"
//                     : "opacity-50 cursor-not-allowed"
//                 }`}
//                 onClick={handleSubmit}
//                 disabled={!selectedFile}
//               >
//                 Check Out
//               </button>
//             </div>
//           </div>

//           {userApproval && (
//             <div className="mt-6 bg-green-100 p-4 rounded-lg shadow-lg max-w-xl w-full">
//               <h3 className="text-green-800 font-bold">
//                 Check-Out Successful!
//               </h3>
//               <p>Message: {userApproval.message}</p>
//               <p>Location: {userApproval?.location}</p>
//               <p>Check Out: {userApproval?.CheckOut}</p>
//               <p>Recommended Rating: {response?.recommendedRating}</p>
//               {userApproval?.attendancePicture?.pictureUrl && (
//                 <img
//                   src={userApproval?.attendancePicture?.pictureUrl}
//                   alt="Attendance"
//                   className="w-32 h-32 object-cover mt-4"
//                 />
//               )}
//             </div>
//           )}

//           {error && (
//             <div className="mt-6 bg-red-100 p-4 rounded-lg shadow-lg max-w-xl w-full">
//               <h3 className="text-red-800 font-bold">Error:</h3>
//               <p>{typeof error === "string" ? error : JSON.stringify(error)}</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckOutForm;
