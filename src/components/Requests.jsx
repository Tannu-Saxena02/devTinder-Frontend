import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { addRequests,removeRequests } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
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

  if (requests.length === 0) return <h1 className="flex justify-center my-10"> No Requests Found</h1>;

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-white text-3xl flex justify-center ">
        Connection Requests
      </h1>

      {requests.map((requests) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          requests?.fromUserId;

        return (
          <div
            key={_id}
            className="flex  items-center m-4 p-4 rounded-lg bg-base-300 w-2/3 mx-auto"
          >
            <div>
              <img
                alt="photo"
                className="w-20 h-20 rounded-full"
                src={photoUrl}
              />
            </div>
            <div className="text-left mx-6">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p>{age + ", " + gender}</p>}
              <p>{about}</p>
            </div>
            <div className="flex ml-auto">
              <button className="btn btn-primary mx-2"  onClick={() => reviewRequest("rejected", requests._id)}>Reject</button>
              <button className="btn btn-secondary mx-2"  onClick={() => reviewRequest("accepted", requests._id)}>Accept</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Requests;
