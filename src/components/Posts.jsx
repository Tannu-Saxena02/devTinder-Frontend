import React, { useState, useRef, useEffect } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegComment, FaRetweet } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import Dialog from "../utils/Dialog";
import { useDispatch, useSelector } from "react-redux";
import { addPosts} from "../utils/postsSlice.js";

const Posts = () => {
  const theme = useSelector((s) => s.theme);
  const user = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const [dialog, setDialog] = useState({
    status: false,
    isOpen: false,
    title: "",
    message: "",
    onClose: null,
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const textColor = theme === "dark" ? "#ffffff" : "#000000";
  const cardBg = theme === "dark" ? "#1a1a1a" : "#f5f5f5";
  const inputBg = theme === "dark" ? "#2a2a2a" : "#ffffff";

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [mediaPreview, setMediaPreview] = useState([]);
  const pickerRef = useRef(null);
  const textareaRef = useRef(null);
  const cursorPos = useRef(0);

  const [visibility, setVisibility] = useState("anyone");
  const [commentText, setCommentText] = useState({});
  const postData = useSelector((s) => s.posts);
  useEffect(() => {
    handlegetAllPosts();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        !textareaRef.current?.contains(e.target)
      ) {
        setShowPicker(false);
      }
    };
// It listens for any mousedown event on the entire page.
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);// cler this event
  }, []);
  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return diff + "s ago";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
    return Math.floor(diff / 86400) + "d ago";
  };
  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setMediaPreview((prev) => [...prev, ...urls]);
  };
  const handleEmojiClick = (emojiData) => {
    const pos = cursorPos.current;
    const emoji = emojiData.emoji;
    setContent((prev) => prev.slice(0, pos) + emoji + prev.slice(pos));
    cursorPos.current = pos + emoji.length;
  };

  const handlePosts = async () => {
    try {
      setLoading(true);
      const req = {
        postContent: content,
        media: mediaPreview,
        visibility: visibility === "anyone" ? "public" : "private",
      };
      const res = await axios.post(BASE_URL + "/createposts", req, {
        withCredentials: true,
      });
      console.log("request " + JSON.stringify(res?.data?.data));

      if (res.data.success) {
        if (res.data?.message.length >= 0) {
          setContent("");
          setMediaPreview([]);
          setDialog({
            status: true,
            isOpen: true,
            title: "Success",
            message: res.data.message,
            onClose: () => {
              setDialog((prev) => ({ ...prev, isOpen: false }));
              handlegetAllPosts();
            },
          });
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
      setLoading(false);
    }
  };

  const handleReposts = async (postId) => {
    try {
      setLoading(true);
      const res = await axios.post(
        BASE_URL + "/posts/repost/" + postId,
        {},
        {
          withCredentials: true,
        },
      );
      console.log("request " + JSON.stringify(res?.data?.data));

      if (res.data.success) {
        if (res.data?.message.length >= 0) {
          setContent("");
          setMediaPreview([]);
          setDialog({
            status: true,
            isOpen: true,
            title: "Success",
            message: res.data.message,
            onClose: () => {
              setDialog((prev) => ({ ...prev, isOpen: false }));
              handlegetAllPosts();
            },
          });
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
      setLoading(false);
    }
  };

  const handleUserPosts = async (userId) => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/user/posts/" + userId, {
        withCredentials: true,
      });

      if (res.data.success) {
        if (res.data?.message.length >= 0) {
          dispatch(addPosts(res.data?.data || []));
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
      setLoading(false);
    }
  };
  const handlegetAllPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        BASE_URL + "/user/allposts",
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        if (res.data?.message.length >= 0) {
          dispatch(addPosts(res.data?.data || []));
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
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(
        BASE_URL + "/posts/like",
        { postId },
        { withCredentials: true },
      );
      handlegetAllPosts();
    } catch (err) {
      setDialog({
        status: false,
        isOpen: true,
        title: "Error",
        message: err?.message || "Unexpected error",
        onClose: closeDialog,
      });
    }
  };

  const handleComment = (id) => {
    const text = commentText[id]?.trim();
    if (!text) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id !== id
          ? p
          : {
              ...p,
              comments: [...p.comments, { author: user?.firstName, text }],
            },
      ),
    );
    setCommentText((p) => ({ ...p, [id]: "" }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Write Post */}
      <div
        className="rounded-xl p-4 mb-6 shadow-sm"
        style={{
          backgroundColor: cardBg,
          border: theme === "dark" ? "1px solid #2e2e2e" : "1px solid #e0e0e0",
        }}
      >
        <div className="flex gap-3 items-start">
          <div className="flex flex-col items-center gap-1">
            <img
              src={user?.photoUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="text-xs rounded-md px-1 py-0.5 outline-none"
              style={{
                backgroundColor: inputBg,
                color: textColor,
                border:
                  theme === "dark" ? "1px solid #2e2e2e" : "1px solid #e0e0e0",
                cursor: "pointer",
              }}
            >
              <option value="anyone">🌐 Anyone</option>
              <option value="me">🔒 Only me</option>
            </select>
          </div>
          <textarea
            className="flex-1 resize-none rounded-lg p-3 text-sm outline-none"
            style={{
              backgroundColor: inputBg,
              color: textColor,
              border:
                theme === "dark" ? "1px solid #2e2e2e" : "1px solid #e0e0e0",
              minHeight: 80,
            }}
            placeholder="Share something with the dev community..."
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={(e) => { cursorPos.current = e.target.selectionStart; }}
            maxLength={500}
          />
        </div>

        {mediaPreview.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {mediaPreview.map((url, i) => (
              <div key={i} className="relative inline-block">
                <img
                  src={url}
                  alt="preview"
                  className="rounded-lg max-h-40 object-cover"
                />
                <button
                  onClick={() =>
                    setMediaPreview((prev) =>
                      prev.filter((_, idx) => idx !== i),
                    )
                  }
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    background: "#ff4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    cursor: "pointer",
                    fontSize: 11,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center mt-3">
          <span
            className="text-xs"
            style={{ color: theme === "dark" ? "#666" : "#aaa" }}
          >
            {content.length}/500
          </span>
          <div className="flex items-center gap-2 relative" ref={pickerRef}>
            <label style={{ cursor: "pointer", fontSize: 18 }}>
              📎
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*,video/*"
                multiple
              />
            </label>
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
                  top: 40,
                  right: 0,
                  zIndex: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} height={350} />
              </div>
            )}
            <button
              className="btn btn-sm px-6"
              style={{
                backgroundColor: "#feba00",
                color: "#000",
                fontWeight: 600,
                border: "none",
              }}
              onClick={handlePosts}
              disabled={!content.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {postData?.length === 0 && (
        <p
          className="text-center mt-10 text-sm"
          style={{ color: theme === "dark" ? "#666" : "#aaa" }}
        >
          No posts yet. Be the first to post!
        </p>
      )}

      {/* Posts List */}
      {postData?.map((post) => {
        // const liked = post.likes.includes("me");
        return (
          <div
            key={post._id}
            className="rounded-xl p-4 mb-4 shadow-sm"
            style={{
              backgroundColor: cardBg,
              border:
                theme === "dark" ? "1px solid #2e2e2e" : "1px solid #e0e0e0",
            }}
          >
            {post?.repostAuthorName && (
              <div
                className="flex items-center gap-1 mb-2 text-xs font-semibold"
                style={{ color: "#feba00" }}
              >
                <img
                  src={post?.repostAuthorAvatar}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <FaRetweet size={13} /> Reposted from {post.repostAuthorName}
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <img
                src={post?.authorAvatar}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{ color: textColor }}
                >
                  {post?.authorName}
                </p>
                <p
                  className="text-xs"
                  style={{ color: theme === "dark" ? "#666" : "#aaa" }}
                >
                  {timeAgo(post?.createdAt)}
                </p>
              </div>
            </div>

            <p
              className="text-sm mb-4 whitespace-pre-wrap"
              style={{ color: textColor }}
            >
              {post?.postContent}
            </p>
            {post?.media?.length > 0 && (
              <div className="flex flex-row gap-2 mb-4">
                {post?.media.map((url, i) => (
                  <img
                    key={i}
                    src={
                      "https://images.pexels.com/photos/36305686/pexels-photo-36305686.jpeg"
                    }
                    alt="attachment"
                    className="rounded-lg max-h-64 object-contain w-full"
                  />
                ))}
              </div>
            )}

            {/* Actions */}
            <div
              className="flex gap-6 text-sm"
              style={{ color: theme === "dark" ? "#888" : "#666" }}
            >
              <button
                className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                onClick={() => handleLike(post._id)}
              >
                {post?.likes > 0 ? (
                  <AiFillLike size={18} color="#feba00" />
                ) : (
                  <AiOutlineLike size={18} />
                )}
                <span>{post.likes}</span>
              </button>
              <button
                className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                onClick={() =>
                  setOpenComments((p) => ({ ...p, [post._id]: !p[post._id] }))
                }
              >
                <FaRegComment size={16} />
                {/* <span>{post.comments.length}</span> */}
              </button>
              <button
                className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                onClick={() => handleReposts(post._id)}
              >
                <FaRetweet size={18} />
              </button>
            </div>

            {/* Comments */}
            {/* {openComments[post.id] && (
              <div
                className="mt-3 pt-3"
                style={{
                  borderTop: theme === "dark" ? "1px solid #2e2e2e" : "1px solid #e0e0e0",
                }}
              >
                {post.comments.map((c, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-start">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: "#feba00", color: "#000" }}
                    >
                      {c.author?.[0]}
                    </div>
                    <div
                      className="rounded-lg px-3 py-2 text-xs flex-1"
                      style={{ backgroundColor: inputBg, color: textColor }}
                    >
                      <span className="font-semibold">{c.author}: </span>
                      {c.text}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    className="flex-1 rounded-lg px-3 py-2 text-xs outline-none"
                    style={{
                      backgroundColor: inputBg,
                      color: textColor,
                      border: theme === "dark"
                        ? "1px solid #2e2e2e"
                        : "1px solid #e0e0e0",
                    }}
                    placeholder="Write a comment..."
                    value={commentText[post.id] || ""}
                    onChange={(e) =>
                      setCommentText((p) => ({
                        ...p,
                        [post.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleComment(post.id)
                    }
                  />
                  <button
                    className="btn btn-xs px-4"
                    style={{
                      backgroundColor: "#feba00",
                      color: "#000",
                      border: "none",
                      fontWeight: 600,
                    }}
                    onClick={() => handleComment(post.id)}
                  >
                    Send
                  </button>
                </div>
              </div>
            )} */}
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

export default Posts;
