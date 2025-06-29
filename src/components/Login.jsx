import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorFirstName, setErrorFirstName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(""); // "success", "error"

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // for error 
  const handleSignUp = async () => {
    try {

      if (!firstName) {
        setErrorFirstName("FirstName required");
        return;
      }
      if (!lastName) {
        setErrorLastName("LastName required");
        return;
      }
      else if (!/\S+@\S+\.\S+/.test(emailId)) {
        setErrorEmail("Invalid email format");
        return;
      }
      else {
        setErrorFirstName("");
        setErrorLastName("");
        setErrorEmail("");

        const res = await axios.post(
          BASE_URL + "/signup",
          { firstName, lastName, emailId, password },
          { withCredentials: true }
        );
        console.log(res.data.data);

        dispatch(addUser(res.data.data));
        // return navigate("/profile");
        return navigate("/terms");

      }




      // const res = await axios.post(
      //   BASE_URL + "/signup",
      //   { firstName, lastName, emailId, password },
      //   { withCredentials: true }
      // );
      // console.log(res.data.data);

      // dispatch(addUser(res.data.data));
      // return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };
  const handleLogin = async () => {
    try {
      console.log("api hit");

      if (!emailId) {
        setErrorEmail("Email ID required");
        return;
      }
      if (!password) {
        setErrorPassword("Password required");
        return;
      }

      else {
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
        return navigate("/");

      }

      // const res = await axios.post(
      //   BASE_URL + "/login",
      //   {
      //     emailId,
      //     password,
      //   },
      //   { withCredentials: true }
      // );
      // dispatch(addUser(res.data));
      // return navigate("/");
    } catch (err) {
      setLoginStatus("error");
      setError(err?.response?.data || "Something went wrong");
    }
  };
  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>
          {!isLoginForm && (
            <>
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">First Name</span>
                </div>
                <input
                  type="text"
                  value={firstName}
                  className={`input input-bordered w-full max-w-xs `}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFirstName(val);

                    // clear the firstname error if the input is valid
                    if (val.trim() !== "") {
                      setErrorFirstName("");
                    }
                  }}
                />
                {errorFirstName && <p style={{ color: "red" }}>{errorFirstName}</p>}
              </label>

              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">Last Name</span>
                </div>
                <input
                  type="text"
                  value={lastName}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => {
                    const val = e.target.value;
                    setLastName(val);
                    // clear the lastname error
                    if (val.trim() !== "") {
                      setErrorLastName("");
                    }
                  }}
                />
                {errorLastName && <p style={{ color: "red" }}>{errorLastName}</p>}
              </label>
            </>
          )}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email ID</legend>
            <input
              type="text"
              value={emailId}
              onChange={(e) => {
                const val = e.target.value;
                setEmailId(val);
                // clear the email error if the input is valid
                if (/\S+@\S+\.\S+/.test(val)) {
                  setErrorEmail("");
                }
              }}
              className="input"
            />
            {errorEmail && <p style={{ color: "red" }}>{errorEmail}</p>}
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
                // clear the password error if the input is valid
                if (val.trim() !== "") {
                  setErrorPassword("");
                }
              }}
            />
            {errorPassword && <p style={{ color: "red" }}>{errorPassword}</p>}
          </fieldset>
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center my-2">
            <button
              className="btn btn-primary"
              onClick={isLoginForm ? handleLogin : handleSignUp}
              Add
              commentMore
              actions
            >
              {isLoginForm ? "Login" : "Sign Up"}
            </button>
          </div>
          <p
            Add
            commentMore
            actions
            className="m-auto cursor-pointer py-2"
            onClick={() => setIsLoginForm((value) => !value)}
          >
            {isLoginForm
              ? "New User? Signup Here"
              : "Existing User? Login Here"}
          </p>

          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      </div>

      {/* Modal */}
      {/* Dialoguebox */}
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

          <h3 className={`text-2xl font-semibold mb-2 ${loginStatus === "success" ? "text-green-600" : "text-red-600"}`}>
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
