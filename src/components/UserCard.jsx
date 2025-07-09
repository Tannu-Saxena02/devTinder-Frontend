import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch,useSelector } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg-base-300 w-90 sm:w-[60] md:w-[80] lg:w-[106] shadow-sm flex flex-col mx-auto rounded-md"
    style={{ backgroundColor: theme === "dark" ? "black" : "#DBDBDB" }}>
      {/* <figure> */}
        <img
          src={photoUrl}
          className="h-auto w-full rounded-md"
          alt="photo"
        />

      <div className="m-4 flex flex-col flex-1">
        <div className="font-bold text-[10px] sm:text-[13px] md:text-[14px] lg:text-[17px]"
         style={{color: theme === "dark" ? "#ffffff" : "black"}}>
          {firstName + " " + lastName}
        </div>
        {age && gender && (
          <div className="text-[6px] sm:text-[8px] md:text-[12px] lg:text-[14px]"
           style={{color: theme === "dark" ? "#ffffff" : "black"}}>
            {age + " , " + gender}
          </div>
        )}
        <div className="text-[6px] sm:text-[8px] md:text-[12px] lg:text-[14px] my-2"
         style={{color: theme === "dark" ? "#ffffff" : "black"}}>
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
    </div>
  );
};

export default UserCard;
