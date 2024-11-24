import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Api } from "../../api/api.config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ReactComponent as BouncerSpinner } from "../../assets/icons/bouncerSpinner.svg";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    passWord: "",
  });
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "password") {
      setLoginData({
        ...loginData,
        passWord: e.target.value,
      });
    } else {
      setLoginData({
        ...loginData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login submission
    if (!submitting) {
      setSubmitting(true);
      Api.post("/login", loginData)
        .then((response) => {
          console.log("response", response);
          const { data } = response.data;

          localStorage.setItem("token", data.userToken);
          localStorage.setItem("isAdmin", data.isAdmin);
          localStorage.setItem("userEmail", data.email);
          console.log(data);
          navigate("/dashboard");
          handleReload();
          console.log(response);
          setSubmitting(false);
        })
        .catch((error) => {
          console.error(error);
          setSubmitting(false);
          toast.error(error?.response?.data?.message);
        });
      console.log("Login form submitted", loginData);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              value={loginData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={loginData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-orange-500"
              />

              <span
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-600" />
                ) : (
                  <FaEye className="text-gray-600" />
                )}
              </span>
            </div>
          </div>

          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-orange-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-4 py-3 px-4 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
          >
            <div className="flex gap-4 items-center">
              {submitting && <BouncerSpinner width={28} height={28} />}

              {submitting ? <></> : <p>Login</p>}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
