// import React, { useEffect, useState } from "react";
// import { Api } from "../../api/api.config";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllUser } from "../../features/user/UserSlice";

// const AllAccounts = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [actionMessage, setActionMessage] = useState("");
//   const [showRejectionModal, setShowRejectionModal] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [selectedAccountId, setSelectedAccountId] = useState(null);
//   const dispatch = useDispatch();
//   const { users } = useSelector((state) => state.user);
//   console.log("all users: ", users.data);
//   const token = localStorage.getItem("authToken"); // this to Fetch token securely

//   useEffect(() => {
//     const fetchAccounts = async () => {
//       try {
//         dispatch(fetchAllUser(token));
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load accounts.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAccounts();
//   }, [dispatch]);

//   const handleAction = async (accountId, action) => {
//     if (action === "reject" && !rejectionReason) {
//       setShowRejectionModal(true);
//       setSelectedAccountId(accountId);
//       return;
//     }

//     const payload = {
//       status: action,
//       reasons: action === "rejected" ? rejectionReason : null,
//     };

//     try {
//       const response = await Api.put(`/approve/${accountId}`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.status === 200) {
//         setActionMessage(`Account has been ${action}.`);
//         setRejectionReason("");
//         setSelectedAccountId(null);

//         const updatedResponse = await Api.get("/allaccounts", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setAccounts(updatedResponse.data.data);
//       }
//     } catch (err) {
//       console.error("Error updating account status:", err);
//       setActionMessage(
//         err.response?.data?.message ||
//           "An error occurred while updating the account status."
//       );
//     }
//   };

//   if (loading) {
//     return <div className="text-center text-gray-500">Loading accounts...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   if (users && users.data && users.data.length === 0) {
//     return <div className="text-center text-gray-500">No accounts found.</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-center mb-6">
//         Account List for Approval
//       </h1>
//       {actionMessage && (
//         <div className="text-center text-green-500 mb-4">{actionMessage}</div>
//       )}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {users &&
//           users.data &&
//           users.data.map((account) => (
//             <div
//               key={account._id}
//               className="bg-white shadow-md rounded-lg p-4"
//             >
//               <div className="flex items-center space-x-4 mb-4">
//                 <img
//                   src={
//                     account.profilePicture?.pictureUrl ||
//                     "https://via.placeholder.com/100"
//                   }
//                   alt="Profile-pics"
//                   className="w-16 h-16 rounded-full"
//                 />
//                 <div>
//                   <h2 className="text-xl font-semibold">{account.fullName}</h2>
//                   <p className="text-gray-600">{account.role}</p>
//                 </div>
//               </div>
//               <p className="text-sm">
//                 <strong>Email:</strong> {account.email}
//               </p>
//               <p className="text-sm">
//                 <strong>Phone:</strong> {account.phoneNumber}
//               </p>
//               <p className="text-sm">
//                 <strong>Location:</strong> {account.location}, {account.state}
//               </p>
//               <p className="text-sm">
//                 <strong>Bank:</strong> {account.bankName}
//               </p>
//               <p className="text-sm">
//                 <strong>Account No:</strong> {account.accountNumber}
//               </p>
//               <p className="text-sm">
//                 <strong>Account Name:</strong> {account.accountName}
//               </p>
//               <div className="flex space-x-2 mt-4">
//                 <button
//                   onClick={() => handleAction(account._id, "approved")}
//                   className="bg-green-500 text-white px-4 py-2 rounded-md"
//                 >
//                   Approve
//                 </button>
//                 <button
//                   onClick={() => handleAction(account._id, "reject")}
//                   className="bg-red-500 text-white px-4 py-2 rounded-md"
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//       </div>

//       {showRejectionModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
//           <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
//             <h2 className="text-xl font-semibold mb-4">Reject Account</h2>
//             <label className="block text-gray-700 mb-2">
//               Reason for rejection:
//             </label>
//             <textarea
//               value={rejectionReason}
//               onChange={(e) => setRejectionReason(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               rows="4"
//             />
//             <div className="flex justify-end mt-4 space-x-2">
//               <button
//                 onClick={() => setShowRejectionModal(false)}
//                 className="bg-gray-300 text-black px-4 py-2 rounded-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   handleAction(selectedAccountId, "rejected");
//                   setShowRejectionModal(false);
//                 }}
//                 className="bg-red-500 text-white px-4 py-2 rounded-md"
//               >
//                 Submit Rejection
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllAccounts;

import React, { useEffect, useState } from "react";
import { Api } from "../../api/api.config";
import { useDispatch, useSelector } from "react-redux";
import {
  allUserWaitingApproval,
  approvalUser,
  fetchAllUser,
} from "../../features/user/UserSlice";

const ApproveUser = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const dispatch = useDispatch();
  const { users, pendingUsers } = useSelector((state) => state.user);

  const token = localStorage.getItem("token"); // this to Fetch token securely

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        dispatch(allUserWaitingApproval()).then((res) => console.log(" "));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load accounts.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [dispatch]);

  const handleAction = async (accountId, action) => {
    if (action === "reject" && !rejectionReason) {
      setShowRejectionModal(true);
      setSelectedAccountId(accountId);
      return;
    }
    // console.log("action ", action);
    const approveData = {
      status: action,
      reasons: action === "rejected" ? rejectionReason : null,
    };

    try {
      const dataApproval = {
        approveData,
        accountId,
      };
      dispatch(approvalUser(dataApproval)).then((response) => {
        console.log("approval status ", response);
        if (response.status === 200) {
          // setActionMessage(`Account has been ${action}.`);
          // setRejectionReason("");
          // setSelectedAccountId(null);
          // const updatedResponse = await Api.get("/allaccounts", {
          //   headers: { Authorization: `Bearer ${token}` },
          // });
          // setAccounts(updatedResponse.data.data);
        }
      });
    } catch (err) {
      console.error("Error updating account status:", err);
      setActionMessage(
        err.response?.data?.message ||
          "An error occurred while updating the account status."
      );
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading accounts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (pendingUsers && pendingUsers.length === 0) {
    return <div className="text-center text-gray-500">No accounts found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">
        Account List for Approval
      </h1>
      {actionMessage && (
        <div className="text-center text-green-500 mb-4">{actionMessage}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingUsers &&
          pendingUsers.map((account) => (
            <div
              key={account._id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={
                    account.profilePicture?.pictureUrl ||
                    "https://via.placeholder.com/100"
                  }
                  alt="Profile-pics"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold">{account.fullName}</h2>
                  <p className="text-gray-600">{account.role}</p>
                </div>
              </div>
              <p className="text-sm">
                <strong>Email:</strong> {account.email}
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> {account.phoneNumber}
              </p>
              <p className="text-sm">
                <strong>Location:</strong> {account.location}, {account.state}
              </p>
              <p className="text-sm">
                <strong>Bank:</strong> {account.bankName}
              </p>
              <p className="text-sm">
                <strong>Account No:</strong> {account.accountNumber}
              </p>
              <p className="text-sm">
                <strong>Account Name:</strong> {account.accountName}
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleAction(account._id, "approved")}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(account._id, "reject")}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
      </div>

      {showRejectionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Reject Account</h2>
            <label className="block text-gray-700 mb-2">
              Reason for rejection:
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAction(selectedAccountId, "rejected");
                  setShowRejectionModal(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveUser;
