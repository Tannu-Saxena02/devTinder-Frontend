import React, { useState } from "react";
import Dialog from "../utils/Dialog";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({
    status: false,
    isOpen: false,
    title: "",
    message: "",
    onClose: null,
  });
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme);
  const isForgot = useSelector((state) => state.forgot);
  function validationFields() {
    let isValid = true;

    // Reset previous errors
    setPasswordError("");
    setConfirmPasswordError("");

    if (!password) {
      setPasswordError(
        isForgot ? "Password is required" : "Old Password is required"
      );
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError(
        isForgot ? "Confirm Password is required" : "New Password is required"
      );
      isValid = false;
    }
    if (password && confirmPassword) {
      if (isForgot && password !== confirmPassword) {
        setPasswordError("Passwords must match");
        setConfirmPasswordError("Passwords must match");
        isValid = false;
      }

      if (!isForgot && password === confirmPassword) {
        setPasswordError("Old and new passwords must be different");
        setConfirmPasswordError("Old and new passwords must be different");
        isValid = false;
      }
    }

    return isValid;
  }

  async function handleForgot() {
    try {
      if (validationFields()) {
        setLoading(true);
        const storedEmail = localStorage.getItem("emailId");
        console.log(storedEmail + " " + confirmPassword);

        const res = await axios.post(
          BASE_URL + "/forgot-password",
          {
            email: storedEmail,
            newpassword: confirmPassword,
          },
          { withCredentials: true }
        );
        if (res.data.success) {
          if (res.data?.message.length >= 0) {
            setDialog({
              status: true,
              isOpen: true,
              title: "Success",
              message: res?.data?.message,
              onClose: () => {
                closeDialog();
                navigate("/login");
              },
            });
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
    finally{
      setLoading(false);
    }
  }
  async function handleReset() {
    try {
      if (validationFields()) {
        setLoading(true);
        const res = await axios.post(
          BASE_URL + "/resetpassword",
          {
            password: password,
            newPassword: confirmPassword,
          },
          { withCredentials: true }
        );
        if (res.data.success) {
          if (res.data?.message.length >= 0) {
            setDialog({
              status: true,
              isOpen: true,
              title: "Success",
              message: res?.data?.message,
              onClose: () => {
                closeDialog();
                navigate("/login");
              },
            });
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
    finally{
      setLoading(false);
    }
  }
  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };
  return (
    <div>
      <div className="flex justify-center my-10">
        <div className="flex justify-center flex-col sm:flex-col md:flex-col lg:flex-row">
          <div
            className="w-80 sm:w-60 md:w-96 lg:w-96 card bg-base-300   shadow-xl p-2"
            style={{ backgroundColor: theme === "dark" ? "black" : "#DBDBDB" }}
          >
            <div className="card-body">
              <h2
                className="card-title justify-center text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px]"
                style={{
                  color: theme === "dark" ? "#ffffff" : "black",
                  fontWeight: "bold",
                }}
              >
                {isForgot ? "Forgot Password" : "Reset Password"}
              </h2>
              <div>
                <div
                  className="label-text mt-5 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px]"
                  style={{
                    color: theme === "dark" ? "#ffffff" : "black",
                    fontSize: 12,
                  }}
                >
                  {isForgot ? "Password" : "Old Password"}
                </div>
                <div>
                  <input
                    type="text"
                    value={password}
                    className="input input-bordered w-full max-w-xs"
                    style={{
                      backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",
                      color: theme === "dark" ? "#ffffff" : "black",
                    }}
                    onChange={(e) => {
                      let val = e.target.value;
                      setPassword(val);
                      if (val.trim() !== "") {
                        setPasswordError("");
                      }
                    }}
                  />
                  {passwordError && (
                    <p style={{ color: "red", fontSize: 13, marginTop: "1%" }}>
                      {passwordError}
                    </p>
                  )}
                </div>
                <div
                  className="label-text mt-5 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px]"
                  style={{
                    color: theme === "dark" ? "#ffffff" : "black",
                    fontSize: 12,
                  }}
                >
                  {isForgot ? "Confirm Password" : "New Password"}
                </div>
                <div>
                  <input
                    type="text"
                    value={confirmPassword}
                    style={{
                      backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",
                      color: theme === "dark" ? "#ffffff" : "black",
                    }}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      let val = e.target.value;
                      if (val.trim() !== "") {
                        setConfirmPasswordError("");
                      }
                    }}
                  />
                  {confirmPasswordError && (
                    <p style={{ color: "red", fontSize: 13, marginTop: "1%" }}>
                      {confirmPasswordError}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="card-actions justify-center mb-4 mt-5 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px]">
              <button
                className="btn btn-primary"
                onClick={isForgot ? handleForgot : handleReset}
              >
                Change Password
              </button>
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
          {loading && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-10 flex items-center justify-center z-50">
          <span className="loading loading-spinner loading-xl text-green-500"></span>
        </div>
      )}
      </div>
    </div>
  );
};

export default ForgotPassword;
