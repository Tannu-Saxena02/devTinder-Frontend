import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import Dialog from "../utils/Dialog";

const Feed = () => {
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(false);
  const [isShowButton, setIsShowButton] = useState(true)
  const [dialog, setDialog] = useState({
    status: false,
    isOpen: false,
    title: "",
    message: "",
    onClose: null,
  });
  useEffect(() => {
    getFeed();
  }, []);
  const getFeed = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      console.log("response" + JSON.stringify(res?.data?.data));

      if (res.data.success) {
        if (res.data?.message.length >= 0) {
          dispatch(addFeed(res?.data?.data));
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
    finally{
      setLoading(false)
    }
  };
  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };
  if (!feed) return;
  if (feed.length <= 0)
    return (
      <h1
        className="flex justify-center my-10"
        style={{
          color: theme === "dark" ? "#ffffff" : "black",
          fontWeight: "500",
        }}
      >
        No new users founds!
      </h1>
    );

  return (
    feed && (
      <div className="flex justify-center my-10">
        <UserCard user={feed[0]} isShowButton={true} />
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
    )
  );
};

export default Feed;
