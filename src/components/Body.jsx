import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import LandingPage from "./LandingPage";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  useEffect(() => {
    console.log("userdata");
    fetchUser();
  }, []);
  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      console.log("responser" + res);

      dispatch(addUser(res.data));
    } catch (err) {
      if (err.status == 401) navigate("/login");
      console.log(err);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Body;
