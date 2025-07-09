import React from "react";
import { useDispatch, useSelector } from "react-redux";
const Dialog = ({ status,isOpen, title, message, onClose }) => {
  const theme = useSelector((state) => state.theme);
  return (
    <div className="modal modal-open">
      <div className="modal-box rounded-3xl border shadow-lg p-4 bg-base-100 text-center w-105"
      style={{backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF"}}>
        <div className="flex justify-center mb-2">
          {status ? (
            <div className="text-green-500 text-4xl">✅</div>
          ) : (
            <div className="text-red-500 text-4xl">❌</div>
          )}
        </div>

        <h3
          className={`text-2xl font-semibold mb-2 ${
            status ? "text-green-600" : "text-red-600"
          }`}
        >
          {title}
        </h3>

        <p
          className="text-m text-gray-600 mb-4"
          style={{ color: theme === "dark" ? "#ffffff" : "black",
            fontSize:14,
            justifyContent:"center",
            textWrap:"wrap"
           }}
        >
          {message}
        </p>

        <div
          className="flex justify-center"
          onClick={onClose}
          style={{
            backgroundColor: "green", // blue
            color: "white",
            padding: "10px 40px",
            borderRadius: "6px",
            textAlign: "center",
            cursor: "pointer",
            display: "inline-block",
            fontWeight: "bold",
            userSelect: "none",
          }}
        >
            <div style={{color:"",fontSize:13}}>Close</div>
          
          {/* </label> */}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
