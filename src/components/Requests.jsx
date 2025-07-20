import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestSlice";
import Dialog from "../utils/Dialog";
import { useNavigate } from "react-router-dom";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({
    status: false,
    isOpen: false,
    title: "",
    message: "",
    onClose: null,
  });
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      console.log("request " + JSON.stringify(res?.data?.data));

      if (res.data.success) {
        if (res.data?.message.length >= 0) {
          dispatch(addRequests(res?.data?.data));
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };
  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      console.log(JSON.stringify(res) +" "+res?.data);
      if (res?.data?.success) {
        if (res.data?.message.length >= 0) {
           console.log("error>>>>!!!!!");
          dispatch(removeRequests(_id));
          setDialog({
            status: true,
            isOpen: true,
            title: "Success",
            message: res?.data?.message,
            onClose: () => {
              closeDialog();
            },
          });
        }
      } 
      else {
        console.log("error>>>>");
        
        setDialog({
          status: false,
          isOpen: true,
          title: "Error",
          message: res?.data?.error,
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
  if (!requests) return;

  if (requests.length === 0)
    return (
      <h1
        className="flex justify-center my-10"
        style={{
          color: theme === "dark" ? "#ffffff" : "black",
          fontWeight: "500",
        }}
      >
        {" "}
        No Requests Found
      </h1>
    );

  return (
    <div className="text-center my-10">
      <h1
        className="text-bold text-white text-3xl flex justify-center text-[16px] sm:text-[18px] md:text-[24px] lg:text-[30px]"
        style={{
          color: theme === "dark" ? "#ffffff" : "black",
          fontWeight: "bold",
        }}
      >
        Connection Requests
      </h1>

      {requests.map((requests) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          requests?.fromUserId;

        return (
          <div
            key={_id}
            className="flex  items-center m-4 p-4 rounded-lg bg-base-300 w-[80%] sm:w-[65%] md:w-[75%] lg:w-[65%] mx-auto"
            style={{ backgroundColor: theme === "dark" ? "black" : "#DBDBDB" }}
          >
            <div>
              <img
                alt="photo"
                className="rounded-full w-[110px] h-[60px] sm:w-[25px] sm:h-[80px] md:w-[75px] md:h-[60px] lg:w-[115px] lg:h-[115px]"
                src={photoUrl}
              />
            </div>
            <div className="text-left mx-6">
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
                  {age + ", " + gender}
                </div>
              )}
              <div
                className="text-[6px] sm:text-[8px] md:text-[12px] lg:text-[14px]"
                style={{ color: theme === "dark" ? "#ffffff" : "black" }}
              >
                {about}
              </div>
            </div>
            <div className="flex ml-auto">
              <button
                className="btn btn-primary mx-1 px-2 py-1 text-xs sm:px-2 sm:py-2 sm:text-sm md:px-5 md:py-2.5 md:text-base"
                onClick={() => reviewRequest("rejected", _id)}
              >
                Reject
              </button>
              <button
                className="btn btn-secondary mx-1 px-2 py-1 text-xs sm:px-2 sm:py-2 sm:text-sm md:px-5 md:py-2.5 md:text-base"
                onClick={() => reviewRequest("accepted",_id)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
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
export default Requests;
