import React, { useState } from "react";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useSelector } from "react-redux";
import Lottie from "lottie-react";
import Confetti from "../assets/Confetti.json";
import { useNavigate } from "react-router-dom";
import silver from "../assets/silver.png";
import gold from "../assets/gold.png";
import { TiTick } from "react-icons/ti";
import { GrValidate } from "react-icons/gr";
import { VscFeedback } from "react-icons/vsc";
import { FaUsers } from "react-icons/fa";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const theme = useSelector((state) => state.theme);
  const [premiumText, setPremiumText] = useState("false");
  const navigate = useNavigate();
  useEffect(() => {
    let ispremiumText = localStorage.getItem("premiumText");
    setPremiumText(ispremiumText);
    verifyPremiumUser();
  }, []);

  const handleBuyClick = async (type) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      {
        membershipType: type,
      },
      { withCredentials: true }
    );

    const { amount, currency, notes, orderId } = order?.data?.data;
    const { keyId } = order?.data;
    const options = {
      key: keyId,
      amount,
      currency,
      name: "Dev Tinder",
      description: "Connect to other developers",
      order_id: orderId,
      prefill: {
        name: notes?.firstName + " " + notes?.lastName,
        email: notes?.emailId,
        contact: "9999999999",
      },
      handler: async function (response) {
        await verifyPremiumUser();
        localStorage.setItem("premiumText", "false");
        setPremiumText("false");
      },
      theme: {
        color: "#F37254",
      },
    };
    console.log("amount>>", amount + JSON.stringify(order.data?.data));
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });

    if (res.data.isPremium) {
      setIsUserPremium(true);
    }
  };
  function onClose() {
    console.log("onClose called");
    localStorage.setItem("premiumText", "true");
    setPremiumText("true");
    navigate("/feed");
    setTimeout(() => {
      window.location.reload(); // Force reload after navigation
    }, 100);
  }
  return (
    <div>
      <div>
        {isUserPremium && premiumText == "true" ? (
          <div
            className="flex justify-center my-10 "
            
            style={{ color: theme === "dark" ? "#ffffff" : "black" }}
          >
            You are now a Premium User
          </div>
        ) : (
          <div>
            <div className="m-10">
              <div className="flex w-full justify-center items-center">
                <div
                  className="card bg-base-300 rounded-box grid h-80 flex-grow"
                  style={{
                    backgroundColor: theme === "dark" ? "black" : "#DBDBDB",
                    padding: "2%",
                  }}
                >
                  <h1
                    className="font-bold text-3xl justify-center text-center text-[16px] sm:text-[18px] md:text-[24px] lg:text-[30px]"
                    style={{ color: theme === "dark" ? "#ffffff" : "black" }}
                  >
                    Silver Membership
                  </h1>
                  <div className="flex flex-row">
                    <div className="flex-shrink-0 flex items-center justify-center">
                      <img
                        alt="silver"
                        src={silver}
                        className="lg:w-[200px] lg:h-[200px] sm:w-[30px] sm:h-[30px] md:w-[120px] md:h-[120px]"
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <ul className="flex-grow flex flex-col mt-10 items-start ml-5">
                      <li
                        style={{
                          color: theme === "dark" ? "#ffffff" : "black",
                        }}
                        className="flex flex-row m-1"
                      >
                        <FaUsers
                          size={20}
                          color={theme === "dark" ? "#ffffff" : "black"}
                          className="mr-2"
                        />{" "}
                        <div 
                        className="text-[11px] sm:text-[10px] md:text-[11px] lg:text-[14px]">
                          Chat with other people
                        </div>
                      </li>
                      <li
                        style={{
                          color: theme === "dark" ? "#ffffff" : "black",
                        }}
                        className="flex flex-row m-1"
                      >
                        <VscFeedback
                          size={20}
                          className="mr-2"
                          color={theme === "dark" ? "#ffffff" : "black"}
                        />{" "}
                        <div 
                        className="text-[11px] sm:text-[10px] md:text-[11px] lg:text-[14px]">
                          100 connection Requests per day
                        </div>
                      </li>
                      <li
                        className="flex flex-row m-1"
                        style={{
                          color: theme === "dark" ? "#ffffff" : "black",
                        }}
                      >
                        <GrValidate
                          size={20}
                          className="mr-2"
                          color={theme === "dark" ? "#ffffff" : "black"}
                        />{" "}
                        <div 
                        className="text-[11px] sm:text-[10px] md:text-[11px] lg:text-[14px]">Blue Tick</div>
                      </li>
                      <li
                        className="flex flex-row m-1"
                        style={{
                          color: theme === "dark" ? "#ffffff" : "black",
                        }}
                      >
                        <TiTick
                          size={20}
                          className="mr-2"
                          color={theme === "dark" ? "#ffffff" : "black"}
                        />{" "}
                        <div className="text-[11px] sm:text-[10px] md:text-[11px] lg:text-[14px]"> 3 months</div>
                      </li>
                    </ul>
                  </div>
                  <button
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => handleBuyClick("silver")}
                    className="btn btn-secondary mx-auto flex justify-center items-center w-full sm:w-[60%] md:w-[50%] lg:w-[60%] xl:w-[60%]"
                  >
                    Buy Silver
                  </button>
                </div>

                <div className="flex flex-col items-center mx-4 h-70">
                  <div
                    className="w-px flex-grow"
                    style={{
                      backgroundColor: theme === "dark" ? "#DBDBDB" : "#000000",
                    }}
                  ></div>
                  <div
                    className="px-2 text-sm font-semibold text-[9px] sm:text-[9px] md:text-[10px] lg:text-[11px]"
                    style={{
                      color: theme === "dark" ? "#DBDBDB" : "#000000",
                    }}
                  >
                    OR
                  </div>
                  <div
                    className="w-px flex-grow"
                    style={{
                      backgroundColor: theme === "dark" ? "#DBDBDB" : "#000000",
                    }}
                  ></div>
                </div>

                <div
                  className="card bg-base-300 rounded-box grid h-80 flex-grow"
                  style={{
                    backgroundColor: theme === "dark" ? "black" : "#DBDBDB",
                    padding: "1%",
                  }}
                >
                  <h1
                    className="font-bold text-3xl justify-center text-center mt-4 text-[16px] sm:text-[18px] md:text-[24px] lg:text-[30px]"
                    style={{ color: theme === "dark" ? "#ffffff" : "black" }}
                  >
                    Gold Membership
                  </h1>
                  <div className="flex flex-row">
                    <div className="flex-shrink-0 flex items-center justify-center">
                      <img
                        alt="silver"
                        className="lg:w-[200px] lg:h-[200px] sm:w-[90px] sm:h-[90px] md:w-[120px] md:h-[120px]"
                        src={gold}
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <ul className="flex-grow flex flex-col mt-10 items-start ml-5">
                      <li
                        className="flex flex-row m-1"
                        style={{
                          color: theme === "dark" ? "#ffffff" : "black",
                        }}
                      >
                        <FaUsers
                          size={20}
                          className="mr-2 "
                          color={theme === "dark" ? "#ffffff" : "black"}
                        />{" "}
                        <div 
                        className="text-[11px] sm:text-[10px] md:text-[11px] lg:text-[14px]">
                          Chat with other people
                        </div>
                      </li>
                      <li
                        className="flex flex-row m-1"
                        style={{
                          color: theme === "dark" ? "#ffffff" : "black",
                        }}
                      >
                        <VscFeedback
                          size={20}
                          className="mr-2"
                          color={theme === "dark" ? "#ffffff" : "black"}
                        />{" "}
                        <div 
                        className="text-[11px] sm:text-[10px] md:text-[11px] lg:text-[14px]">
                          1000 connection Requests per day
                        </div>
                      </li>
                      <li
                        className="flex flex-row m-1"
                        style={{
                          color: theme === "dark" ? "#ffffff" : "black",
                        }}
                      >
                        <GrValidate
                          size={20}
                          className="mr-2"
                          color={theme === "dark" ? "#ffffff" : "black"}
                        />{" "}
                        <div 
                        className="text-[11px] sm:text-[10px] md:text-[11px] lg:text-[14px]">Blue Tick</div>
                      </li>
                      <li
                        className="flex flex-row m-1"
                        style={{
                          color: theme === "dark" ? "#ffffff" : "black",
                        }}
                      >
                        <TiTick
                          size={20}
                          className="mr-2"
                          color={theme === "dark" ? "#ffffff" : "black"}
                        />{" "}
                        <div  className="text-[11px] sm:text-[10px] md:text-[11px] lg:text-[14px]"> 6 months</div>
                      </li>
                    </ul>
                  </div>
                  <button
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => handleBuyClick("silver")}
                      className="btn btn-primary mx-auto flex justify-center items-center w-full sm:w-[60%] md:w-[50%] lg:w-[60%] xl:w-[60%]"
                  >
                    Buy Gold
                  </button>
                </div>
              </div>
            </div>
            {isUserPremium && premiumText == "false" && (
              <div>
                <div className="fixed inset-0 z-60 pointer-events-none">
                  <Lottie
                    autoplay
                    loop={true}
                    animationData={Confetti}
                    style={{ height: "100%", width: "100%", margin: "auto" }}
                  />
                </div>

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-10 ">
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center relative">
                    <h2 className="text-2xl font-bold text-green-600 mt-4">
                      Payment Successful !
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Thank you for your purchase. Your premium membership is
                      now active.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Premium;
