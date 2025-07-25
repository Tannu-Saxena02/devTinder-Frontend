import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import EmojiPicker from "emoji-picker-react";
import Dialog from "../utils/Dialog";
import { useNavigate } from "react-router-dom";

const Chat = ({ onSend }) => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const messagesEndRef = useRef(null);
  const theme = useSelector((state) => state.theme);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({
    status: false,
    isOpen: false,
    title: "",
    message: "",
    onClose: null,
  });
  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    //as soon as the page is loaded , the socket connection is made & joinchat event is emitted
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });
    socket.on("messageReceived", ({ firstName, text, file, currentTime }) => {
      setMessages((messages) => [
        ...messages,
        { firstName, text, file: file, createdAt: currentTime },
      ]);
    });
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    fetchChatMessages();
    getStatus();
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const fetchChatMessages = async () => {
    try {
      setLoading(true);
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });
      console.log("targetUserId: " + targetUserId);

      if (chat.data.success) {
        if (chat.data?.message.length >= 0) {
          const chatMessages = chat?.data?.data.messages.map((msg) => {
            const { senderId, text, file, createdAt } = msg;
            return {
              firstName: senderId?.firstName,
              lastName: senderId?.lastName,
              text,
              file,
              createdAt,
            };
          });
          setMessages(chatMessages);
        }
      } else {
        setDialog({
          status: false,
          isOpen: true,
          title: "Error",
          message: chat?.data?.error,
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
  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };
  const getStatus = async () => {
    try {
      const res = await axios.get(BASE_URL + "/status/" + targetUserId, {
        withCredentials: true,
      });

      if (res.data.success) {
        if (res.data?.message.length >= 0) {
          setStatus(res.data?.data);
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
    } finally {
    }
  };

  function getTime(time) {
    const timestamp = time;
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString("en-IN");
    const timeStr = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return timeStr;
  }
  function getDate(time) {
    const timestamp = time;
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString("en-IN");
    const timeStr = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return dateStr;
  }

  const getLastSeenText = (isoTime) => {
    return formatDistanceToNow(new Date(isoTime), { addSuffix: true });
  };
  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(BASE_URL + "/upload", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileUrl = res.data.fileUrl;
      let fileType = "";
      if (file.type.startsWith("pdf")) fileType = "pdf";
      else if (file.type.startsWith("video")) fileType = "video";
      else if (file.type.startsWith("image")) fileType = "image";
      else if (file.type.startsWith("doc")) fileType = "doc";
      else if (file.type.startsWith("docx")) fileType = "docx";
      else if (file.type.startsWith("xls")) fileType = "xls";
      else if (file.type.startsWith("xlsx")) fileType = "xlsx";
      console.log("response " + fileUrl);
      const socket = createSocketConnection();
      socket.emit("sendMessage", {
        firstName: user.firstName,
        userId,
        targetUserId,
        text: "", // no text, just media
        file: {
          url: fileUrl,
          type: fileType,
        },
        currentTime: new Date(),
      });
    } catch (error) {
      setDialog({
        status: false,
        isOpen: true,
        title: "Error",
        message: "File upload failed",
        onClose: closeDialog,
      });
    }
  };
  const sendMessage = () => {
    getStatus();
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: newMessage,
      file: {
        url: "",
        type: "",
      },
      currentTime: new Date(),
    });
    setNewMessage("");
  };
  const isOfficeFile = (url) => {
    if (!url) return false;
    const extensions = ["doc", "docx", "xls", "xlsx", "pdf", "txt"];
    return extensions.some((ext) => url.toLowerCase().endsWith(ext));
  };
  return (
    <div className="w-full mx-auto border border-gray-600 mx-9 h-[82vh] flex flex-col">
      <div className="flex flex-row items-center p-2">
        <div className="w-10 h-10 rounded-full overflow-hidden mx-2">
          <img
            alt="User profile"
            src={status?.photoUrl}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          {status?.firstName && status?.lastName && (
            <div
              style={{
                color: theme === "dark" ? "#ffffff" : "black",
                fontWeight: "500",
              }}
            >
              {status?.firstName + " " + status?.lastName}
            </div>
          )}
          <div className="flex flex-row items-center py-1">
            {status?.isOnline ? (
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                <span
                  className="text-green-600 font-medium"
                  style={{ color: theme === "dark" ? "#ffffff" : "black" }}
                >
                  Online
                </span>
              </div>
            ) : status?.lastSeen ? (
              <div className="flex items-center">
                 <span className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></span>
              <div
                style={{
                  fontSize: 12,
                  color: theme === "dark" ? "#ffffff" : "black",
                }}
              >
                {getLastSeenText(status?.lastSeen)}
              </div>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></span>
                <span
                  className=""
                  style={{ color: theme === "dark" ? "#ffffff" : "black" }}
                >
                  Offline
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className="flex flex-row items-center"
        style={{
          width: "100%",
          borderBottom: "1px solid #4B5563",
        }}
      ></div>

      <div className="flex-1 overflow-scroll p-5">
        {messages?.map((msg, index) => {
          const currentDate = getDate(msg.createdAt);
          const prevDate =
            index > 0 ? getDate(messages[index - 1].createdAt) : null;

          const showDate = currentDate !== prevDate;

          return (
            <div key={index}>
              {showDate && (
                <div
                  className="text-center text-xs text-gray-500 my-2"
                  style={{ color: theme === "dark" ? "#ffffff" : "black" }}
                >
                  {currentDate}
                </div>
              )}
              <div
                className={
                  "chat " +
                  (user.firstName === msg.firstName ? "chat-end" : "chat-start")
                }
              >
                {msg?.text && (
                  <div
                    className={
                      user.firstName === msg.firstName
                        ? "chat-bubble chat-bubble-info"
                        : "chat-bubble chat-bubble-neutral"
                    }
                  >
                    {msg.text}
                  </div>
                )}
                {msg?.file?.type === "image" && msg?.file?.url != "" && (
                  <img
                    src={msg?.file?.url}
                    alt="chat-img"
                    className="rounded-lg mt-2"
                    style={{ maxWidth: "200px" }}
                  />
                )}

                {msg.file?.type === "video" && msg?.file?.url != "" && (
                  <video
                    controls
                    className="rounded-lg mt-2"
                    style={{ maxWidth: "300px" }}
                  >
                    <source src={msg.file.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {isOfficeFile(msg?.file?.url) && msg?.file?.url != "" && (
                  <a
                    href={msg?.file?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                    style={{ color: theme === "dark" ? "#ffffff" : "black" }}
                  >
                    View Document
                  </a>
                )}
                {msg?.createdAt && (
                  <time
                    className="chat-footer opacity-50 text-left"
                    style={{
                      fontSize: 10,
                      justifyContent: "center",
                      display: "flex",
                      color: theme === "dark" ? "#ffffff" : "black",
                    }}
                  >
                    {getTime(msg?.createdAt)}
                  </time>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <label>
          📎
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,image/*,video/*"
          />
        </label>
        <input
          id="fileInput"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // prevent newline if using textarea
              sendMessage(); // call your send function
            }
          }}
          className={`flex-1 border border-gray-500 ${
            theme === "dark" ? "text-white" : "text-black"
          } rounded p-2`}
        ></input>
        <button
          onClick={() => setShowPicker((prev) => !prev)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
          }}
        >
          😊
        </button>
        {showPicker && (
          <div
            ref={pickerRef}
            style={{
              position: "absolute",
              bottom: 50,
              right: 0,
              zIndex: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} height={350} />
          </div>
        )}
        <button onClick={sendMessage} className="btn btn-secondary">
          Send
        </button>
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
      {loading && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-10 flex items-center justify-center z-50">
          <span className="loading loading-spinner loading-xl text-green-500"></span>
        </div>
      )}
    </div>
  );
};

export default Chat;
