import React, { useState } from "react";
import Dialog from "../utils/Dialog";
import { useSelector } from "react-redux";

const ForgotPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  //   const [oldPassword, setOldPassword] = useState("");
  //   const [newPassword, setNewPassword] = useState("");
  //   const [oldPasswordError, setOldPasswordError] = useState("");
  //   const [newPasswordError, setNewPasswordError] = useState("");
  const [dialog, setDialog] = useState({
    status: false,
    isOpen: false,
    title: "",
    message: "",
    onClose: null,
  });
  const theme = useSelector((state) => state.theme);
  const isForgot = useSelector((state) => state.forgot);
  function validationFields() {
    let isValid = true;

    if (!password) {
      setPasswordError(
        isForgot ? "Password is required" : "Old Password is required"
      );
      isValid = false;
    } else setPasswordError("");
    if (!confirmPassword) {
      setConfirmPasswordError(
        isForgot ? "Confirm Password is required" : "New Password is required"
      );
      isValid = false;
    } else setConfirmPasswordError("");
    return isValid;
  }
  function handleForgot() {
    try {
      if (validationFields()) {
      }
    } catch (error) {
      setDialog({
        status: false,
        isOpen: true,
        title: "Error",
        message: err?.data?.message,
        onClose: closeDialog,
      });
    }
  }
  function handleReset() {
    try {
      if (validationFields()) {
      }
    } catch (error) {
      setDialog({
        status: false,
        isOpen: true,
        title: "Error",
        message: err?.data?.message,
        onClose: closeDialog,
      });
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
            className="w-95 sm:w-[60] md:w-[90] lg:w-[90] card bg-base-300   shadow-xl p-2"
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
      </div>
    </div>
  );
};

export default ForgotPassword;
