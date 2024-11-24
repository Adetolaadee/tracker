import React, { useState } from "react";
import { Api } from "../../api/api.config";
import { regions, states } from "../../helper/Location";

const UpdateUser = () => {
  const [selectedState, setSelectedState] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    fetchUsersByState(state);
  };

  const fetchUsersByState = (state) => {
    console.log("Fetching users for state:", state);
    setLoading(true);
    Api.post("/getbyLocation/", { state })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
          setError("");
        } else {
          console.error("Unexpected response format:", response);
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data || "Error fetching users.";
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUserInfo(user);
    setError("");
    setSuccessMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (selectedUser) {
      setLoading(true);
      Api.put(`/updateinfo/${selectedUser._id}`, {
        state: userInfo.state,
        location: userInfo.location,
        phoneNumber: userInfo.phoneNumber,
        role: userInfo.role || undefined,
        accountNumber: userInfo.accountNumber || undefined,
        fullName: userInfo.fullName || undefined,
      })
        .then((response) => {
          setSuccessMessage("User updated successfully!");
          setError("");
        })
        .catch((error) => {
          const errorMessage =
            error.response?.data?.message || "Error updating user.";
          setError(errorMessage);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="update-user-container">
      <h2>Select State</h2>
      <select onChange={handleStateChange} value={selectedState}>
        <option value="">Select a state</option>
        {regions.map((state) => (
          <option key={state.code} value={state.state}>
            {state.state}
          </option>
        ))}
      </select>

      {loading && <p>Loading users...</p>}

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {users.length > 0 && (
        <>
          <h3>Select User</h3>
          <ul>
            {users.map((user) => (
              <li key={user._id} onClick={() => handleUserSelect(user)}>
                {user.fullName}
              </li>
            ))}
          </ul>
        </>
      )}

      {selectedUser && (
        <form onSubmit={handleUpdateUser}>
          <h3>Update User Information</h3>
          <div className="user-info-display">
            <img
              src={selectedUser.profilePicture?.pictureUrl}
              alt="Profile"
              className="profile-pic"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
          </div>
          <input
            type="text"
            name="state"
            value={userInfo.state || ""}
            onChange={handleInputChange}
            placeholder="State"
          />
          <input
            type="text"
            name="location"
            value={userInfo.location || ""}
            onChange={handleInputChange}
            placeholder="Location"
          />
          <input
            type="text"
            name="phoneNumber"
            value={userInfo.phoneNumber || ""}
            onChange={handleInputChange}
            placeholder="Phone Number"
          />
          <input
            type="text"
            name="role"
            value={userInfo.role || ""}
            onChange={handleInputChange}
            placeholder="Staff Role (optional)"
          />
          <input
            type="text"
            name="fullName"
            value={userInfo.fullName || ""}
            onChange={handleInputChange}
            placeholder="Full Name (optional)"
          />
          <input
            type="text"
            name="accountNumber"
            value={userInfo.accountNumber || ""}
            onChange={handleInputChange}
            placeholder="Account Number (optional)"
          />
          <button type="submit" disabled={loading}>
            Update User
          </button>
        </form>
      )}
      <style>{`
        .update-user-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #f9f9f9;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        h2, h3 {
          color: #333;
        }

        select {
          width: 100%;
          padding: 10px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        ul {
          list-style-type: none;
          padding: 0;
        }

        li {
          padding: 10px;
          margin: 5px 0;
          background-color: #e9ecef;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.3s;
        }

        li:hover {
          background-color: #d6d9db;
        }

        .user-info-display {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }

        .profile-pic {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 15px;
          transition: transform 0.3s; 
        }

        input {
          width: calc(100% - 22px);
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        button {
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #0056b3;
        }

        .error-message {
          color: red;
          margin-bottom: 10px;
        }

        .success-message {
          color: green;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default UpdateUser;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllUser } from "../../features/user/UserSlice";

// const AssignLocation = () => {
//   const dispatch = useDispatch();
//   const { users } = useSelector((state) => state.user);

//   useEffect(() => {
//     dispatch(fetchAllUser());
//   });
//   return (
//     <div className="p-4">
//       {users &&
//         users.map((user, index) => (
//           <div key={index} className="flex max-w-xl justify-between px-4">
//             <p>My name</p>
//             <>+</>
//           </div>
//         ))}
//     </div>
//   );
// };

// export default AssignLocation;
