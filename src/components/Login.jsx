import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import Dialog from "../utils/Dialog";
import { addForgot } from "../utils/forgotSlice";
const Web_ClientId =
  "627812142753-bde51a0nu2cop3ji87n7qrd3tqlkok9j.apps.googleusercontent.com";
const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(""); // "success", "error"
  const theme = useSelector((state) => state.theme);
  const [dialog, setDialog] = useState({
    status: false,
    isOpen: false,
    title: "",
    message: "",
    onClose: null,
  });
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
        if (res.data.success) {
          if (res.data?.message.length >= 0) {
            dispatch(addUser(res.data?.data));
            navigate("/feed");
          }
        } else {
          setDialog({
            status: false,
            isOpen: true,
            title: "Error",
            message: res?.data,
            onClose: closeDialog,
          });
        }
      }
    } catch (err) {
      console.log("ERROR" + err);
      if (err.response) {
        if (err.response.status === 401) {
          setDialog({
            status: false,
            isOpen: true,
            title: "Unauthorized",
            message:
              "Session expired or unauthorized access. Please login again.",
            onClose: () => {
              closeDialog();
              navigate("/login");
            },
          });
        } else {
          setDialog({
            status: false,
            isOpen: true,
            title: "Error",
            message: err?.response?.data?.error || "Something went wrong!",
            onClose: closeDialog,
          });
        }
      } else {
        setDialog({
          status: false,
          isOpen: true,
          title: "Error",
          message: err?.message || "Unexpected error",
          onClose: closeDialog,
        });
      }
    }
  };
  const handleGoogleLogin = async (token) => {
    try {
      const res = await axios.post(
        BASE_URL + "/google-auth",
        {
          credential: token?.credential,
          client_id: token?.clientId,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        if (res.data?.message.length >= 0) {
          dispatch(addUser(res?.data?.data));
          setDialog({
            status: true,
            isOpen: true,
            title: "Success",
            message: res?.data?.message,
            onClose: () => {
              navigate("/profile");
            },
          });
          console.log(res.data?.message);
        }
      } else {
        setDialog({
          status: false,
          isOpen: true,
          title: "Error",
          message: res?.data?.error,
          onClose: closeDialog,
        });
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setDialog({
            status: false,
            isOpen: true,
            title: "Unauthorized",
            message:
              "Session expired or unauthorized access. Please login again.",
            onClose: () => {
              closeDialog();
              navigate("/login");
            },
          });
        } else {
          setDialog({
            status: false,
            isOpen: true,
            title: "Error",
            message: err?.response?.data?.error,
            onClose: closeDialog,
          });
        }
      } else {
        setDialog({
          status: false,
          isOpen: true,
          title: "Error",
          message: err?.message,
          onClose: closeDialog,
        });
      }
    }
  };
  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };
  return (
    <div className="flex justify-center my-10">
      <div
        className="card bg-base-300  shadow-sm w-76 sm:w-85 md:w-90 lg:w-96 xl:w-[380px]"
        style={{ backgroundColor: theme === "dark" ? "black" : "#DBDBDB" }}
      >
        <div className="card-body flex">
          <h2
            className="card-title justify-center"
            style={{ color: theme === "dark" ? "#ffffff" : "black" }}
          >
            Login
          </h2>

          <fieldset className="fieldset">
            <legend
              className="fieldset-legend"
              style={{ color: theme === "dark" ? "#ffffff" : "black" }}
            >
              Email ID
            </legend>
            <input
              type="text"
              value={emailId}
              style={{
                backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",
                color: theme === "dark" ? "#ffffff" : "black",
              }}
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
            <legend
              className="fieldset-legend"
              style={{ color: theme === "dark" ? "#ffffff" : "black" }}
            >
              Password
            </legend>
            <input
              type="text"
              className="input"
              value={password}
              style={{
                backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",
                color: theme === "dark" ? "#ffffff" : "black",
              }}
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
          <div className="card-actions justify-center my-2">
            <div
              onClick={() => {
                dispatch(addForgot(true));
                navigate("/otpverification");
              }}
              style={{
                color: "blue",
                textDecoration: "underline",
                textAlign: "right",
                alignSelf: "flex-end",
                cursor: "pointer",
              }}
            >
              Forgot Password
            </div>
            <div
              className="btn btn-primary w-63 sm:w-68 md:w-75 lg:w-80"
              onClick={handleLogin}
              style={{ color: theme === "dark" ? "#ffffff" : "black" }}
            >
              Sign In
            </div>
          </div>
          <p
            className="m-auto cursor-pointer py-2"
            onClick={() => navigate("/signup")}
            style={{ color: theme === "dark" ? "#ffffff" : "black" }}
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
                handleGoogleLogin(credentialResponse);
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
      {dialog.isOpen && (
        <Dialog
          status={dialog.status}
          isOpen={dialog.isOpen}
          title={dialog.title}
          message={dialog.message}
          onClose={dialog.onClose}
        />
      )}
    </div>
  );
};

export default Login;
