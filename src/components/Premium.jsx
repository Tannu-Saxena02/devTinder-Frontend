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
import Dialog from "../utils/Dialog";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const theme = useSelector((state) => state.theme);
  const [premiumText, setPremiumText] = useState("false");
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({
    status: false,
    isOpen: false,
    title: "",
    message: "",
    onClose: null,
  });
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
    try {
      if (order.data.success) {
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
    } finally {
      setLoading(false);
    }
  };

  const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });
    try {
      if (res.data.success) {
        if (res.data?.data?.isPremium) {
          setIsUserPremium(true);
        }
      } else {
        console.log("error>>>>"+res?.data?.error);
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
    } finally {
      setLoading(false);
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
  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };
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
            <div className="m-3">
              <div className="flex flex-col md:flex-row  gap-4 w-full">
                <div
                  className="bg-base-300 rounded-box grid h-80 w-full"
                  style={{
                    backgroundColor: theme === "dark" ? "black" : "#DBDBDB",
                    padding: "2%",
                  }}
                >
                  <h1
                    className="font-bold text-3xl justify-center text-center text-[14px] sm:text-[14px] md:text-[24px] lg:text-[30px]"
                    style={{ color: theme === "dark" ? "#ffffff" : "black" }}
                  >
                    Silver Membership
                  </h1>
                  <div className="flex flex-row">
                    <div className="flex-shrink-0 flex">
                      <img
                        alt="silver"
                        src={silver}
                        className="w-[100px] h-[100px] lg:w-[200px] lg:h-[200px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px]"
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <ul className="flex-grow flex flex-col items-start  lg:mt-4">
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
                        <div className="text-[8px] sm:text-[8px] md:text-[11px] lg:text-[14px]">
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
                        <div className="text-[8px] sm:text-[8px] md:text-[11px] lg:text-[14px]">
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
                        <div className="text-[8px] sm:text-[8px] md:text-[11px] lg:text-[14px]">
                          Blue Tick
                        </div>
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
                        <div className="text-[8px] sm:text-[8px] md:text-[11px] lg:text-[14px]">
                          {" "}
                          3 months
                        </div>
                      </li>
                    </ul>
                  </div>
                  <button
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => handleBuyClick("silver")}
                    className="btn btn-secondary mx-auto flex justify-center items-center w-[80%] sm:w-[60%] md:w-[50%] lg:w-[60%] xl:w-[60%] mb-1"
                  >
                    Buy Silver
                  </button>
                </div>

                <div className="hidden sm:flex  flex-col justify-center items-center h-[280px] mt-5">
                  <div
                    className="w-px flex-grow"
                    style={{
                      backgroundColor: theme === "dark" ? "#DBDBDB" : "#000000",
                    }}
                  ></div>
                  <div
                    className="text-sm font-semibold text-[9px] sm:text-[9px] md:text-[10px] lg:text-[11px]"
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
                  className="bg-base-300 rounded-box grid h-80 w-full"
                  style={{
                    backgroundColor: theme === "dark" ? "black" : "#DBDBDB",
                    padding: "1%",
                  }}
                >
                  <h1
                    className="font-bold text-3xl justify-center text-center text-[14px] sm:text-[14px] md:text-[24px] lg:text-[30px] mt-5"
                    style={{ color: theme === "dark" ? "#ffffff" : "black" }}
                  >
                    Gold Membership
                  </h1>
                  <div className="flex flex-row">
                    <div className="flex-shrink-0 flex">
                      <img
                        alt="silver"
                        className="w-[100px] h-[100px] lg:w-[200px] lg:h-[200px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px]"
                        src={gold}
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <ul className="flex-grow flex flex-col items-start lg:mt-4">
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
                        <div className="text-[8px] sm:text-[8px] md:text-[11px] lg:text-[14px]">
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
                        <div className="text-[8px] sm:text-[8px] md:text-[11px] lg:text-[14px]">
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
                        <div className="text-[8px] sm:text-[8px] md:text-[11px] lg:text-[14px]">
                          Blue Tick
                        </div>
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
                        <div className="text-[8px] sm:text-[8px] md:text-[11px] lg:text-[14px]">
                          {" "}
                          6 months
                        </div>
                      </li>
                    </ul>
                  </div>
                  <button
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => handleBuyClick("silver")}
                    className="btn btn-primary mx-auto flex justify-center items-center w-[80%] sm:w-[60%] md:w-[50%] lg:w-[60%] xl:w-[60%] mb-1"
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
        {loading && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-10 flex items-center justify-center z-50">
            <span className="loading loading-spinner loading-xl text-green-500"></span>
          </div>
        )}
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
    </div>
  );
};

export default Premium;
