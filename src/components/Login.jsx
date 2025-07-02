import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(""); // "success", "error"

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // for error

  const handleLogin = async () => {
    try {
      if (!emailId) {
        setErrorEmail("Email ID is required");
      }
      if (!password) {
        setErrorPassword("Password is required");
      } else {
        setErrorEmail("");
        setErrorPassword("");
        const res = await axios.post(
          BASE_URL + "/login",
          {
            emailId,
            password,
          },
          { withCredentials: true }
        );
        dispatch(addUser(res.data));
        setLoginStatus("success");
        return navigate("/feed");
      }
    } catch (err) {
      setLoginStatus("error");
      setError(err?.response?.data || "Something went wrong");
    }
  };
  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300  shadow-sm w-76 sm:w-85 md:w-90 lg:w-96 xl:w-[380px]
">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email ID</legend>
            <input
              type="text"
              value={emailId}
              onChange={(e) => {
                const val = e.target.value;
                setEmailId(val);
                if (/\S+@\S+\.\S+/.test(val)) {
                  setErrorEmail("");
                }
              }}
              className="input"
            />
            {errorEmail && (
              <p style={{ color: "red", fontSize: 11 }}>{errorEmail}</p>
            )}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="text"
              className="input"
              value={password}
              onChange={(e) => {
                const val = e.target.value;
                setPassword(val);
                if (val.trim() !== "") {
                  setErrorPassword("");
                }
              }}
            />
            {errorPassword && (
              <p style={{ color: "red", fontSize: 11 }}>{errorPassword}</p>
            )}
          </fieldset>
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center my-2">
            <div 

            className="btn btn-primary w-63 sm:w-68 md:w-75 lg:w-80" onClick={handleLogin}>
              Sign Up
            </div>
          </div>
          <p
            Add
            commentMore
            actions
            className="m-auto cursor-pointer py-2"
            onClick={() => navigate("/signup")}
          >
            New User? Signup Here
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
              theme="filled_blue" // or 'filled_blue', 'filled_black'
              size="large"
              text="signin_with"
              width="100"
            />
          </div>
        </div>
      </div>

      <input
        type="checkbox"
        id="login-modal"
        className="modal-toggle"
        checked={loginStatus !== ""}
        readOnly
      />
      <div className="modal">
        <div className="modal-box rounded-3xl border shadow-lg p-6 bg-base-100 text-center">
          <div className="flex justify-center mb-4">
            {loginStatus === "success" ? (
              <div className="text-green-500 text-5xl">✅</div>
            ) : (
              <div className="text-red-500 text-5xl">❌</div>
            )}
          </div>

          <h3
            className={`text-2xl font-semibold mb-2 ${
              loginStatus === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {loginStatus === "success" ? "Login Successful" : "Login Failed"}
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            {loginStatus === "success"
              ? "Welcome back! Redirecting you to your profile..."
              : "Oops! The email or password you entered is incorrect."}
          </p>

          <div className="modal-action flex justify-center">
            <label
              htmlFor="login-modal"
              className="btn btn-sm px-6 rounded-full btn-outline"
              onClick={() => {
                setLoginStatus("");
                if (loginStatus === "success") navigate("/profile");
              }}
            >
              Close
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
