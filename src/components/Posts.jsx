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
import { MdClose } from "react-icons/md";

const POST_LIMIT = 10;
const COMMENT_LIMIT = 10;

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

  const [content, setContent] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [mediaPreview, setMediaPreview] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const [postPage, setPostPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isAllPostsFeed, setIsAllPostsFeed] = useState(true);

  const [commentPages, setCommentPages] = useState({});
  const [hasMoreComments, setHasMoreComments] = useState({});
  const [commentsLoading, setCommentsLoading] = useState({});

  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editMedia, setEditMedia] = useState([]);
  const [editVisibility, setEditVisibility] = useState("anyone");
  const [activeButtonIndex, setActiveButtonIndex] = useState(-1);

  const pickerRef = useRef(null);
  const pickerButtonRef = useRef(null);
  const menuRef = useRef(null);
  const textareaRef = useRef(null);
  const cursorPos = useRef(0);

  const [visibility, setVisibility] = useState("anyone");
  const [commentText, setCommentText] = useState({}); // value for input
  const [openComments, setOpenComments] = useState({});
  const [parentCommentId, setParentCommentId] = useState(null);
  const [postComments, setPostComments] = useState({});
  const [toggleReplies, setToggleReplies] = useState({}); // for toggling replies
  const [replyComments, setReplyComments] = useState({}); // store response as replies
  const [likedUsersDialog, setLikedUsersDialog] = useState({
    // we can make three seprate state
    isOpen: false,
    users: [],
    isLoading: false,
  }); //need to chnage this
  const postData = useSelector((s) => s.posts);
  useEffect(() => {
    handleExploreFeed();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 250;

      if (isAllPostsFeed && isNearBottom && hasMorePosts) {
        handlegetAllPosts(postPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAllPostsFeed, hasMorePosts, postPage]);

  useEffect(() => {
    const handler = (e) => {
      const clickedPicker = pickerRef.current?.contains(e.target);
      const clickedPickerButton = pickerButtonRef.current?.contains(e.target);

      if (!clickedPicker && !clickedPickerButton) {
        setShowPicker(false);
      }
    };
    // It listens for any mousedown event on the entire page.
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler); // cler this event
  }, []);

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(null);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
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
  const closeLikedUsersDialog = () => {
    setLikedUsersDialog({
      isOpen: false,
      users: [],
      isLoading: false,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setMediaPreview((prev) => [...prev, ...previews]);
    e.target.value = "";
  };

  const removeMediaPreview = (index) => {
    setMediaPreview((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const getMediaUrl = (media) => {
    const url = typeof media === "string" ? media : media?.url;
    if (!url) return ""; //returns empty string if no URL
    // returns direct URL for: http https  blob otherwise adds backend URL before relative path
    if (url.startsWith("http") || url.startsWith("https") || url.startsWith("blob:")) {
      return url;
    }
    return `${BASE_URL.replace("/api", "")}/${url.replace(/^\/+/, "")}`;
  };

  const handleEditFileChange = (e) => {
    const files = Array.from(e.target.files);

    const newMedia = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      isExisting: false,
    }));

    setEditMedia((prev) => [...prev, ...newMedia]);
    e.target.value = "";
  };
  const handleEmojiClick = (emojiData) => {
    const pos = cursorPos.current;
    const emoji = emojiData.emoji;
    setContent((prev) => prev.slice(0, pos) + emoji + prev.slice(pos));
    cursorPos.current = pos + emoji.length;
  };

  const handleCreateComments = async (postId) => {
    const text = commentText[postId]?.trim(); //extract value from input value
    if (!text) return;

    try {
      setLoading(true);
      const req = {
        content: text,
        parentCommentId,
      };
      const res = await axios.post(BASE_URL + "/createComment/" + postId, req, {
        withCredentials: true,
      });

      if (res.data.success) {
        if (res.data?.message.length >= 0) {
          setCommentText((prev) => ({ ...prev, [postId]: "" }));
          setParentCommentId(null);
          setDialog({
            status: true,
            isOpen: true,
            title: "Success",
            message: res.data.message,
            onClose: () => {
              setDialog((prev) => ({ ...prev, isOpen: false }));
              handleGetAllTopLevelComments(postId, 1, true);
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

  const handleGetAllTopLevelComments = async (
    postId,
    page = 1,
    resetComments = false,
  ) => {
    if (commentsLoading[postId]) return;

    try {
      setCommentsLoading((prev) => ({ ...prev, [postId]: true }));
      const res = await axios.get(BASE_URL + "/post/" + postId, {
        params: {
          page,
          limit: COMMENT_LIMIT,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        const commentsData = res.data?.data;
        const comments = Array.isArray(commentsData)
          ? commentsData
          : commentsData?.comments || [];
        const pagination = res.data?.pagination || {};
        const currentPage = Number(pagination.page ?? page);
        const totalPages = Number(pagination.pages ?? 0);

        setPostComments((prev) => ({
          ...prev,
          [postId]:
            resetComments || page === 1
              ? comments
              : [...(prev[postId] || []), ...comments],
        }));

        if (commentsData?.replies) {
          setReplyComments((prev) => ({
            ...prev,
            [postId]: commentsData.replies,
          }));
        }

        setCommentPages((prev) => ({
          ...prev,
          [postId]: currentPage,
        }));
        setHasMoreComments((prev) => ({
          ...prev,
          [postId]: currentPage < totalPages,
        }));
          if (activeButtonIndex === 0) handleExploreFeed();
          else if (activeButtonIndex === 1) handleAllUsersPosts();
          else if (activeButtonIndex === 2) handleReactionsButtonClick();
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
      setCommentsLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };
  const handleGetNestedComments = async (commentId) => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/nestedreplies/" + commentId, {
        withCredentials: true,
      });

      if (res.data.success) {
        if (res.data?.message.length >= 0) {
          setReplyComments((prev) => ({
            ...prev,
            [commentId]: res.data.data.replies,
          }));
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
  const handlePosts = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("postContent", content);
      formData.append(
        "visibility",
        visibility === "anyone" ? "public" : "private",
      );

      mediaPreview.forEach(({ file }) => {
        formData.append("media", file);
      });

      const res = await axios.post(BASE_URL + "/createposts", formData, {
        withCredentials: true,
      });
      console.log("request " + JSON.stringify(res?.data?.data));

      if (res.data.success) {
        if (res.data?.message.length >= 0) {
          setContent("");
          mediaPreview.forEach(({ url }) => URL.revokeObjectURL(url));
          setMediaPreview([]);
          setDialog({
            status: true,
            isOpen: true,
            title: "Success",
            message: res.data.message,
            onClose: () => {
              setDialog((prev) => ({ ...prev, isOpen: false }));
              if (activeButtonIndex === 0) handleExploreFeed();
              else if (activeButtonIndex === 1) handleAllUsersPosts();
              else if (activeButtonIndex === 2) handleReactionsButtonClick();
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
              if (activeButtonIndex === 0) handleExploreFeed();
              else if (activeButtonIndex === 1) handleAllUsersPosts();
              else if (activeButtonIndex === 2) handleReactionsButtonClick();
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
      setLoading(true);
      const res = await axios.get(BASE_URL + "/user/allposts", {
        params: {
          page,
          limit: POST_LIMIT,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        const postsResult = res.data?.data || [];
        const pagination = res.data?.pagination || {};
        const currentPage = Number(pagination.page ?? page);
        const totalPages = Number(pagination.pages ?? 0);

        if (resetPosts || page === 1) {
          dispatch(addPosts(postsResult));
        } else {
          dispatch(appendPosts(postsResult));
        }

        setPostPage(currentPage);
        setHasMorePosts(currentPage < totalPages);
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

  const handleGetAllLikes = async (postId) => {
    setLikedUsersDialog({
      isOpen: true,
      users: [],
      isLoading: true,
    });

    try {
      const res = await axios.get(BASE_URL + "/user/likes/" + postId, {
        withCredentials: true,
      });

      if (res.data.success) {
        console.log("Likes: " + res?.data?.data?.[0]?.likeByUsers);
        setLikedUsersDialog((prev) => ({
          ...prev,
          users: res.data?.data?.[0]?.likeByUsers,
          isLoading: false,
        }));
      } else {
        closeLikedUsersDialog();
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
          closeLikedUsersDialog();
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
          closeLikedUsersDialog();
          setDialog({
            status: false,
            isOpen: true,
            title: "Error",
            message: err?.response?.data?.error || "Something went wrong!",
            onClose: closeDialog,
          });
        }
      } else {
        closeLikedUsersDialog();
        setDialog({
          status: false,
          isOpen: true,
          title: "Error",
          message: err?.message || "Unexpected error",
          onClose: closeDialog,
        });
      }
    } finally {
      setLikedUsersDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleEditPost = async (postId) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("postContent", editContent);
      formData.append(
        "visibility",
        editVisibility === "anyone" ? "public" : "private",
      );

      const existingMedia = [];

      editMedia.forEach((item) => {
        if (item.isExisting) {
          existingMedia.push(item.url);
        } else if (item.file) {
          formData.append("media", item.file);
        }
      });

      formData.append("existingMedia", JSON.stringify(existingMedia));
      const res = await axios.put(
        BASE_URL + "/posts/edit/" + postId,
        formData,
        {
          withCredentials: true,
        },
      );

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
              if (activeButtonIndex === 0) handleExploreFeed();
              else if (activeButtonIndex === 1) handleAllUsersPosts();
              else if (activeButtonIndex === 2) handleReactionsButtonClick();
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
              if (activeButtonIndex === 0) handleExploreFeed();
              else if (activeButtonIndex === 1) handleAllUsersPosts();
              else if (activeButtonIndex === 2) handleReactionsButtonClick();
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
  const handleLike = async (postId) => {
    try {
      await axios.post(
        BASE_URL + "/posts/like",
        { postId },
        { withCredentials: true },
      );
      if (activeButtonIndex === 0) handleExploreFeed();
      else if (activeButtonIndex === 1) handleAllUsersPosts();
      else if (activeButtonIndex === 2) handleReactionsButtonClick();
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
  const handleUserReactionPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/user/liked-posts", {
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
  const startEditingPost = (post) => {
    setShowMenu(null);
    setEditingPostId(post._id);

    setEditContent(post?.postContent || "");

    setEditMedia(
      (post?.media || []).map((url) => ({
        url,
        file: null,
        isExisting: true,
      })),
    );
    setEditVisibility(post?.visibility === "anyone" ? "public" : "private");
  };

  const cancelEditingPost = () => {
    setEditingPostId(null);
    setEditContent("");
    setEditMedia([]);
    setEditVisibility("anyone");
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
  const handleExploreFeed = () => {
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
    handleUserReactionPosts();
  };
  const handleReply = (commentId, firstName, postId) => {
    setCommentText((prev) => ({
      ...prev,
      [postId]: `@${firstName} `,
    }));

    setParentCommentId(commentId);
  };

  const CommentItem = ({
    comment,
    level = 0,
    inputBg,
    textColor,
    toggleReplies,
    setToggleReplies,
    replyComments,
    setReplyComments,
    handleGetNestedComments,
    handleReply,
  }) => {
    return (
      <div
        className="flex flex-col gap-2 mb-3"
        style={{
          marginLeft: `${level * 25}px`,
        }}
      >
        <div className="flex gap-2 items-start">
          <img
            src={comment.userId?.photoUrl}
            alt="avatar"
            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
          />

          <div
            className="rounded-lg px-3 py-2 text-xs"
            style={{
              backgroundColor: inputBg,
              color: textColor,
            }}
          >
            <span className="font-semibold">
              {comment.userId?.firstName} {comment.userId?.lastName}:{" "}
            </span>

            {comment.content}
          </div>

          {/* Reply */}
          <div
            className="text-xs text-blue-500 hover:underline cursor-pointer mt-2"
            onClick={() =>
              handleReply(
                comment._id,
                comment.userId?.firstName,
                comment.postId,
              )
            }
          >
            <FaRegComment size={16} />
          </div>

          {(comment?.replies?.length ?? 0) > 0 && (
            <div
              className="text-xs text-blue-500 hover:underline cursor-pointer mt-2"
              onClick={() => {
                setToggleReplies((prev) => ({
                  ...prev,
                  [comment._id]: !prev[comment._id],
                }));

                handleGetNestedComments(comment._id);
              }}
            >
              {toggleReplies[comment._id] ? "collapse replies" : "see replies"}
            </div>
          )}
        </div>

        {/* Recursive Replies */}
        {toggleReplies[comment._id] &&
          (replyComments[comment._id] || []).map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              level={level + 1}
              inputBg={inputBg}
              textColor={textColor}
              toggleReplies={toggleReplies}
              setToggleReplies={setToggleReplies}
              replyComments={replyComments}
              setReplyComments={setReplyComments}
              handleGetNestedComments={handleGetNestedComments}
              handleReply={handleReply}
            />
          ))}
      </div>
    );
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
            className={`flex-1 resize-none rounded-lg p-3 text-sm outline-none ${
              theme === "dark" ? "placeholder-gray-500" : "placeholder-gray-400"
            }`} //placeholder color change based on theme
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
            {mediaPreview.map(({ url }, i) => (
              <div key={i} className="relative inline-block">
                <img
                  src={url}
                  alt="preview"
                  className="rounded-lg max-h-40 object-cover"
                />
                <button
                  onClick={() => removeMediaPreview(i)}
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
          <div className="flex items-center gap-2 relative">
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
              type="button"
              ref={pickerButtonRef}
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
              ref={showMenu === post._id ? menuRef : null}
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {editingPostId !== post._id /* Three dots icon */ &&
                post.isEditable &&
                post.isDeletable && (
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
                    {editMedia.map((media, i) => (
                      <div
                        key={(media?.url || "") + i}
                        className="relative inline-block"
                      >
                        <img
                          src={getMediaUrl(media)}
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
                    <label
                      style={{
                        cursor: "pointer",
                        fontSize: 13,
                        color: textColor,
                      }}
                    >
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
                  <div className="flex w-full flex-row flex-wrap gap-2 mb-4">
                    {post?.media.map((media, i) => (
                      <img
                        key={i}
                        src={getMediaUrl(media)}
                        alt="attachment"
                        className="h-38 w-38 shrink-0 rounded-lg object-cover sm:h-36 sm:w-36"
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
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="hover:opacity-70 transition-opacity"
                  onClick={() => handleLike(post._id)}
                  aria-label="Like post"
                >
                  {post?.likes > 0 ? (
                    <AiFillLike size={18} color="#feba00" />
                  ) : (
                    <AiOutlineLike size={18} />
                  )}
                </button>
                <button
                  type="button"
                  className="hover:underline hover:opacity-80 transition-opacity disabled:cursor-default disabled:hover:no-underline"
                  onClick={() => handleGetAllLikes(post._id)}
                  disabled={!post?.likes}
                  title={post?.likes ? "View liked users" : "No likes yet"}
                >
                  {post.likes}
                </button>
              </div>
              <button
                className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                onClick={() => {
                  const isOpen = !openComments[post._id];

                  // update state
                  setOpenComments({
                    ...openComments,
                    [post._id]: isOpen,
                  });

                  // fetch comments when opening
                  if (isOpen) {
                    handleGetAllTopLevelComments(post._id, 1, true);
                  }
                }}
              >
                <FaRegComment size={16} />
                {post?.commentCount >0 && <span>{post?.commentCount}</span>}
              </button>
              <button
                className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                onClick={() => handleReposts(post._id)}
              >
                <FaRetweet size={18} />
                {post?.repostCount > 0 && (
                  <div className="text-sm">{post?.repostCount}</div>
                )}
              </button>
            </div>
            {openComments[post._id] && (
              <>
                {/* Comments */}
                <div className="flex gap-2 my-2 py-2">
                  <input
                    className="flex-1 rounded-lg px-3 py-2 text-xs outline-none"
                    style={{
                      backgroundColor: inputBg,
                      color: textColor,
                      border:
                        theme === "dark"
                          ? "1px solid #2e2e2e"
                          : "1px solid #e0e0e0",
                    }}
                    placeholder="Write a comment..."
                    value={commentText[post._id] || ""}
                    onChange={(e) =>
                      setCommentText((p) => ({
                        ...p,
                        [post._id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCreateComments(post._id)
                    }
                  />
                  <button
                    className="btn btn-sm mb-1"
                    style={{
                      backgroundColor: "#feba00",
                      color: "#000",
                      border: "none",
                      fontWeight: 600,
                      alignSelf: "center",
                    }}
                    onClick={() => handleCreateComments(post._id)}
                  >
                    Send
                  </button>
                </div>
                {commentsLoading[post._id] &&
                  !(postComments[post._id] || []).length && (
                    <div className="flex justify-center py-3">
                      <span
                        className="loading loading-spinner loading-sm"
                        style={{ color: "#feba00" }}
                      ></span>
                    </div>
                  )}
                {(postComments[post._id] || []).map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    level={0}
                    inputBg={inputBg}
                    textColor={textColor}
                    toggleReplies={toggleReplies}
                    setToggleReplies={setToggleReplies}
                    replyComments={replyComments}
                    setReplyComments={setReplyComments}
                    handleGetNestedComments={handleGetNestedComments}
                    handleReply={handleReply}
                  />
                ))}
                {hasMoreComments[post._id] && (
                  <button
                    type="button"
                    className="btn btn-xs mt-1"
                    style={{
                      backgroundColor: inputBg,
                      color: textColor,
                      border:
                        theme === "dark"
                          ? "1px solid #2e2e2e"
                          : "1px solid #e0e0e0",
                    }}
                    disabled={commentsLoading[post._id]}
                    onClick={() =>
                      handleGetAllTopLevelComments(
                        post._id,
                        (commentPages[post._id] || 1) + 1,
                      )
                    }
                  >
                    {commentsLoading[post._id]
                      ? "Loading..."
                      : "Load more comments"}
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}
      {likedUsersDialog.isOpen && (
        <div className="modal modal-open" onClick={closeLikedUsersDialog}>
          <div
            className="modal-box rounded-xl border shadow-lg p-0 max-w-md"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",
              borderColor: theme === "dark" ? "#2e2e2e" : "#e0e0e0",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{
                borderColor: theme === "dark" ? "#2e2e2e" : "#e0e0e0",
              }}
            >
              <div>
                <h3
                  className="text-base font-semibold"
                  style={{ color: textColor }}
                >
                  Liked by
                </h3>
                <p
                  className="text-xs"
                  style={{ color: theme === "dark" ? "#aaa" : "#666" }}
                >
                  {likedUsersDialog?.users?.length}{" "}
                  {likedUsersDialog?.users?.length === 1 ? "person" : "people"}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-xs btn-circle mb-5"
                onClick={closeLikedUsersDialog}
                aria-label="Close liked users"
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {likedUsersDialog.isLoading ? (
                <div className="flex justify-center py-8">
                  <span
                    className="loading loading-spinner loading-md"
                    style={{ color: "#feba00" }}
                  ></span>
                </div>
              ) : likedUsersDialog.users.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {likedUsersDialog.users.map((likedUser, index) => {
                    return (
                      <div
                        key={likedUser?._id || likedUser?.id || index}
                        className="flex gap-3 rounded-lg p-3"
                        style={{
                          backgroundColor: inputBg,
                          border:
                            theme === "dark"
                              ? "1px solid #2e2e2e"
                              : "1px solid #e0e0e0",
                        }}
                      >
                        {likedUser?.photoUrl && (
                          <img
                            src={likedUser?.photoUrl}
                            alt={"Liked user"}
                            className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                          />
                        )}

                        <div className="min-w-0 flex-1">
                          {(likedUser?.firstName || likedUser?.lastName) && (
                            <p
                              className="text-sm font-semibold"
                              style={{ color: textColor }}
                            >
                              {likedUser?.firstName + " " + likedUser?.lastName}
                            </p>
                          )}
                          {likedUser?.about && (
                            <p
                              className="text-xs mt-2 line-clamp-2"
                              style={{ color: textColor }}
                            >
                              {likedUser?.about}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p
                  className="text-center text-sm py-8"
                  style={{ color: theme === "dark" ? "#aaa" : "#666" }}
                >
                  No likes yet.
                </p>
              )}
            </div>
          </div>
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
