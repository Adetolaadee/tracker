import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  FaHome,
  FaSignInAlt,
  FaClipboardList,
  FaCheckCircle,
  FaFileAlt,
  FaUserShield,
  FaDoorOpen,
  FaSignOutAlt, // This import can be kept if you use it
} from "react-icons/fa";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Reusable NavLink component
  const SidebarLink = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "bg-white flex items-center space-x-2 p-2 text-orange-600 font-semibold block p-2 rounded-lg shadow-md"
          : "flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-500 transition duration-200"
      }
      onClick={closeSidebar}
    >
      <Icon />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-orange-600 text-white p-4 flex justify-between items-center lg:hidden shadow-md">
        <div className="text-2xl font-bold">
          <NavLink to="/">Attendance App</NavLink>
        </div>
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </header>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:static lg:translate-x-0 inset-y-0 left-0 w-64 bg-orange-600 text-white p-4 shadow-lg lg:flex-shrink-0 transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="hidden md:block text-2xl font-bold mb-6">
            <NavLink to="/" onClick={closeSidebar}>
              Attendance App
            </NavLink>
          </div>

          {/* Navigation links */}
          <ul className="space-y-2">
            <li>
              <SidebarLink to="/dashboard" icon={FaHome} label="Dashboard" />
            </li>
            {isAdmin && isAdmin === "false" && (
              <li>
                <SidebarLink
                  to="/checkin"
                  icon={FaCheckCircle}
                  label="Check-in"
                />
              </li>
            )}
            {isAdmin && isAdmin === "false" && (
              <li>
                <SidebarLink
                  to="/checkout"
                  icon={FaDoorOpen}
                  label="Check-out"
                />
              </li>
            )}
            {isAdmin && isAdmin === "true" && (
              <li>
                <SidebarLink to="/admin" icon={FaUserShield} label="Admin" />
              </li>
            )}
            {isAdmin && isAdmin === "true" && (
              <li>
                <SidebarLink to="/report" icon={FaFileAlt} label="Report" />
              </li>
            )}
            {!token && (
              <>
                <li>
                  <SidebarLink
                    to="/loginpage"
                    icon={FaSignInAlt}
                    label="Login"
                  />
                </li>
                <li>
                  <SidebarLink
                    to="/signup"
                    icon={FaClipboardList}
                    label="Sign Up"
                  />
                </li>
              </>
            )}

            {token && ( // Render Logout Link if the user is logged in
              <li>
                <SidebarLink
                  to="/logout" // Update this route according to your application
                  icon={FaSignOutAlt}
                  label="Logout"
                />
              </li>
            )}
          </ul>
        </aside>

        {/* Main content */}
        <main
          className={`flex-grow transition-all ease-in-out duration-500 ${
            isSidebarOpen ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4 mt-auto shadow-md">
        <p>
          &copy; {new Date().getFullYear()} Attendance App. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
