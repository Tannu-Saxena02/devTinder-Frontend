import React, { useEffect, useRef, useState } from "react";
import chat from "../assets/message.webp";
import cloud from "../assets/cloud.webp";
import network from "../assets/network.webp";
import encrpt from "../assets/networks.webp";
import mode from "../assets/mode.png";
import system from "../assets/system.png";

import OnetoOne from "../assets/OnetoOne.webp";
import photo from "../assets/photo.jpg";
import premium from "../assets/premium.png";
import sticker from "../assets/sticker.jpg";
import userStatus from "../assets/userStatus.png";
import chatcomm from "../assets/chatcomm.jpg";
import lastseen from "../assets/lastseen.png";
import chatdev from "../assets/chatdev.png";
import { IoSettings } from "react-icons/io5";
import { FaGlobe } from "react-icons/fa";
import { MdOutlineRestartAlt } from "react-icons/md";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { SiMongodb } from "react-icons/si";
import { GrPersonalComputer } from "react-icons/gr";
import { SiAuthentik } from "react-icons/si";
import { VscGraphLine } from "react-icons/vsc";
import { FaGlobeAfrica } from "react-icons/fa";
import Footer from "./Footer";
import {useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const LandingPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [touchedIndex, setTouchedIndex] = useState(null);
  const scrollContainerRef = useRef(null);
  const theme = useSelector((state) => state.theme);
  const navigate = useNavigate();
  const cardData = [
    {
      id: 1,
      img: chat,
      topic: "User-Friendly Messaging Interface",
      desc: "Intuitive and clean chat design for seamless one-on-one or group conversations.",
    },
    {
      id: 2,
      img: encrpt,
      topic: "End-to-End Encryption",
      desc: "Ensure private and secure communication with robust message encryption.",
    },
    {
      id: 3,
      img: network,
      topic: "Real-Time Sync",
      desc: "Messages update instantly across all devices with no lag or refresh required.",
    },
    {
      id: 4,
      img: cloud,
      topic: "Media & File Sharing",
      desc: "Send images, videos, and documents directly in chat—drag and drop supported.",
    },
    {
      id: 5,
      img: mode,
      topic: "Dark Mode Support",
      desc: "Switch between light and dark themes for comfortable chatting any time of day.",
    },
  ];
  const caarouselData = [
    {
      id: 1,
      img: OnetoOne,
      desc: "Allows one-on-one conversations once a connection (match) is established.",
    },
    {
      id: 2,
      img: chatcomm,
      desc: "Enables instant, bidirectional communication between matched users..",
    },
    {
      id: 3,
      img: photo,
      desc: "Supports sharing of images, videos, and potentially voice notes within chats.",
    },
    {
      id: 4,
      img: sticker,
      desc: "Emoji and Sticker Support: Offers a fun way for users to express themselves.",
    },
    {
      id: 5,
      img: system,
      desc: "Presents potential chat partners (or groups/topics) as visually appealing, swipeable cards, similar to the content cards in your screenshot",
    },
    {
      id: 6,
      img: premium,
      desc: "Premium Subscriptions: Offers enhanced features for paying users (e.g., unlimited swipes, seeing who liked them, profile boosts).",
    },
    {
      id: 7,
      img: userStatus,
      desc: "User Status (online/offline): Provides visual cues for message progression.",
    },
    {
      id: 8,
      img: lastseen,
      desc: "Last seen Indicators: Shows when the other person is actively typing a message, enhancing the real-time feel.",
    },
  ];
  const Data = [
    {
      id: 1,
      img: IoSettings,
      size: 24,
      desc: "Ensured 24×7 Availability by deploying the application on AWS EC2 with auto-restart mechanisms and uptime monitoring",
    },
    {
      id: 2,
      img: FaGlobe,
      size: 24,
      desc: "Used NGINX as a reverse proxy to efficiently route traffic to the backend, handle load balancing, and enable SSL termination.",
    },
    {
      id: 3,
      img: MdOutlineRestartAlt,
      size: 24,
      desc: "Implemented PM2 process manager to keep Node.js services alive, manage application restarts, and monitor resource usage",
    },
    {
      id: 4,
      img: FaScrewdriverWrench,
      size: 24,
      desc: "Developed scalable RESTful APIs using Node.js and Express.js, ensuring high performance and low latency.",
    },
    {
      id: 5,
      img: SiMongodb,
      size: 24,
      desc: "Integrated MongoDB for flexible, schema-less data storage, enabling fast and efficient data retrieval.",
    },
    {
      id: 6,
      img: GrPersonalComputer,
      size: 24,
      desc: "Built dynamic, responsive front-end with React.js, providing a smooth user experience and real-time updates.",
    },
    {
      id: 7,
      img: SiAuthentik,
      size: 24,
      desc: "Implemented JWT-based authentication for secure access control and session management.",
    },
    {
      id: 8,
      img: VscGraphLine,
      size: 24,
      desc: "Added logging and monitoring using tools like PM2 logs and AWS CloudWatch to diagnose issues and track uptime",
    },
    {
      id: 8,
      img: FaGlobeAfrica,
      size: 24,
      desc: "Cross-platform compatibility and mobile responsiveness, enabling seamless experience across devices.",
    },
  ];
  const cardWidth = 420;
  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      index = (index + 1) % cardData.length; // ← Here is % used

      container.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <img
          style={{ width: 180, height: 180, marginTop: 60, marginBottom: 10 }}
          src={chatdev}
          alt=""
        />
        <div 
        className="text-[26px] sm:text-[33px] md:text-[40px] lg:text-[47px]"
        style={{fontWeight: "bold", marginBlock: 1,color: theme === "dark" ? "#ffffff" : "black", }}>
          Design. Chat. Connect.
        </div>
        <div
        className="text-[26px] sm:text-[33px] md:text-[40px] lg:text-[47px]"
          style={{
            fontWeight: "bold",
            marginBlock: 1,
            color: "#feba00",
          }}
        >
          Start Experiencing Today
        </div>
        <div
        className="text-[10px] sm:text-[12px] md:text-[13px] lg:text-[17px]"
          style={{
            marginBlock: "1%",
            justifyContent: "center",
            textAlign: "center",
            marginInline: "20%",
            color: theme === "dark" ? "#ffffff" : "black",
            fontWeight:"500"
          }}
        >
          Take the leap into modern messaging with our powerful, real-time chat
          platform. Create secure, fast, and beautifully designed chat
          experiences — whether it’s 1-on-1 chats, or media sharing. Also
          end-to-end encrypted. Just smooth UI/UX and a seamless experience. 💙
        </div>
        <div
         className="text-[10px] sm:text-[12px] md:text-[13px] lg:text-[15px] p-[10px] sm:p-[12px] md:p-[13px] lg:p-[15px]"
          style={{
            borderWidth: 2,
            borderColor: "#573eb7",
            paddingInline: 30,
            borderRadius: 7,
            fontWeight: "bold",
            background: "blue",
            marginBlock: "2%",
            cursor: "pointer"
          }}      
          onClick={()=>{
             navigate("/login");
          }}
        >
          Getting Started
        </div>
      </div>
      <div
        className="flex flex-col items-center justify-center text-[23px] sm:text-[25px] md:text-[30px] lg:text-[37px]"
        style={{
          fontWeight: "bold",
          marginTop: 70,
          marginBottom: 20,
          color: theme === "dark" ? "#ffffff" : "black",
        }}
      >
        Our Services & Features
      </div>
      <div className="flex flex-row flex-wrap mx-5 items-center justify-center">
        {cardData.map((card, index) => {
          const isActive = hoveredIndex === index;
          return (
            <div
              key={card.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="flex flex-col items-center justify-center w-[90%] sm:w-[50%] md:w-[45%] lg:w-[23%]"
              style={{
                border: "2px dashed #573eb7",
                borderRadius: 12,
                padding: 24,
                background: isActive
                  ? "rgb(19, 9, 80)"
                  : "linear-gradient(180deg, #24126A 0%,rgb(19, 9, 80) 100%)",
                marginInline: "30px",
                height: isActive ? "340px" : "320px",
                margin: "10px",
                boxShadow: isActive ? "0 10px 25px rgba(0,0,0,0.3)" : "none",
                transform: isActive ? "scale(1.03)" : "scale(1)",
              }}
            >
              <div className="mb-6 rounded-full flex items-center justify-center bg-gradient-to-b from-purple-600/50 to-indigo-600/40 p-1 shadow-lg">
                <div className="rounded-full flex items-center justify-center bg-[#29235C]">
                  <img
                    src={card.img}
                    style={{ width: 100, height: 100 }}
                    alt=""
                  />
                </div>
              </div>
              <div
              className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[24px]"
                style={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {card.topic}
              </div>
              <div
                className="m-4 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px]"
                style={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {card.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* //with img/ */}
      <div
        ref={scrollContainerRef}
        className="flex flex-row my-20"
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollBehavior: "smooth",
          width: "100%",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {caarouselData.map((card, index) => (
          <div
            key={card.id}
            className="w-[320px] sm:w-[440px] md:w-[480px] lg:w-[520px]"
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "inline-block",
              verticalAlign: "top",
              flex: "0 0 auto", // Don't shrink or wrap
              margin: "10px",
              textAlign: "center",
            }}
          >
            {/* <div className="mb-6 rounded-full flex items-center justify-center bg-gradient-to-b from-purple-600/50 to-indigo-600/40 p-1 shadow-lg">
              <div className="rounded-full flex items-center justify-center bg-[#29235C]"> */}
            <img
              src={card.img}
               className="w-[320px] sm:w-[440px] md:w-[480px] lg:w-[520px] h-[140px] sm:h-[180px] md:h-[210px] lg:h-[250px]"
              style={{  borderRadius: "5px" }}
              alt=""
            />
            {/* </div>
            </div> */}
            <div
               className="m-4 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[14px]"
              style={{
                color: theme === "dark" ? "#ffffff" : "black",
                fontWeight: "bold",
                textAlign: "center",
                width: "100%",
                whiteSpace: "normal", // allow wrapping
                wordWrap: "break-word", // break long words if needed
                overflowWrap: "break-word",
              }}
            >
              {card.desc}
            </div>
          </div>
        ))}
      </div>
      <div
      className="text-[23px] sm:text-[25px] md:text-[30px] lg:text-[37px]"
        style={{
          fontWeight: "bold",
          marginBlock: 30,
          color: "#7b72bf",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        We're changing the way
      </div>
      <div style={{ marginInline: "15%" }}>
        <div
        className="text-[21px] sm:text-[23px] md:text-[28px] lg:text-[35px]"
          style={{
            fontWeight: "bold",
            marginBlock: 15,
            color: "#32a7ff",
          }}
        >
          {" "}
          Our Mission
        </div>
        <div 
        className="text-[13px] sm:text-[13px] md:text-[15px] lg:text-[17px]"
        style={{ marginBlock: 10, marginBottom: 40,color: theme === "dark" ? "#ffffff" : "black", }}>
          At DevConnect, our mission is to redefine how people connect,
          communicate, and collaborate — through a fast, secure, and
          user-centric messaging platform. We aim to empower individuals, teams,
          and communities by providing a seamless chat experience that blends
          simplicity with modern technology. Built with a focus on real-time
          performance, privacy-first architecture, and beautiful design, our app
          makes conversations smoother, smarter, and more human. Whether it's
          1-on-1 messaging, group discussions, or media sharing — we ensure it's
          always effortless and secure.
        </div>
        <div
        className="text-[21px] sm:text-[23px] md:text-[28px] lg:text-[35px]"
          style={{
            fontWeight: "bold",
            marginBlock: 15,
            color: "#32a7ff",
          }}
        >
          Our Value
        </div>
        <div 
        className="text-[13px] sm:text-[13px] md:text-[15px] lg:text-[17px]"
        style={{ marginBottom: 90,color: theme === "dark" ? "#ffffff" : "black" }}>
          At the heart of our chat application lies a commitment to simplicity,
          privacy, and real-time connection. We believe communication should be
          seamless, secure, and accessible to everyone. That’s why we’ve built a
          platform that combines intuitive design with powerful features like
          end-to-end encryption, instant message delivery, and effortless media
          sharing. We value user trust and experience above all — ensuring that
          every conversation feels natural, fast, and protected. As we continue
          to evolve, our goal remains clear: to empower people and teams to
          connect meaningfully in a digital-first world.
        </div>
      </div>
      <div
      className="text-[23px] sm:text-[25px] md:text-[30px] lg:text-[37px]"
        style={{
          fontSize: 37,
          fontWeight: "bold",
          marginTop: 60,
          marginBottom: 20,
          // color: "#E2646E",
          color: "#feba00",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        Core Offering
      </div>
      <div className="flex flex-row flex-wrap mx-2 mb-30 items-center justify-center">
        {Data.map(({ id, img: IconComponent, desc }, index) => {
          const isActive = touchedIndex === index;
          return (
            <div
              key={id}
              onMouseEnter={() => setTouchedIndex(index)}
              onMouseLeave={() => setTouchedIndex(null)}
              className="flex flex-col items-center justify-center  w-[90%] sm:w-[50%] md:w-[45%] lg:w-[20%]"
              style={{
                border: "1px solid #feba00",
                borderRadius: 12,
                padding: 24,
                height: isActive ? "310px" : "290px",
                margin: "10px",
                // transition: "all 0.3s ease-in-out",
                boxShadow: isActive ? "0 10px 25px rgba(0,0,0,0.3)" : "none",
                transform: isActive ? "scale(1.03)" : "scale(1)",
              }}
            >
              {/* style={{backgroundColor:"#94D292"}} */}
              {/* from-purple-600/50 to-indigo-600/40 */}
              <div className="mb-6 rounded-full flex items-center justify-center bg-gradient-to-b from-purple-600/50 to-indigo-600/40  p-1 shadow-lg"
              >
                <div
                  className="rounded-full flex items-center justify-center bg-[#29235C]"
                  style={{ height: 100, width: 100 ,}}
                >
                  {/* backgroundColor:theme=== "dark" ?"29235C":"#D0E2EA" */}
                  <IconComponent
                    color={theme === "dark" ? "blue":"#2CA848"}
                    size={30}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: 70,
                      height: 70,
                      alignSelf: "center",
                    }}
                  />
                </div>
              </div>
              <div
                className="m-4"
                style={{
                  color: theme === "dark" ? "#ffffff" : "black",
                  fontSize: "12px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {desc}
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
