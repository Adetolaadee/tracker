import React, { useState } from "react";
import { Api } from "../../api/api.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ReactComponent as BouncerSpinner } from "../../assets/icons/bouncerSpinner.svg";
import { states, locationsByState, regions } from "../../helper/Location"; // Updated import

const CreateAccountPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    state: "",
    location: "",
    identification: null,
    profilePicture: null,
    role: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [isNameEmpty, setIsNameEmpty] = useState(false);
  const [selectStateIndex, setSelectStateIndex] = useState(0);
  const [selectStateName, setSelectStateName] = useState("");
  const [availableLocations, setAvailableLocations] = useState([]);
  const navigate = useNavigate();

  const {
    fullName,
    phoneNumber,
    email,
    password,
    bankName,
    accountNumber,
    accountName,
    state,
    location,
    identification,
    profilePicture,
    role,
  } = formData;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });

    // Update available locations based on selected state
    if (name === "state") {
      const selectedLocations = locationsByState[value] || [];
      setAvailableLocations(selectedLocations);
      setFormData((prev) => ({ ...prev, location: "" })); // Reset location if state changes
      setSelectStateIndex(regions.findIndex((st) => st.state === value));
      setSelectStateName(value);
    }
  };

  const handleBlur = (name) => {
    if (name === "fullName" && fullName.length === 0) {
      setIsNameEmpty(true);
    } else {
      setIsNameEmpty(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submitting) {
      setSubmitting(true);

      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          form.append(key, formData[key]);
        }
      });

      if (fullName !== accountName) {
        setSubmitting(false);
        return toast.error("Full name and account name must be the same");
      }

      try {
        const response = await Api.post("/signup", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setFormData({
          fullName: "",
          phoneNumber: "",
          email: "",
          password: "",
          bankName: "",
          accountNumber: "",
          accountName: "",
          state: "",
          location: "",
          identification: null,
          profilePicture: null,
          role: "",
        });
        navigate("/Loginpage");
      } catch (error) {
        console.error("Signup failed", error);
        toast.error(error?.response?.data?.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Define the input fields
  const inputFields = [
    {
      label: "Full Name",
      name: "fullName",
      type: "text",
      placeholder: "Enter your full name",
    },
    {
      label: "Phone Number",
      name: "phoneNumber",
      type: "tel",
      placeholder: "Enter your phone number",
      pattern: "[0-9]{10}",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter your email",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Enter your password",
    },
    {
      label: "Account Number",
      name: "accountNumber",
      type: "text",
      placeholder: "Enter your 10-digit account number",
      pattern: "[0-9]{10}",
    },
    {
      label: "Account Name",
      name: "accountName",
      type: "text",
      placeholder: "Enter your account name",
    },
  ];

  // List of banks in Nigeria
  const banksInNigeria = [
    "Access Bank",
    "First Bank",
    "GTBank",
    "UBA",
    "Zenith Bank",
    "Fidelity Bank",
    "Union Bank",
    "Stanbic IBTC Bank",
    "Sterling Bank",
    "EcoBank",
    "Polaris Bank",
    "Wema Bank",
    "Heritage Bank",
    "Opay",
    "Moniepoint",
    "Palmpay",
    "Kuda",
    "Warpspeed",
    "FairMoney",
  ];

  // Roles available for selection
  const roles = [
    "sampler",
    "cader",
    "mapper",
    "Ftd",
    "Cdp",
    "Tde",
    "Merchandiser",
    "Bre",
    "Ime",
    "Sme",
    "Fme",
    "Cee",
    "Vss",
    "Nomad",
    "Manager",
  ];
  console.log(
    "region formData ",
    regions.location,
    regions,
    "type of ",
    typeof regions.location
  );
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {inputFields.map(({ label, name, type, placeholder, pattern }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="flex justify-between items-center text-gray-700 font-medium"
              >
                {label}
                <span className="text-red-500">*</span>
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                onBlur={() => handleBlur(name)}
                required
                placeholder={placeholder}
                pattern={pattern}
                className={`w-full px-4 py-2 border ${
                  name === "fullName" && isNameEmpty
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {name === "fullName" && isNameEmpty && (
                <p className="text-red-500 text-xs">Name is Required</p>
              )}
            </div>
          ))}

          {/* Add State Select */}
          <div className="max-w-md mx-auto">
            <label
              htmlFor="state"
              className="flex justify-between items-center text-gray-700 font-medium"
            >
              State
              <span className="text-red-500">*</span>
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="block w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 overflow-hidden"
              style={{ maxWidth: "100%" }} // Ensure it doesn't exceed the parent's width
            >
              <option value="">Select your state</option>
              {regions.map((region, index) => (
                <option key={index} value={region.state}>
                  {region.state}
                </option>
              ))}
            </select>
          </div>

          {/* Add Location Select */}
          <div>
            <label
              htmlFor="location"
              className="block text-gray-700 font-medium"
            >
              Location
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="" disabled>
                Select your location
              </option>
              {regions &&
                regions.map((region, index) => (
                  <>
                    {region &&
                      region.state === selectStateName &&
                      region.location &&
                      Array.isArray(region.location) &&
                      region.location.map((location, index) => (
                        <option key={index} value={location}>
                          {location}
                        </option>
                      ))}
                  </>
                ))}
            </select>
          </div>

          {/* Add Bank Select */}
          <div>
            <label
              htmlFor="bankName"
              className="flex justify-between items-center text-gray-700 font-medium"
            >
              Bank Name
              <span className="text-red-500">*</span>
            </label>
            <select
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="" disabled>
                Select your bank
              </option>
              {banksInNigeria.map((bank, index) => (
                <option key={index} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          {/* Add Role Select */}
          <div>
            <label
              htmlFor="role"
              className="flex justify-between items-center text-gray-700 font-medium"
            >
              Role
              <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="" disabled>
                Select your role
              </option>
              {roles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Add File Uploads */}
          <div>
            <label
              htmlFor="identification"
              className="flex justify-between items-center text-gray-700 font-medium"
            >
              Identification (ID)
              <span className="text-red-500">*</span>
            </label>
            <input
              id="identification"
              name="identification"
              type="file"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="profilePicture"
              className="flex justify-between items-center text-gray-700 font-medium"
            >
              Profile Picture
            </label>
            <input
              id="profilePicture"
              name="profilePicture"
              type="file"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {submitting ? (
              <BouncerSpinner className="animate-spin h-5 w-5 text-white" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountPage;

// import React, { useState } from "react";
// import { Api } from "../../api/api.config";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { ReactComponent as BouncerSpinner } from "../../assets/icons/bouncerSpinner.svg";

// const CreateAccountPage = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     phoneNumber: "",
//     email: "",
//     password: "",
//     bankName: "",
//     accountNumber: "",
//     accountName: "",
//     state: "",
//     location: "",
//     identification: null,
//     profilePicture: null,
//     role: "",
//   });

//   const {
//     fullName,
//     phoneNumber,
//     email,
//     password,
//     bankName,
//     accountNumber,
//     accountName,
//     state,
//     location,
//     identification,
//     profilePicture,
//     role,
//   } = formData;
//   const [submitting, setSubmitting] = useState(false);
//   const [isNameEmpty, setIsNameEmpty] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: files ? files[0] : value,
//     });
//   };

//   const handleBlur = (e, name) => {
//     if (name === "fullName" && fullName.length === 0) {
//       setIsNameEmpty(true);
//     } else {
//       setIsNameEmpty(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!submitting) {
//       setSubmitting(true);

//       const form = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (formData[key] !== null && formData[key] !== undefined) {
//           form.append(key, formData[key]);
//         }
//       });
//       if (formData.fullName !== formData.accountName) {
//         setSubmitting(false);
//         return toast.error("Full name and account name must be the same");
//       }
//       try {
//         const response = await Api.post("/signup", form, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         console.log("Signup successful", response.data);
//         setFormData({
//           fullName: "",
//           phoneNumber: "",
//           email: "",
//           password: "",
//           bankName: "",
//           accountNumber: "",
//           accountName: "",
//           state: "",
//           location: "",
//           identification: null,
//           profilePicture: null,
//           role: "",
//         });
//         navigate("/Loginpage");
//       } catch (error) {
//         console.error("Signup failed", error);
//         if (error.response) {
//           const errorCode = error.response.status;
//           console.error(`Problem occurred. Received status: ${errorCode}`);
//           console.error("Error details:", error.response.data);
//           toast.error(error?.response?.data?.message);
//         } else {
//           console.error("Did not receive response");
//         }
//       } finally {
//         setSubmitting(false);
//       }
//     }
//   };

//   const banksInNigeria = [
//     "AccessBank",
//     "FirstBank",
//     "GTBank",
//     "UBA",
//     "ZenithBank",
//     "FidelityBank",
//     "UnionBank",
//     "StanbicIBTCBank",
//     "Sterling Bank",
//     "EcoBank",
//     "PolarisBank",
//     "WemaBank",
//     "HeritageBank",
//     "Opay",
//     "Moniepoint",
//     "Palmpay",
//     "Kuda",
//     "Warpspeed",
//     "FairMoney",
//   ];

//   const roles = [
//     "sampler",
//     "cader",
//     "mapper",
//     "Ftd",
//     "Cdp",
//     "Tde",
//     "Merchandiser",
//     "Bre",
//     "Ime",
//     "Sme",
//     "Fme",
//     "Cee",
//     "Vss",
//     "Nomad",
//     "Manager",
//   ];

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
//           Create Account
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {[
//             {
//               label: "Full Name",
//               name: "fullName",
//               type: "text",
//               placeholder: "Enter your full name",
//             },
//             {
//               label: "Phone Number",
//               name: "phoneNumber",
//               type: "tel",
//               placeholder: "Enter your phone number",
//               pattern: "\\d{11}",
//             },
//             {
//               label: "Email",
//               name: "email",
//               type: "email",
//               placeholder: "Enter your email address",
//             },
//             {
//               label: "Password",
//               name: "password",
//               type: "password",
//               placeholder: "Enter your password",
//             },
//             {
//               label: "Account Number",
//               name: "accountNumber",
//               type: "text",
//               placeholder: "Enter your 10-digit account number",
//               pattern: "\\d{10}",
//             },
//             {
//               label: "Account Name",
//               name: "accountName",
//               type: "text",
//               placeholder: "Enter the account holder name",
//             },
//             {
//               label: "State",
//               name: "state",
//               type: "text",
//               placeholder: "Enter your state of residence",
//             },
//             {
//               label: "Location",
//               name: "location",
//               type: "text",
//               placeholder: "Enter your city/town",
//             },
//           ].map(({ label, name, type, placeholder, pattern }) => (
//             <div key={name}>
//               <label
//                 htmlFor={name}
//                 className="flex justify-between items-center text-gray-700 font-medium "
//               >
//                 {label}
//                 <div className="text-red-500">*</div>
//               </label>
//               <input
//                 id={name}
//                 name={name}
//                 type={type}
//                 value={formData[name]}
//                 onChange={handleChange}
//                 onBlur={(e) => handleBlur(e, name)}
//                 required
//                 placeholder={placeholder}
//                 pattern={pattern}
//                 className={`w-full px-4 py-2 border ${
//                   name === "fullName" && isNameEmpty
//                     ? "border-red-500"
//                     : "border-gray-300"
//                 } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-orange-500`}
//               />
//               {name === "fullName" && isNameEmpty && (
//                 <p className="text-red-500 text-xs">Name is Required</p>
//               )}
//             </div>
//           ))}
//           <div>
//             <label
//               htmlFor="bankName"
//               className="block text-gray-700 font-medium"
//             >
//               Bank Name
//             </label>
//             <select
//               id="bankName"
//               name="bankName"
//               value={formData.bankName}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-orange-500"
//             >
//               <option value="" disabled>
//                 Select your bank
//               </option>
//               {banksInNigeria.map((bank) => (
//                 <option key={bank} value={bank}>
//                   {bank}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="role" className="block text-gray-700 font-medium">
//               Role
//             </label>
//             <select
//               id="role"
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-orange-500"
//             >
//               <option value="" disabled>
//                 Select your role
//               </option>
//               {roles.map((role) => (
//                 <option key={role} value={role}>
//                   {role}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label
//               htmlFor="identification"
//               className="block text-gray-700 font-medium"
//             >
//               Identification Document
//             </label>
//             <input
//               id="identification"
//               name="identification"
//               type="file"
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-orange-500"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="profilePicture"
//               className="block text-gray-700 font-medium"
//             >
//               Profile Picture
//             </label>
//             <input
//               id="profilePicture"
//               name="profilePicture"
//               type="file"
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-orange-500"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={submitting}
//             className={`w-full px-4 py-2 font-bold text-white bg-orange-600 rounded-md shadow hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
//               submitting ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {submitting ? (
//               <BouncerSpinner className="animate-spin h-5 w-5 text-white mx-auto" />
//             ) : (
//               "Create Account"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateAccountPage;
