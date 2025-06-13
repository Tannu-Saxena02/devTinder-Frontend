import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("kareena02@gmail.com");
  const [password, setPassword] = useState("Kareena@123");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log("api hit");

      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email ID{emailId}</legend>
            <input
              type="text"
              value={emailId}
              onChange={(e) => {
                setEmailId(e.target.value);
              }}
              className="input"
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password{password}</legend>
            <input
              type="text"
              className="input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </fieldset>
          <div className="card-actions justify-center my-2">
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
