import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import LandingPage from "./LandingPage";
import Dialog from "../utils/Dialog";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme);
  const userData = useSelector((store) => store.user);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({
    status: false,
    isOpen: false,
    title: "",
    message: "",
    onClose: null,
  });
  const fetchUser = async () => {
    const isLoggedIn = document.cookie.includes("token");
    console.log("view res"+userData+" "+isLoggedIn);
    
    if (userData) return;// on reload data will be lost
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      console.log("responser" + res);

      if (res.data.success) {
        if (res.data?.message.length >= 0) {
          dispatch(addUser(res.data?.data));
        }
      } else {
        console.log(res?.data);
        setDialog({
          status: false,
          isOpen: true,
          title: "Error",
          message: res?.data,
          onClose: closeDialog,
        });
      }
    } catch (err) {
      console.log("ERROR" + err);
      if (err.response) {
        if (err.response.status === 401) {
          // setDialog({
          //   status: false,
          //   isOpen: true,
          //   title: "Unauthorized",
          //   message:
          //     "Session expired or unauthorized access. Please login again.",
          //   onClose: () => {
          //     closeDialog();
          //     navigate("/login");
          //   },
          // });
        } else {
          // setDialog({
          //   status: false,
          //   isOpen: true,
          //   title: "Error",
          //   message: err?.response?.data?.error || "Something went wrong!",
          //   onClose: closeDialog,
          // });
        }
      } else {
        // setDialog({
        //   status: false,
        //   isOpen: true,
        //   title: "Error",
        //   message: err?.message || "Unexpected error",
        //   onClose: closeDialog,
        // });
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div
        className="flex-grow overflow-auto"
        style={{ backgroundColor: theme === "dark" ? "#1D232A" : "#F4F5F7" }}
      >
        <Outlet />
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

export default Body;
