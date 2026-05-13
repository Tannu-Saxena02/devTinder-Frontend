import React, { useState, useRef, useEffect } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegComment, FaRetweet } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import Dialog from "../utils/Dialog";
import { useDispatch, useSelector } from "react-redux";
import { addPosts, appendPosts } from "../utils/postsSlice.js";
import { BsThreeDots } from "react-icons/bs";
import ConfirmDialog from "../utils/ConfirmDialog";

const POST_LIMIT = 10;

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
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
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
  const [showMenu, setShowMenu] = useState(null);
  const [postPage, setPostPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isAllPostsFeed, setIsAllPostsFeed] = useState(true);

  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editMedia, setEditMedia] = useState([]);
  const [editVisibility, setEditVisibility] = useState("anyone");
  const [activeButtonIndex,setActiveButtonIndex] = useState(-1);        

  const pickerRef = useRef(null);
  const textareaRef = useRef(null);
  const cursorPos = useRef(0);

  const [visibility, setVisibility] = useState("anyone");
  const [commentText, setCommentText] = useState({});
  const [openComments, setOpenComments] = useState({});
  const postData = useSelector((s) => s.posts);
  useEffect(() => {
    handlegetAllPosts(1, true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 250;

      if (isAllPostsFeed && isNearBottom && hasMorePosts && !postsLoading) {
        handlegetAllPosts(postPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAllPostsFeed, hasMorePosts, postPage, postsLoading]);

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
    return () => document.removeEventListener("mousedown", handler); // cler this event
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
  const closeConfirmDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setMediaPreview((prev) => [...prev, ...urls]);
  };
  const handleEditFileChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setEditMedia((prev) => [...prev, ...urls]);
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
              handlegetAllPosts(1, true);
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
              handlegetAllPosts(1, true);
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
  const handlegetAllPosts = async (page = 1, resetPosts = false) => {
    try {
      if (postsLoading) return;

      setPostsLoading(true);

      const res = await axios.get(BASE_URL + "/user/allposts", {
        params: {
          page,
          limit: POST_LIMIT,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        const postsResult = res.data?.data || [];


        if (resetPosts || page === 1) {
          dispatch(addPosts(postsResult));
        } else {
          dispatch(appendPosts(postsResult));
        }

       const hasNextPage = postsResult.length === POST_LIMIT;
        setPostPage(page);
        setHasMorePosts(hasNextPage);
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
      setPostsLoading(false);
    }
  };

  const startEditingPost = (post) => {
    setShowMenu(null);
    setEditingPostId(post._id);
    setEditContent(post?.postContent || "");
    setEditMedia(post?.media || []);
    setEditVisibility(post?.visibility === "anyone" ? "public" : "private");
  };

  const cancelEditingPost = () => {
    setEditingPostId(null);
    setEditContent("");
    setEditMedia([]);
    setEditVisibility("anyone");
  };

  const handleEditPost = async (postId) => {
    try {
      setLoading(true);
      const req = {
        postContent: editContent,
        media: editMedia,
        visibility: editVisibility === "anyone" ? "public" : "private",
      };
      const res = await axios.put(BASE_URL + "/posts/edit/" + postId, req, {
        withCredentials: true,
      });

      if (res.data.success) {
        if (res.data?.message.length >= 0) {
          cancelEditingPost();
          setDialog({
            status: true,
            isOpen: true,
            title: "Success",
            message: res.data.message,
            onClose: () => {
              setDialog((prev) => ({ ...prev, isOpen: false }));
              handlegetAllPosts(1, true);
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

  const handleDeletePost = async (postId) => {
    closeConfirmDialog();

    try {
      setLoading(true);
      const res = await axios.delete(BASE_URL + "/posts/delete/" + postId, {
        withCredentials: true,
      });

      if (res.data.success) {
        if (res.data?.message.length >= 0) {
          setDialog({
            status: true,
            isOpen: true,
            title: "Success",
            message: res.data.message,
            onClose: () => {
              setDialog((prev) => ({ ...prev, isOpen: false }));
              handlegetAllPosts(1, true);
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

  const openDeleteConfirmDialog = (postId) => {
    setShowMenu(null);
    setConfirmDialog({
      isOpen: true,
      title: "Delete Post",
      message: "Are you sure you want to delete this post?",
      onConfirm: () => handleDeletePost(postId),
    });
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(
        BASE_URL + "/posts/like",
        { postId },
        { withCredentials: true },
      );
      handlegetAllPosts(1, true);
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

  const handleExploreFeed= () => {
    setActiveButtonIndex(0);
    setIsAllPostsFeed(true);
    setHasMorePosts(true);
    handlegetAllPosts(1, true);
  };

  const handleAllUsersPosts = () => {
    setActiveButtonIndex(1);
    setIsAllPostsFeed(false);
    setHasMorePosts(false);
    handleUserPosts(user._id);
  };

  const handleReactionsButtonClick = () => {
    setActiveButtonIndex(2);
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
            onBlur={(e) => {
              cursorPos.current = e.target.selectionStart;
            }}
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
      {/* //here */}
      <div className="flex gap-2 mt-2 mb-4">
        <button
          type="button"       
          className="btn btn-sm"
          style={{
            backgroundColor: activeButtonIndex === 0 ? "#f0c000" : inputBg,
            color: textColor,
            border: "none",
            fontWeight: 600,
             borderRadius: 10,
          }}
          onClick={() => handleExploreFeed()}
        >
          Explore Feed
        </button>
        <button
          type="button"
          className="btn btn-sm"
          style={{
            backgroundColor: activeButtonIndex === 1 ? "#f0c000" : inputBg,
            color: textColor,
            border:
              theme === "dark" ? "1px solid #2e2e2e" : "1px solid #e0e0e0",
              borderRadius: 10,
          }}
          onClick={() => handleAllUsersPosts()}
          
        >
          My Posts
        </button>
        <button
          type="button"
          className="btn btn-sm"
          style={{
            backgroundColor: activeButtonIndex === 2 ? "#f0c000" : inputBg,
            color: textColor,
            border:
              theme === "dark" ? "1px solid #2e2e2e" : "1px solid #e0e0e0",
            borderRadius: 10,
          }}
          onClick={() => handleReactionsButtonClick()}
        >
          Reactions
        </button>
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
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {/* Three dots icon */}
              {editingPostId !== post._id && (
                <BsThreeDots
                  style={{
                    cursor: "pointer",
                    fontSize: 20,
                    color: theme === "dark" ? "#fff" : "#000",
                  }}
                  onClick={() =>
                    setShowMenu((current) =>
                      current === post._id ? null : post._id,
                    )
                  }
                />
              )}

              {/* Dropdown menu */}
              {showMenu === post._id && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 28,
                    backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
                    border:
                      theme === "dark" ? "1px solid #333" : "1px solid #ddd",
                    borderRadius: 10,
                    padding: 6,
                    width: 120,
                    boxShadow:
                      theme === "dark"
                        ? "0px 4px 12px rgba(0,0,0,0.5)"
                        : "0px 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 100,
                  }}
                >
                  <div
                    style={{
                      padding: "10px 12px",
                      cursor: "pointer",
                      borderRadius: 6,
                      color: theme === "dark" ? "#fff" : "#000",
                      transition: "0.2s",
                    }}
                    onClick={() => startEditingPost(post)}
                  >
                    Edit
                  </div>

                  <div
                    style={{
                      padding: "10px 12px",
                      cursor: "pointer",
                      borderRadius: 6,
                      color: "#ff4d4f",
                      transition: "0.2s",
                    }}
                    onClick={() => openDeleteConfirmDialog(post._id)}
                  >
                    Delete
                  </div>
                </div>
              )}
            </div>
            {/* edit container */}
            {editingPostId === post._id ? (
              <div className="mb-4">
                <select
                  value={editVisibility}
                  onChange={(e) => setEditVisibility(e.target.value)}
                  className="text-xs rounded-md px-2 py-1 mb-2 outline-none"
                  style={{
                    backgroundColor: inputBg,
                    color: textColor,
                    border:
                      theme === "dark"
                        ? "1px solid #2e2e2e"
                        : "1px solid #e0e0e0",
                    cursor: "pointer",
                  }}
                >
                  <option value="anyone">Anyone</option>
                  <option value="me">Only me</option>
                </select>
                <textarea
                  className="w-full resize-none rounded-lg p-3 text-sm outline-none"
                  style={{
                    backgroundColor: inputBg,
                    color: textColor,
                    border:
                      theme === "dark"
                        ? "1px solid #2e2e2e"
                        : "1px solid #e0e0e0",
                    minHeight: 100,
                  }}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  maxLength={500}
                  autoFocus
                />
                {editMedia.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editMedia.map((url, i) => (
                      <div key={url + i} className="relative inline-block">
                        <img
                          src={url}
                          alt="attachment"
                          className="rounded-lg max-h-40 object-cover"
                        />
                        <button
                          onClick={() =>
                            setEditMedia((prev) =>
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
                          x
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
                    {editContent.length}/500
                  </span>
                  <div className="flex items-center gap-2">
                    <label style={{ cursor: "pointer", fontSize: 13 }}>
                      Attach
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleEditFileChange}
                        accept="image/*,video/*"
                        multiple
                      />
                    </label>
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor:
                          theme === "dark" ? "#2a2a2a" : "#e5e7eb",
                        color: textColor,
                        border: "none",
                      }}
                      onClick={cancelEditingPost}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-sm px-5"
                      style={{
                        backgroundColor: "#feba00",
                        color: "#000",
                        fontWeight: 600,
                        border: "none",
                      }}
                      onClick={() => handleEditPost(post._id)}
                      disabled={!editContent.trim() || loading}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
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
                        src={url} // "https://images.pexels.com/photos/36305686/pexels-photo-36305686.jpeg"
                        alt="attachment"
                        className="rounded-lg max-h-64 object-contain w-full"
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Actions -like comments reposts*/}
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
      {postsLoading && (
        <div className="flex justify-center py-5">
          <span
            className="loading loading-spinner loading-md"
            style={{ color: "#feba00" }}
          ></span>
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
      {confirmDialog.isOpen && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onCancel={closeConfirmDialog}
          onConfirm={confirmDialog.onConfirm}
          confirmText="Confirm"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default Posts;
