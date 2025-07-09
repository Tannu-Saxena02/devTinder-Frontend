import axios from "axios";
import React, { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
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
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // for error
  function validationFields() {
    let isValid = true;
    console.log("data " + emailId + " " + password);

    if (!emailId || !emailId.trim()) {
      console.log("in email");

      setErrorEmail("Email ID is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailId)) {
      setErrorEmail("Email Id format is invalid");
      isValid = false;
    } else setErrorEmail("");
    if (!password) {
      setErrorPassword("Password is required");
      isValid = false;
    } else setErrorPassword("");
    return isValid;
  }
  const handleLogin = async () => {
    console.log("clicked");

    try {
      if (validationFields()) {
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
      setError("ERROR " + err?.response?.data || "Something went wrong");
    }
  };
  return (
    <div className="flex justify-center my-10">
      <div
        className="card bg-base-300  shadow-sm w-76 sm:w-85 md:w-90 lg:w-96 xl:w-[380px]"
         style={{ backgroundColor: theme === "dark" ? "black" : "#DBDBDB" }}
      >
        <div className="card-body">
          <h2 className="card-title justify-center"
          style={{ color: theme === "dark" ? "#ffffff" : "black"}}
          >Login</h2>

          <fieldset className="fieldset">
            <legend className="fieldset-legend"  style={{ color: theme === "dark" ? "#ffffff" : "black"}}>Email ID</legend>
            <input
              type="text"
              value={emailId}
              style={{ backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",color: theme === "dark" ? "#ffffff" : "black"}}
              onChange={(e) => {
                const val = e.target.value;
                setEmailId(val);
                if (!val || !val.trim()) {
                  setErrorEmail("Email Id is required");
                } else if (!/\S+@\S+\.\S+/.test(val)) {
                  setErrorEmail("Email Id format is invalid");
                } else setErrorEmail("");
              }}
              className="input"
            />
            {errorEmail && (
              <p style={{ color: "red", fontSize: 11 }}>{errorEmail}</p>
            )}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend"
             style={{ color: theme === "dark" ? "#ffffff" : "black"}}>Password</legend>
            <input
              type="text"
              className="input"
              value={password}
              style={{ backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",color: theme === "dark" ? "#ffffff" : "black"}}
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
              className="btn btn-primary w-63 sm:w-68 md:w-75 lg:w-80"
              onClick={handleLogin}
              style={{color: theme === "dark" ? "#ffffff" : "black"}}
            >
              Sign In
            </div>
          </div>
          <p
            Add
            commentMore
            actions
            className="m-auto cursor-pointer py-2"
            onClick={() => navigate("/signup")}
             style={{ color: theme === "dark" ? "#ffffff" : "black"}}
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
