import React, { useRef, useState } from "react";

const OtpVerification = () => {
  const email = localStorage.getItem("userEmail") || "anjali@example.com";
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

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

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");
    console.log("OTP Submitted:", enteredOtp);
    // Add your API call or logic here
  };

  const handleResend = () => {
    alert("OTP resent to your email.");
    // Add resend OTP logic here
  };

  return (
    <div className=" mt-9 flex justify-center items-center bg-base-200 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Verify with Email</h2>
        <p className="text-sm text-center mb-6 text-gray-600">
          Enter the OTP we sent to: <span className="font-semibold">{email}</span>
        </p>

        <div className="flex justify-between gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="input input-bordered w-12 text-center text-lg font-semibold"
            />
          ))}
        </div>

        <button
          className="btn btn-primary w-full mb-4"
          onClick={handleVerify}
          disabled={otp.includes("")}
        >
          Verify
        </button>

        <p className="text-center text-sm text-blue-600 cursor-pointer" onClick={handleResend}>
          Resend OTP
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
