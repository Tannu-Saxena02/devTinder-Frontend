import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addTerms } from "../utils/termsSlice";
import Dialog from "../utils/Dialog";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorFirstName, setErrorFirstName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const theme = useSelector((state) => state.theme);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({
    status: false,
    isOpen: false,
    title: "",
    message: "",
    onClose: null,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function validationFields() {
    let isValid = true;
    if (!firstName) {
      setErrorFirstName("First Name is required");
      isValid = false;
    } else {
      setErrorFirstName("");
    }
    if (!lastName) {
      setErrorLastName("Last Name is required");
      isValid = false;
    } else {
      setErrorLastName("");
    }
    if (!emailId) {
      setErrorEmail("Email Id is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailId)) {
      setErrorEmail("Email Id format is invalid");
      isValid = false;
    } else setErrorEmail("");
    if (!password) {
      setErrorPassword("Password is required");
      isValid = false;
    } else {
      setErrorPassword("");
    }
    return isValid;
  }
  const handleSignUp = async () => {
    try {
      if (validationFields()) {
        setLoading(true);
        const res = await axios.post(
          BASE_URL + "/signup",
          { firstName, lastName, emailId, password },
          { withCredentials: true }
        );
        console.log("response"+res);
        
        if (res.data.success) {
          if (res.data?.message.length >= 0) {
            dispatch(addTerms("true"));
            dispatch(addUser(res.data.data));
            navigate("/terms");
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
          console.log(JSON.stringify(err?.response) + " "+JSON.stringify(err));
          
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
  };
  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };
  return (
    <div className="flex justify-center my-10">
      <div
        className="card bg-base-300 shadow-sm w-76 sm:w-85 md:w-90 lg:w-96 xl:w-[380px]"
        style={{ backgroundColor: theme === "dark" ? "black" : "#DBDBDB" }}
      >
        <div className="card-body">
          <h2
            className="card-title justify-center"
            style={{ color: theme === "dark" ? "#ffffff" : "black" }}
          >
            Sign Up
          </h2>

          <div>
            <div
              className=""
              style={{ color: theme === "dark" ? "#ffffff" : "black" }}
            >
              First Name
            </div>
            <input
              type="text"
              value={firstName}
              style={{
                backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",
                color: theme === "dark" ? "#ffffff" : "black",
              }}
              className={`input input-bordered w-full max-w-xs `}
              onChange={(e) => {
                const val = e.target.value;
                setFirstName(val);

                if (val.trim() !== "") {
                  setErrorFirstName("");
                }
              }}
            />

            {errorFirstName && (
              <p style={{ color: "red", fontSize: 11 }}>{errorFirstName}</p>
            )}
          </div>

          <fieldset className="fieldset">
            <legend
              className="fieldset-legend"
              style={{ color: theme === "dark" ? "#ffffff" : "black" }}
            >
              Last Name
            </legend>

            <input
              type="text"
              value={lastName}
              style={{
                backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",
                color: theme === "dark" ? "#ffffff" : "black",
              }}
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => {
                const val = e.target.value;
                setLastName(val);
                if (val.trim() !== "") {
                  setErrorLastName("");
                }
              }}
            />
            {errorLastName && (
              <p style={{ color: "red", fontSize: 11 }}>{errorLastName}</p>
            )}
          </fieldset>

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
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center my-2 align-center">
            <div
              className="btn btn-primary w-63 sm:w-68 md:w-75 lg:w-80"
              onClick={handleSignUp}
              style={{ color: theme === "dark" ? "#ffffff" : "black" }}
            >
              Sign Up
            </div>
          </div>
          <p
            className="m-auto cursor-pointer py-2"
            onClick={() => navigate("/login")}
            style={{
              color: theme === "dark" ? "#ffffff" : "black",
              fontWeight: "500",
            }}
          >
            Existing User? Login Here
          </p>
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

export default Signup;
