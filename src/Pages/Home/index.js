import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ] px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-orange-600 mb-6 text-center">
        Welcome to Attendance App
      </h1>
      <p className="text-base md:text-lg text-gray-700 mb-8 text-center max-w-lg">
        Keep track of your attendance effortlessly and efficiently.
      </p>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <Link
          to="/loginpage"
          className="py-2 px-6 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
