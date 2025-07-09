import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect,useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import Dialog from "../utils/Dialog";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [dialog, setDialog] = useState({
        status: false,
        isOpen: false,
        title: "",
        message: "",
        onClose: null,
      });
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log("connection " + JSON.stringify(res?.data?.data));

      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.log("ERROR " + err.data);
       setDialog({
          status: false,
          isOpen: true,
          title: "Error",
          message: err?.data?.message,
          onClose: closeDialog,
        });
    }
  };
   const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };
  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0)
    return (
      <h1
        className="flex justify-center my-10"
        style={{
          color: theme === "dark" ? "#ffffff" : "black",
          fontWeight: "500",
        }}
      >
        {" "}
        No Connections Found
      </h1>
    );

  return (
    <div className="text-center my-10">
      <h1
        className="text-bold text-white text-[16px] sm:text-[18px] md:text-[24px] lg:text-[30px]"
        style={{
          color: theme === "dark" ? "#ffffff" : "black",
          fontWeight: "bold",
        }}
      >
        Connections
      </h1>

      {connections.map((connection) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          connections != null ? connection : {};

        return (
          <div
            key={_id}
            className="flex  items-center m-3 p-4 rounded-lg bg-base-300  mx-auto w-[80%] sm:w-[65%] md:w-[75%] lg:w-[65%]"
            style={{ backgroundColor: theme === "dark" ? "black" : "#DBDBDB" }}
          >
            <div>
              <img
                alt="photo"
                className="rounded-full object-cover w-[150px] h-[38px] sm:w-[95px] sm:h-[60px] md:w-[87px] md:h-[60px] lg:w-[115px] lg:h-[115px]"
                src={photoUrl}
              />
            </div>
            <div className="text-left mx-4 w-130 justify-center items-center">
              <h2
                className="font-bold text-[10px] sm:text-[13px] md:text-[14px] lg:text-[17px]"
                style={{ color: theme === "dark" ? "#ffffff" : "black" }}
              >
                {firstName + " " + lastName}
              </h2>
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
            <Link
              to={"/chat/" + _id}
              className="flex justify-center items-center  ml-auto"
            >
              <button className="btn btn-primary mx-1 px-2 py-1 text-xs sm:px-1 sm:py-1 sm:text-xs md:px-5 md:py-2.5 md:text-base lg:w-32">
                Chat
              </button>
            </Link>
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
    </div>
  );
};
export default Connections;
