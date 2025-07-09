import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { addRequests,removeRequests } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      console.log("request " + JSON.stringify(res?.data?.data));
      dispatch(addRequests(res?.data?.data));
    } catch (err) {
      console.log("ERROR " + err.data);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

   const reviewRequest = async (status, _id) => {
    try {
      const res = axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequests(_id));
    } catch (err) {}
  };
  if (!requests) return;

  if (requests.length === 0) return <h1 className="flex justify-center my-10"
   style={{color: theme === "dark" ? "#ffffff" : "black",fontWeight:"500"}}> No Requests Found</h1>;

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-white text-3xl flex justify-center text-[16px] sm:text-[18px] md:text-[24px] lg:text-[30px]"
       style={{color: theme === "dark" ? "#ffffff" : "black",fontWeight:"bold"}}>
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
              <div className="font-bold text-[10px] sm:text-[13px] md:text-[14px] lg:text-[17px]"
              style={{color: theme === "dark" ? "#ffffff" : "black"}}
              >
                {firstName + " " + lastName}
              </div>
              {age && gender && <div className="text-[6px] sm:text-[8px] md:text-[12px] lg:text-[14px]" style={{color: theme === "dark" ? "#ffffff" : "black"}}>{age + ", " + gender}</div>}
              <div className="text-[6px] sm:text-[8px] md:text-[12px] lg:text-[14px]"
              style={{color: theme === "dark" ? "#ffffff" : "black"}}>{about}</div>
            </div>
            <div className="flex ml-auto">
              <button className="btn btn-primary mx-1 px-2 py-1 text-xs sm:px-2 sm:py-2 sm:text-sm md:px-5 md:py-2.5 md:text-base"  onClick={() => reviewRequest("rejected", requests._id)}>Reject</button>
              <button className="btn btn-secondary mx-1 px-2 py-1 text-xs sm:px-2 sm:py-2 sm:text-sm md:px-5 md:py-2.5 md:text-base"  onClick={() => reviewRequest("accepted", requests._id)}>Accept</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Requests;
