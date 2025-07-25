import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Dialog from "../utils/Dialog";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const OtpVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const theme = useSelector((state) => state.theme);
  const isOtpSignin = useSelector((state) => state.otp);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(10);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isOtp, SetIsOtp] = useState(false);
  const [emailId, setEmailId] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({
    status: false,
    isOpen: false,
    title: "",
    message: "",
    onClose: null,
  });
  useEffect(() => {
    startTimer();
  }, [isOtp]);

  // Timer effect
  useEffect(() => {
    let interval = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer || isOtp]);

  const startTimer = () => {
    setTimer(10);
    setIsResendDisabled(true);
  };
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  async function handleResend() {
    await handleSendOtp();
    if (!loading) {
      startTimer();
    }
  }
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  function validationFields() {
    let isValid = true;
    if (!emailId || !emailId.trim()) {
      setErrorEmail("Email ID is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailId)) {
      setErrorEmail("Email Id format is invalid");
      isValid = false;
    } else setErrorEmail("");

    return isValid;
  }
  async function handleSendOtp() {
    try {
      if (validationFields()) {
        setLoading(true);
        const res = await axios.post(
          BASE_URL + "/sendOTP",
          {
            email: emailId,
            purpose: isOtpSignin ? "" : "forgot",
          },
          { withCredentials: true }
        );
        localStorage.setItem("emailId", emailId);
        if (res.data.success) {
          if (res.data.message.length >= 0) SetIsOtp(true);
        } else {
          setDialog({
            status: false,
            isOpen: true,
            title: "Error",
            message: res?.data?.error,
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
    } finally {
      setLoading(false);
    }
  }
  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };
  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    console.log(emailId + " " + otp + " " + enteredOtp);
    try {
      if (enteredOtp) {
        setLoading(true);
        const res = await axios.post(
          BASE_URL + "/verifyOTP",
          {
            email: emailId,
            otp: enteredOtp,
          },
          { withCredentials: true }
        );
        if (res.data.success) {
          if (res.data.message.length >= 0)
            isOtpSignin ? navigate("/signup") : navigate("/forgotpassword");
        } else {
          setDialog({
            status: false,
            isOpen: true,
            title: "Error",
            message: res?.data?.error,
            onClose: closeDialog,
          });
        }
      } else {
        setDialog({
          status: false,
          isOpen: true,
          title: "Error",
          message: "OTP is required",
          onClose: closeDialog,
        });
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex  flex-col items-center justify-center my-10">
      <h1
        className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[29px] mb-10"
        style={{
          color: theme === "dark" ? "#ffffff" : "black",
          fontWeight: "600",
        }}
      >
        {isOtpSignin ? "Registration" : "Forgot Password"}
      </h1>
      <div
        className="card bg-base-300  shadow-sm w-76 sm:w-85 md:w-90 lg:w-96 xl:w-[380px]"
        style={{ backgroundColor: theme === "dark" ? "black" : "#DBDBDB" }}
      >
        <div
          className="shadow-xl rounded-xl p-8 w-full max-w-md"
          style={{ backgroundColor: theme === "dark" ? "black" : "#DBDBDB" }}
        >
          <h2
            className="text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bold text-center mb-4"
            style={{ color: theme === "dark" ? "#ffffff" : "black" }}
          >
            Verify with Email
          </h2>
          <p
            className="text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] text-center mb-6 text-gray-600"
            style={{ color: theme === "dark" ? "#ffffff" : "black" }}
          >
            {isOtp
              ? "Enter the OTP we sent to"
              : "Enter the email for OTP Verification"}{" "}
            {isOtp ? <span className="font-semibold">{emailId}</span> : null}
          </p>

          <div className="flex justify-between gap-2 mb-6">
            {isOtp ? (
              otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  style={{
                    color: theme === "dark" ? "#ffffff" : "black",
                    backgroundColor: theme === "dark" ? "#1D232A" : "white",
                    width: "90%",
                    fontSize: 13,
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="input input-bordered w-12 text-center text-lg font-semibold"
                />
              ))
            ) : (
              <fieldset className="fieldset w-full px-3">
                <legend
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
            )}
          </div>
          {isOtp && timer > 0 ? (
            <div
              className="justify-center text-center text-[8px] sm:text-[10px] md:text-[12px] lg:text-[13px] my-3"
              style={{ color: theme === "dark" ? "#ffffff" : "black" }}
            >
              OTP send in {timer} seconds
            </div>
          ) : null}
          {isOtp ? (
            <div
              className="mb-4 justify-center item-center text-[9px] sm:text-[9px] md:text-[13px] lg:text-[14px]"
              onClick={handleVerify}
              // disabled={otp.includes("")}
              style={{
                fontWeight: "bold",
                backgroundColor: otp.includes("") ? "#727B8B" : "#5654E7", // Tailwind's blue-600
                padding: "10px 20px",
                color: "white",
                borderRadius: "6px",
                textAlign: "center",
                cursor: "pointer",
                display: "inline-block",
                outline: "none",
                margin: "0 auto",
                width: "95%",
              }}
            >
              Verify
            </div>
          ) : (
            <div
              className="mb-4 justify-center item-center text-[9px] sm:text-[9px] md:text-[13px] lg:text-[14px]"
              onClick={handleSendOtp}
              style={{
                fontWeight: "bold",
                backgroundColor: otp.includes("") ? "#727B8B" : "#5654E7", // Tailwind's blue-600
                padding: "10px 20px",
                color: "white",
                borderRadius: "6px",
                textAlign: "center",
                cursor: "pointer",
                display: "inline-block",
                outline: "none",
                margin: "3%",
                width: "94%",
                justifyContent: "center",
                alignSelf: "center",
                alignContent: "center",
              }}
            >
              Send OTP
            </div>
          )}
          {isOtp ? (
            <button
              className="text-center text-sm text-blue-600 cursor-pointer justify-center mx-auto w-fit block my-3"
              onClick={handleResend}
              disabled={timer > 0 ? true : false}
            >
              Resend OTP
            </button>
          ) : null}
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
  );
};

export default OtpVerification;
