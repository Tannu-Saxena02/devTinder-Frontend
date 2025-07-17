import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import Dialog from "../utils/Dialog";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const theme = useSelector((state) => state.theme);
  const [dialog, setDialog] = useState({
    status: false,
    isOpen: false,
    title: "",
    message: "",
    onClose: null,
  });
  const dispatch = useDispatch();
  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        if (res.data?.message.length >= 0) {
          dispatch(removeUserFromFeed(userId));
        }
      } else {
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
    }
  };
  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };
  return (
    <div
      className="bg-base-300 w-96 sm:w-60 md:w-96 lg:w-[390px] shadow-sm flex flex-col mx-auto rounded-md my-4"
      style={{ backgroundColor: theme === "dark" ? "black" : "#DBDBDB" }}
    >
      {/* <figure> */}
      <img src={photoUrl} className="h-auto w-full rounded-md" alt="photo" />

      <div className="m-4 flex flex-col flex-1">
        <div
          className="font-bold text-[10px] sm:text-[13px] md:text-[14px] lg:text-[17px]"
          style={{ color: theme === "dark" ? "#ffffff" : "black" }}
        >
          {firstName + " " + lastName}
        </div>
        {age && gender && (
          <div
            className="text-[6px] sm:text-[8px] md:text-[12px] lg:text-[14px]"
            style={{ color: theme === "dark" ? "#ffffff" : "black" }}
          >
            {age + " , " + gender}
          </div>
        )}
        <div
          className="text-[6px] sm:text-[8px] md:text-[12px] lg:text-[14px] my-2"
          style={{ color: theme === "dark" ? "#ffffff" : "black" }}
        >
          {about}
        </div>
        <div className="card-actions flex justify-center mt-auto">
          <button
            className="btn btn-primary"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
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
  );
};

export default UserCard;
