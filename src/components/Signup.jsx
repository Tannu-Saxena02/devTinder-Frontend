import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      if (!firstName) {
        setErrorFirstName("First Name is required");
      }
      if (!lastName) {
        setErrorLastName("Last Name is required");
      }
      if (!/\S+@\S+\.\S+/.test(emailId)) {
        setErrorEmail("Email Id format is invalid");
      }
      if (!emailId) {
        setErrorEmail("Email Id is required");
      }
      if (!password) {
        setErrorPassword("Password is required");
      } else {
        setErrorFirstName("");
        setErrorLastName("");
        setErrorEmail("");
        setErrorPassword("");

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
    } catch (err) {
      alert(err?.response?.data || "Something went wrong");
    }
  };
  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 shadow-sm w-76 sm:w-85 md:w-90 lg:w-96 xl:w-[380px]">
        <div className="card-body">
          <h2 className="card-title justify-center">Sign Up</h2>

          <div>
            <div className="" style={{}}>
              First Name
            </div>
            <input
                type="text"
                value={firstName}
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
            <legend className="fieldset-legend">Last Name</legend>

            <input
              type="text"
              value={lastName}
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
            <legend className="fieldset-legend">Email ID</legend>
            <input
              type="text"
              value={emailId}
              onChange={(e) => {
                const val = e.target.value;
                setEmailId(val);
                if (/\S+@\S+\.\S+/.test(val)) {
                  setErrorEmail("");
                }
              }}
              className="input"
            />
            {errorEmail && (
              <p style={{ color: "red", fontSize: 11 }}>{errorEmail}</p>
            )}
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
              Add
              commentMore
              actions
            >
              Sign Up
            </div>
          </div>
          <p
            className="m-auto cursor-pointer py-2"
            onClick={() => navigate("/login")}
          >
            Existing User? Login Here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
