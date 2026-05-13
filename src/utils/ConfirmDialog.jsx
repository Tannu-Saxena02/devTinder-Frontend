import React from "react";
import { useSelector } from "react-redux";
import { SlInfo } from "react-icons/sl";

const ConfirmDialog = ({
  title,
  message,
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
}) => {
  const theme = useSelector((state) => state.theme);

  return (
    <div className="modal modal-open">
      <div
        className="modal-box rounded-3xl border shadow-lg p-4 bg-base-100 text-center w-105"
        style={{
          backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",
        }}
      >
        <div className="flex justify-center mb-2">
          <SlInfo  size={40} color={"green"}/>
        </div>

        <h3 className="text-2xl font-semibold mb-2"
        style={{color: theme === "dark" ? "#ffffff" : "black",}}>
          {title}
        </h3>

        <p
          className="text-m text-gray-600 mb-4"
          style={{
            color: theme === "dark" ? "#ffffff" : "black",
            fontSize: 14,
            justifyContent: "center",
            textWrap: "wrap",
          }}
        >
          {message}
        </p>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            style={{
              backgroundColor: theme === "dark" ? "#2A323C" : "#E5E7EB",
              color: theme === "dark" ? "#ffffff" : "#111827",
              padding: "10px 32px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              border: "none",
              fontSize: 13,
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{
              backgroundColor: "#ff4d4f",
              color: "white",
              padding: "10px 32px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              border: "none",
              fontSize: 13,
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
