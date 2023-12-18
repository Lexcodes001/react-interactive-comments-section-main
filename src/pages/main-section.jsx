import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/navbar";
import { Link } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import useScrollMovement from "../hooks/useScroll";
import { CurrentUserContext } from "../pages/root";
import ARPng from "../assets/images/avatars/image-amyrobson.png";
import ARWebp from "../assets/images/avatars/image-amyrobson.webp";
import JOPng from "../assets/images/avatars/image-juliusomo.png";
import JOWebp from "../assets/images/avatars/image-juliusomo.webp";
import MBPng from "../assets/images/avatars/image-maxblagun.png";
import MBWebp from "../assets/images/avatars/image-maxblagun.webp";
import RMPng from "../assets/images/avatars/image-ramsesmiron.png";
import RMWebp from "../assets/images/avatars/image-ramsesmiron.webp";
import deleteIcon from "../assets/images/icon-delete.svg";
import editIcon from "../assets/images/icon-edit.svg";
import minusIcon from "../assets/images/icon-minus.svg";
import plusIcon from "../assets/images/icon-plus.svg";
import replyIcon from "../assets/images/icon-reply.svg";

const users = [
  {
    image: {
      png: JOPng,
      webp: JOWebp,
    },
    username: "juliusomo",
  },
  {
    image: {
      png: ARPng,
      webp: ARWebp,
    },
    username: "amyrobson",
  },
  {
    image: {
      png: MBPng,
      webp: MBWebp,
    },
    username: "maxblagun",
  },
  {
    image: {
      png: RMPng,
      webp: RMWebp,
    },
    username: "ramsesmiron",
  },
];
const variants = {
  leftOpened: {
    opacity: 1,
    x: 0,
    transition: {
      type: "tween",
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  leftClosed: {
    opacity: 0,
    x: "100%",
    transition: {
      type: "tween",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  topOpened: {
    opacity: 1,
    x: 0,
    y: 0,
    zIndex: 0,
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.5,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  topClosed: {
    opacity: 0,
    x: 0,
    y: "-200%",
    zIndex: -5,
    scale: 0,
    transition: {
      type: "spring",
      bounce: 0.5,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  topReveal: {
    opacity: 1,
    x: 0,
    y: 0,
    zIndex: 0,
    scaleY: 1,
    transition: {
      type: "spring",
      bounce: 0.5,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  topHide: {
    opacity: 0,
    x: 0,
    y: 0,
    zIndex: 0,
    scaleY: 0,
    transition: {
      type: "spring",
      bounce: 0.5,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  desktopUsersOpened: {
    opacity: 1,
    x: -257,
    y: 48,
    zIndex: 0,
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.5,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  desktopUsersClosed: {
    opacity: 0,
    x: -50,
    y: "-200%",
    zIndex: 0,
    scale: 0.5,
    transition: {
      type: "spring",
      bounce: 0.5,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  reveal: {
    scale: 1,
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      duration: 2,
    },
  },
  hide: {
    scale: 0.8,
    opacity: 0,
    x: -10,
    transition: {
      type: "spring",
      duration: 2,
    },
  },
};

const MainSection = (props) => {
  const [modalState, setModalState] = useState(false);
  const [isComment, setIsComment] = useState(null);
  const [commentId, setCommentId] = useState(null);
  const [replyId, setReplyId] = useState(null);
  const [hasCommented, setHasCommented] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [hasReplied, setHasReplied] = useState(false);
  const [replyingTo, setReplyingTo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [hasDeleted, setHasDeleted] = useState(false);
  const [filterContent, setFilterContent] = useState("");
  const { data, error, isLoading } = useFetchData();

  const [commentData, setCommentData] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [update, setUpdate] = useState(true);
  const [pause, setPause] = useState(false);
  const [savedReplyContent, setSavedReplyContent] = useState([]);
  const [savedEditContent, setSavedEditContent] = useState([]);
  const [inputScrollHeight, setInputScrollHeight] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const inputBoxRef = useRef(null);
  const scrollListenerRef = useRef(null);
  const stickyElementRef = useRef(null);

  const [btnText, setBtnText] = useState("Send");
  const [sMsg, setSMsg] = useState([]);
  const [dMsg, setDMsg] = useState(null);
  const [checkReplyInfo, setCheckReplyInfo] = useState(false);
  const [checkEditInfo, setCheckEditInfo] = useState(false);

  const [goingDown, setGoingDown] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const currentUser = useContext(CurrentUserContext);

  // for making the input box dispay or hide
  useEffect(() => {
    let lastScrollPosition = window.pageYOffset;
    const inputRef = inputBoxRef.current;

    const handleScroll = () => {
      if (data.length !== 0) {
        const currentScrollPosition = window.pageYOffset;
        const inputRef = inputBoxRef.current;

        if (currentScrollPosition > lastScrollPosition) {
          setGoingDown(true);
        } else {
          setGoingDown(false);
        }

        if (
          window.innerHeight + window.pageYOffset >=
            document.body.offsetHeight - 100 ||
          window.pageYOffset === 0 ||
          inputRef == document.activeElement
        ) {
          setGoingDown(false);
        }

        lastScrollPosition = currentScrollPosition;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [inputBoxRef]);

  // For making sticky element
  useEffect(() => {
    if (window.innerWidth < 769) {
      const handleScroll = () => {
        const element = stickyElementRef.current;

        if (element) {
          const { bottom } = element.getBoundingClientRect();
          setIsSticky(bottom >= window.innerHeight);
        }
      };

      scrollListenerRef.current = handleScroll;

      const handleScrollEvent = () => {
        if (scrollListenerRef.current) {
          scrollListenerRef.current();
        }
      };

      window.addEventListener("scroll", handleScrollEvent);

      return () => {
        window.removeEventListener("scroll", handleScrollEvent);
      };
    }
  }, [window.pageYOffset, stickyElementRef, scrollListenerRef]);

  useEffect(() => {
    let randomTime = Math.floor(Math.random() * 3000);
    if (!pause) {
      setCommentData(data);
      setTimeout(function () {
        setHasLoaded(true);
      }, randomTime);
      // setPause(!pause);
    }
  }, [data]);

  useEffect(() => {
    if (!pause) {
      const refreshPage = setInterval(() => {
        setUpdate(!update);
      }, 500);
      return () => clearInterval(refreshPage);
    }
  }, [update, pause]);

  if (error && commentData.length === 0) {
    return <div>Error is {error.message}</div>;
  }

  // for checking and displaying any alert or info
  useEffect(() => {
    let info;
    if (isEditing && checkEditInfo) {
      info = {
        mode: "dynamic",
        infoTag: (
          <motion.p
            key={0}
            variants={variants}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.5 }}
          >
            You are currently editing this {!isComment ? "reply" : "comment"}:{" "}
            <br /> "
            <em className="bold">{filterContent.slice(0, 30).trim()}</em>
            ..."
          </motion.p>
        ),
      };
      setDMsg(info);
      setCheckEditInfo(null);
    }

    if (isReplying && checkReplyInfo) {
      info = {
        mode: "dynamic",
        infoTag: (
          <motion.p
            key={1}
            variants={variants}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.5 }}
          >
            You are currently replying to{" "}
            <em className="bold">@{replyingTo}</em>
          </motion.p>
        ),
      };
      setDMsg(info);
      setCheckReplyInfo(null);
    }

    if (hasEdited) {
      info = {
        mode: "static",
        action: "hasEdited",
        infoTag: (
          <motion.p
            key={3}
            variants={variants}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.5 }}
          >
            You just edited this {isComment ? "comment" : "reply"}: <br /> "
            <em className="bold">{filterContent.slice(0, 30).trim()}</em>
            ..."
          </motion.p>
        ),
      };
      setSMsg([...sMsg, info]);
      setHasEdited(false);
      setTimeout(function () {
        setSMsg([]);
      }, 5000);
    }

    if (hasReplied) {
      info = {
        mode: "static",
        action: "hasReplied",
        infoTag: (
          <motion.p
            key={4}
            variants={variants}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.5 }}
          >
            You just replied to <em className="bold">@{replyingTo}</em>
          </motion.p>
        ),
      };
      setSMsg([...sMsg, info]);
      setHasReplied(false);
      setTimeout(function () {
        setSMsg([]);
      }, 5000);
    }

    if (hasCommented) {
      info = {
        mode: "static",
        action: "hasCommented",
        infoTag: (
          <motion.p
            key={2}
            variants={variants}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.5 }}
          >
            You just added a new comment: <br /> "
            <em className="bold">{filterContent.slice(0, 30).trim()}</em>
            ..."
          </motion.p>
        ),
      };
      setSMsg([...sMsg, info]);
      setHasCommented(false);
      setTimeout(function () {
        setSMsg([]);
      }, 5000);
    }

    if (hasDeleted) {
      info = {
        mode: "static",
        action: "hasDeleted",
        infoTag: (
          <motion.p
            key={5}
            variants={variants}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isComment ? (
              <>The comment</>
            ) : (
              <>
                Your reply to <em className="bold">@{replyingTo}</em>
              </>
            )}{" "}
            has been removed successfully!
          </motion.p>
        ),
      };
      setSMsg([...sMsg, info]);
      setHasDeleted(false);
      setTimeout(function () {
        setSMsg([]);
      }, 5000);
    }
  }, [
    variants,
    filterContent,
    replyingTo,
    isEditing,
    isReplying,
    hasCommented,
    hasEdited,
    hasReplied,
    hasDeleted,
    isComment,
    commentId,
    replyId,
  ]);

  let deleteSvg = (
      <svg width="15" height="14" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
          fill="#fff"
        />
      </svg>
    ),
    messageSvg = (
      <svg
        width="18"
        height="18"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        id="message"
      >
        <path
          fill="#fff"
          d="M20.34,9.32l-14-7a3,3,0,0,0-4.08,3.9l2.4,5.37h0a1.06,1.06,0,0,1,0,.82l-2.4,5.37A3,3,0,0,0,5,22a3.14,3.14,0,0,0,1.35-.32l14-7a3,3,0,0,0,0-5.36Zm-.89,3.57-14,7a1,1,0,0,1-1.35-1.3l2.39-5.37A2,2,0,0,0,6.57,13h6.89a1,1,0,0,0,0-2H6.57a2,2,0,0,0-.08-.22L4.1,5.41a1,1,0,0,1,1.35-1.3l14,7a1,1,0,0,1,0,1.78Z"
        ></path>
      </svg>
    ),
    editSvg = (
      <svg
        width="18"
        height="18"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        id="comment-edit"
      >
        <path
          fill="#fff"
          d="M21.71,4.72,19.28,2.29a1,1,0,0,0-1.41,0L12.29,7.87a1,1,0,0,0-.29.71V11a1,1,0,0,0,1,1h2.42a1,1,0,0,0,.71-.29l5.58-5.58A1,1,0,0,0,21.71,4.72ZM15,10H14V9l4.58-4.58,1,1Zm4,2h0a1,1,0,0,0-1,1,7,7,0,0,1-7,7H5.41l.64-.63a1,1,0,0,0,0-1.42A7,7,0,0,1,11,6a1,1,0,0,0,0-2h0A9,9,0,0,0,4,18.62L2.29,20.29a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,22h8a9,9,0,0,0,9-9A1,1,0,0,0,19,12Z"
        ></path>
      </svg>
    ),
    editAltSvg = (
      <svg
        width="18"
        height="18"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        id="comment-alt-edit"
      >
        <path
          fill="#fff"
          d="M18.5,5.5h-4a1,1,0,0,0,0,2h4a1,1,0,0,1,1,1v9.72l-1.57-1.45a1,1,0,0,0-.68-.27H8.5a1,1,0,0,1-1-1v-1a1,1,0,0,0-2,0v1a3,3,0,0,0,3,3h8.36l3,2.73a1,1,0,0,0,.68.27,1.1,1.1,0,0,0,.4-.08,1,1,0,0,0,.6-.92V8.5A3,3,0,0,0,18.5,5.5Zm-9.42,7H11.5a1,1,0,0,0,1-1V9.08a1,1,0,0,0-.29-.71L6.63,2.79a1,1,0,0,0-1.41,0L2.79,5.22a1,1,0,0,0,0,1.41l5.58,5.58A1,1,0,0,0,9.08,12.5ZM5.92,4.91,10.5,9.49v1h-1L4.91,5.92Z"
        ></path>
      </svg>
    );

  const addBtn = () => {
    const createDate = new Date().getTime();

    if (inputValue) {
      const commentInfo = {
        id: Number(`${data.length + 1}`),
        content: `${inputValue}`,
        createdAt: `${createDate}`,
        score: { count: 0, voteCheck: false },
        user: {
          image: {
            png: currentUser.image.png,
            webp: currentUser.image.webp,
          },
          username: currentUser.username,
        },
        replies: [],
      };
      let newData = [...commentData];
      newData.push(commentInfo);
      setCommentData(newData);
      localStorage.setItem("comments", JSON.stringify(newData));
      setCommentData(JSON.parse(localStorage.getItem("comments")));
      setPause(false);
      setHasCommented(true);
      setFilterContent(inputValue);
      setInputValue("");
    }
  };

  const addReply = (comment, content, id) => {
    const createDate = new Date().getTime();

    const replyInfo = {
      id: Number(`${data[id].replies.length + 1}`),
      content: `${content}`,
      createdAt: `${createDate}`,
      score: { count: 0, voteCheck: false },
      replyingTo: `${replyingTo}`,
      user: {
        image: {
          png: currentUser.image.png,
          webp: currentUser.image.webp,
        },
        username: currentUser.username,
      },
    };
    let newData = [...commentData];
    newData[id].replies.push(replyInfo);
    // setCommentData(newData);
    localStorage.setItem("comments", JSON.stringify(newData));
    // setCommmentData(JSON.parse(localStorage.getItem("comments")) || []);
    setHasReplied(true);
    setFilterContent(content);
    setIsReplying(false);
    setDMsg(null);
    setCheckReplyInfo(false);
  };

  const deleteBtn = (commentId, isComment, replyId) => {
    let newData = [...commentData];
    if (isComment) {
      newData.splice(commentId, 1);
    } else {
      newData[commentId].replies.splice(replyId, 1);
    }

    // setCommentData(newData);
    localStorage.setItem("comments", JSON.stringify(newData));
    showModal(false);
    setHasDeleted(true);
  };

  const handleVote = (comment, isComment, voteMode, replyId, id) => {
    let returnValue = voteMode ? 1 : -1;
    let newData = [...commentData];

    if (isComment) {
      if (newData[id].score.voteCheck === false) {
        if (voteMode) {
          newData[id].score.count++;
        } else {
          if (newData[id].score.count === 0) {
            return newData[id].score.count;
          } else {
            newData[id].score.count--;
          }
        }
        newData[id].score.voteCheck = returnValue;
      } else {
        if (newData[id].score.voteCheck === -1) {
          newData[id].score.count++;
        } else {
          newData[id].score.count--;
        }
        newData[id].score.voteCheck = false;
      }
    } else {
      if (newData[id].replies[replyId].score.voteCheck === false) {
        if (voteMode) {
          newData[id].replies[replyId].score.count++;
        } else {
          if (newData[id].replies[replyId].score.count === 0) {
            return newData[id].replies[replyId].score.count;
          } else {
            newData[id].replies[replyId].score.count--;
          }
        }
        newData[id].replies[replyId].score.voteCheck = returnValue;
      } else {
        if (newData[id].replies[replyId].score.voteCheck === -1) {
          newData[id].replies[replyId].score.count++;
        } else {
          newData[id].replies[replyId].score.count--;
        }
        newData[id].replies[replyId].score.voteCheck = false;
      }
    }
    // setCommentData(newData);
    localStorage.setItem("comments", JSON.stringify(newData));
    // setCommmentData(JSON.parse(localStorage.getItem("comments")) || []);
  };

  const showModal = (bool) => {
    if (bool) {
      setModalState(bool);
    } else {
      setModalState(bool);
    }
  };

  const saveState = (comment, isComment, reply) => {
    let newData = [...commentData];
    let cmtIndex = newData.indexOf(comment);
    if (reply !== null) {
      let rplyIndex = data[cmtIndex].replies.indexOf(reply);
      setReplyId(rplyIndex);
      setReplyingTo(reply.replyingTo);
    }
    setCommentId(cmtIndex);
    setIsComment(isComment);
  };

  const setEdit = (comment, isComment, reply) => {
    let newData = [...commentData];
    if (isComment) {
      setFilterContent(comment.content);
      setIsComment(true);
    } else {
      setFilterContent(reply.content);
      setIsComment(false);
    }
    isEditing === true && setDMsg(null);
    setIsEditing(!isEditing);
    setHasEdited(false);
    setIsReplying(false);
    setCheckReplyInfo(false);
    setCheckEditInfo((checkEditInfo) => {
      if (checkEditInfo === null) {
        return false;
      } else {
        return !checkEditInfo;
      }
    });
    // setCommentData(newData);
    localStorage.setItem("comments", JSON.stringify(newData));
    // setCommmentData(JSON.parse(localStorage.getItem("comments")) || []);
  };

  const editContent = (cmnt, isComment, replyId, content, id) => {
    let newData = [...commentData];
    if (isComment) {
      setIsComment(true);
      newData[id].content = content;
    } else {
      setIsComment(false);
      newData[id].replies[replyId].content = content;
    }
    setDMsg(null);
    setHasEdited(true);
    setIsEditing(false);
    setCheckEditInfo(false);
    // setCommentData(newData);
    localStorage.setItem("comments", JSON.stringify(newData));
    // setCommmentData(JSON.parse(localStorage.getItem("comments")) || []);
  };

  const setReply = (comment, isComment, reply) => {
    let newData = [...commentData];
    setIsEditing(false);
    setCheckEditInfo(false);
    if (isReplying === true) {
      setDMsg(null);
      setIsReplying(false);
    }

    setCheckReplyInfo((checkReplyInfo) => {
      if (checkReplyInfo === null) {
        setIsReplying(false);
        return false;
      } else if (checkReplyInfo) {
        setIsReplying(true);
        isComment
          ? setReplyingTo(comment.user.username)
          : setReplyingTo(reply.user.username);
        return true;
      } else {
        setIsReplying(true);
        isComment
          ? setReplyingTo(comment.user.username)
          : setReplyingTo(reply.user.username);
        return true;
      }
    });
    console.log("got here!");
    // setCommentData(newData);
    // localStorage.setItem("comments", JSON.stringify(newData));
    // setCommmentData(JSON.parse(localStorage.getItem("comments")) || []);
  };

  const ReplyBox = (props) => {
    const [replyValue, setReplyValue] = useState("");
    const [inputScrollHeight, setInputScrollHeight] = useState(null);
    return (
      <div className="reply-input-box">
        <picture>
          <source srcSet={currentUser.image.webp} media="(min-width: 969px)" />
          <source srcSet={currentUser.image.png} media="(min-width: 375px)" />
          <img src={currentUser.image.png} alt="user_name" />
        </picture>

        <textarea
          id="userReply"
          name="userReply"
          value={replyValue}
          onChange={(event) => {
            setReplyValue(event.target.value);
            setInputScrollHeight("auto");
            setInputScrollHeight(event.target.scrollHeight - 6);
          }}
          style={{
            height:
              inputScrollHeight < 46 || replyValue === ""
                ? 46
                : inputScrollHeight + "px",
          }}
        />

        <button
          type="#"
          onClick={() => {
            props.setAddReply(props.comment, replyValue);
          }}
        >
          Reply
        </button>
      </div>
    );
  };

  const EditBox = (props) => {
    const [editValue, setEditValue] = useState(
      props.isComment ? props.comment.content : props.reply.content
    );
    const [inputScrollHeight, setInputScrollHeight] = useState(null);

    return (
      <div className="edit-input-box">
        <textarea
          id="userEdit"
          name="userEdit"
          value={editValue}
          onChange={(event) => {
            setEditValue(event.target.value);
            setInputScrollHeight("auto");
            setInputScrollHeight(event.target.scrollHeight - 6);
          }}
          style={{
            height:
              inputScrollHeight < 46 || editValue === ""
                ? 46
                : inputScrollHeight + "px",
          }}
        />

        <button
          type="#"
          onClick={() =>
            props.setEditContent(
              props.comment,
              props.isComment,
              props.reply,
              editValue
            )
          }
        >
          Edit
        </button>
      </div>
    );
  };

  const checkForActions = (comment, isComment, reply, commentId, replyId) => {
    let commentActions = (
      <>
        <motion.span
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            deleteContent(comment, isComment, null);
          }}
          className="delete"
        >
          <img src={deleteIcon} alt="." />
          Delete
        </motion.span>
        <motion.span
          whileTap={{ scale: 0.9 }}
          onClick={() => prepSetEdit(comment, isComment, false)}
          className="edit"
        >
          <img src={editIcon} alt="." />
          Edit
        </motion.span>
      </>
    );

    let replyActions = (
      <>
        <motion.span
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            deleteContent(comment, isComment, reply);
          }}
          className="delete"
        >
          <img src={deleteIcon} alt="." />
          Delete
        </motion.span>
        <motion.span
          whileTap={{ scale: 0.9 }}
          onClick={() => prepSetEdit(comment, isComment, reply)}
          className="edit"
        >
          <img src={editIcon} alt="." />
          Edit
        </motion.span>
      </>
    );

    if (isComment) {
      if (comment.user.username === currentUser.username) {
        return commentActions;
      } else {
        return (
          <motion.span
            whileTap={{ scale: 0.8 }}
            onClick={() => setupReply(comment, true, null)}
            className="reply"
          >
            <img src={replyIcon} alt="." />
            Reply
          </motion.span>
        );
      }
    } else {
      if (reply.user.username === currentUser.username) {
        return replyActions;
      } else {
        return (
          <motion.span
            whileTap={{ scale: 0.8 }}
            onClick={() => setupReply(comment, false, reply)}
            className="reply"
          >
            <img src={replyIcon} alt="." />
            Reply
          </motion.span>
        );
      }
    }
  };

  const checkReply = (comment, commentId) => {
    if (comment.replies.length !== 0) {
      return comment.replies.map((reply, replyId) => (
        <div key={replyId}>
          <li
            className={`reply-box reply-item${commentData[
              commentData.indexOf(comment)
            ].replies.indexOf(reply)}}`}
          >
            <div className="user-details box">
              <picture>
                <source
                  srcSet={reply.user.image.webp}
                  media="(min-width: 969px)"
                />
                <source
                  srcSet={reply.user.image.png}
                  media="(min-width: 375px)"
                />
                <img src={reply.user.image.png} alt="user_name" />
              </picture>
              <Link to={`${reply.user.username}/profile`}>
                <p className="name">{reply.user.username}</p>
              </Link>
              <p
                className="user-badge"
                style={{
                  display:
                    reply.user.username === currentUser.username
                      ? "block"
                      : "none",
                }}
              >
                {reply.user.username === currentUser.username ? (
                  <span>You</span>
                ) : (
                  ""
                )}
              </p>
              <p className="timestamp">
                {isNaN(reply.createdAt) == false
                  ? updateTimeStamp(reply.createdAt)
                  : reply.createdAt}
              </p>
            </div>

            <div className="comment box">
              {reply.user.username === currentUser.username &&
              savedEditContent[1] === reply ? (
                <EditBox
                  key={replyId}
                  comment={comment}
                  isComment={false}
                  reply={reply}
                  editContent={editContent}
                />
              ) : (
                <p>
                  <span className="replying-to">
                    <Link to={`${reply.replyingTo}/profile`}>
                      @{reply.replyingTo}
                    </Link>{" "}
                  </span>
                  {replaceNewlineWithBr(reply.content)}
                </p>
              )}
            </div>

            <div className="actions box">
              {checkForActions(comment, false, reply, commentId, replyId)}
            </div>

            <div className="votes box">
              <motion.img
                whileTap={{ scale: 1.3 }}
                onClick={() => setHandleVote(false, true, comment, reply)}
                className="plus"
                src={plusIcon}
                style={{
                  filter:
                    reply.score.voteCheck === 1 ? `saturate(100)` : `none`,
                }}
              />
              <p>{reply.score.count}</p>
              <motion.img
                whileTap={{ scale: 1.3 }}
                onClick={() => setHandleVote(false, false, comment, reply)}
                className="minus"
                src={minusIcon}
                style={{
                  filter:
                    reply.score.voteCheck === -1 ? `saturate(100)` : `none`,
                }}
              />
            </div>
          </li>
          {reply.user.username != currentUser.username &&
          reply === savedReplyContent[1] ? (
            <ReplyBox
              key={replyId}
              comment={comment}
              currentUser={currentUser}
              setAddReply={setAddReply}
            />
          ) : (
            ""
          )}
        </div>
      ));
    } else {
      return "";
    }
  };

  const setHandleVote = (isComment, voteMode, comment, reply) => {
    let id = commentData.indexOf(comment);
    let replyId = commentData[id].replies.indexOf(reply);
    handleVote(comment, isComment, voteMode, replyId, id);
  };

  const prepSetEdit = (comment, isComment, reply) => {
    setPause(!pause);
    let id = commentData.indexOf(comment);
    setEdit(comment, isComment, reply, id);
    if (isComment) {
      if (savedEditContent[0] === comment) {
        setSavedEditContent([false, false]);
      } else {
        setSavedEditContent([comment, reply]);
      }
    } else {
      if (savedEditContent[0] === comment && savedEditContent[1] === reply) {
        setSavedEditContent([false, false]);
      } else {
        setSavedEditContent([comment, reply]);
      }
    }
    setSavedReplyContent([false, false]);
  };

  const setEditContent = (comment, isComment, reply, content) => {
    setPause(false);
    let id = commentData.indexOf(comment);
    let replyId = commentData[id].replies.indexOf(reply);
    editContent(comment, isComment, replyId, content, id);
    setSavedEditContent([false, false]);
  };

  const setupReply = (comment, isComment, reply) => {
    setPause(!pause);
    let id = commentData.indexOf(comment);
    setReply(comment, isComment, reply, id);
    if (isComment) {
      if (savedReplyContent[0] === comment) {
        setSavedReplyContent([false, false]);
      } else {
        setSavedReplyContent([comment, false]);
      }
    } else {
      if (savedReplyContent[0] === comment && savedReplyContent[1] === reply) {
        setSavedReplyContent([false, false]);
      } else {
        setSavedReplyContent([comment, reply]);
      }
    }
    setSavedEditContent([false, false]);
  };

  const setAddReply = (comment, content) => {
    setPause(false);
    let id = commentData.indexOf(comment);
    addReply(comment, content, id);
    setSavedReplyContent([false, false]);
  };

  const deleteContent = (comment, isComment, reply) => {
    saveState(comment, isComment, reply);
    setTimeout(showModal(true), 5000);
  };

  const replaceNewlineWithBr = (str) => {
    return str
      .split("\n")
      .flatMap((line, index) => [
        line,
        index !== str.length - 1 && <br key={index} />,
      ]);
  };

  const updateTimeStamp = (createDate) => {
    let currentDate = new Date();
    let timeDiff = Math.round(currentDate.getTime() - createDate);

    if (timeDiff < 60000) {
      return "just now";
    } else if (timeDiff >= 60000 && timeDiff < 3600000) {
      let minuteRange = Math.round(timeDiff / 60000);
      if (minuteRange == 1) {
        return "a minute ago";
      } else {
        return `${minuteRange} mins ago`;
      }
    } else if (timeDiff >= 3600000 && timeDiff < 86400000) {
      let hourRange = Math.round(timeDiff / 3600000);
      if (hourRange == 1) {
        return "an hour ago";
      } else {
        return `${hourRange} hrs ago`;
      }
    } else if (timeDiff >= 86400000 && timeDiff < 604800000) {
      let weekRange = Math.round(timeDiff / 86400000);
      if (weekRange == 1) {
        return "a week ago";
      } else {
        return `${weekRange} wks ago`;
      }
    } else if (timeDiff >= 604800000 && timeDiff < 2592000000) {
      let monthRange = Math.round(timeDiff / 604800000);
      if (monthRange == 1) {
        return "a month ago";
      } else {
        return `${monthRange} month ago`;
      }
    } else {
      return `some years ago`;
    }
  };

  return (
    <>
      <Navbar users={users} variants={variants} />
      {!hasLoaded ? (
        <motion.div className="loader">
          <svg
            style={{
              margin: "auto",
              background: "none",
              display: "block",
              shapeRendering: "auto",
            }}
            width="200px"
            height="200px"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
          >
            <circle cx="30" cy="50" fill="var(--moderate-blue)" r="7">
              <animate
                attributeName="cx"
                repeatCount="indefinite"
                dur="0.8474576271186441s"
                keyTimes="0;0.5;1"
                values="50;40;50"
                begin="-0.42372881355932207s"
              ></animate>
            </circle>
            <circle cx="30" cy="50" fill="var(--soft-red)" r="7">
              <animate
                attributeName="cx"
                repeatCount="indefinite"
                dur="0.8474576271186441s"
                keyTimes="0;0.5;1"
                values="50;40;50"
                begin="0s"
              ></animate>
            </circle>
            <circle cx="30" cy="50" fill="var(--moderate-blue)" r="7">
              <animate
                attributeName="cx"
                repeatCount="indefinite"
                dur="0.8474576271186441s"
                keyTimes="0;0.5;1"
                values="50;40;50"
                begin="-0.42372881355932207s"
              ></animate>
              <animate
                attributeName="fill-opacity"
                values="0;0;1;1"
                calcMode="discrete"
                keyTimes="0;0.499;0.5;1"
                dur="0.8474576271186441s"
                repeatCount="indefinite"
              ></animate>
            </circle>
          </svg>
        </motion.div>
      ) : (
        <ul
          className="comments-container"
          variants={variants}
          initial="hide"
          animate="reveal"
          exit="hide"
          transition={{ type: "spring", duration: 1 }}
        >
          <AnimatePresence initial={true} mode="popLayout">
            {commentData.map((comment, commentId) => (
              <motion.div
                variants={variants}
                initial="hide"
                animate="reveal"
                exit="hide"
                transition={{ type: "spring", duration: 1 }}
                key={commentId}
              >
                <li
                  className={`comment-box comment-item${
                    commentData[commentData.indexOf(comment)]
                  }}`}
                >
                  <div className="user-details box">
                    <picture>
                      <source
                        srcSet={comment.user.image.webp}
                        media="(min-width: 969px)"
                      />
                      <source
                        srcSet={comment.user.image.png}
                        media="(min-width: 375px)"
                      />
                      <img src={comment.user.image.png} alt="user_name" />
                    </picture>
                    <p className="name">
                      <Link to={`${comment.user.username}/profile`}>
                        {comment.user.username}
                      </Link>
                    </p>
                    <p
                      className="user-badge"
                      style={{
                        display:
                          comment.user.username === currentUser.username
                            ? "block"
                            : "none",
                      }}
                    >
                      {comment.user.username === currentUser.username ? (
                        <span>You</span>
                      ) : (
                        ""
                      )}
                    </p>
                    <p className="timestamp">
                      {isNaN(comment.createdAt) === false
                        ? updateTimeStamp(comment.createdAt)
                        : comment.createdAt}
                    </p>
                  </div>

                  <div className="comment box">
                    {comment.user.username === currentUser.username &&
                    comment === savedEditContent[0] &&
                    savedEditContent[1] === false &&
                    isEditing ? (
                      <EditBox
                        key={commentId}
                        comment={comment}
                        isComment={true}
                        reply={null}
                        setEditContent={setEditContent}
                      />
                    ) : (
                      <p>{replaceNewlineWithBr(comment.content)}</p>
                    )}
                  </div>

                  <div className="actions box">
                    {checkForActions(comment, true, false, commentId, null)}
                  </div>

                  <div className="votes box">
                    <motion.img
                      whileTap={{ scale: 1.3 }}
                      onClick={() => setHandleVote(true, true, comment, null)}
                      className="plus"
                      src={plusIcon}
                      style={{
                        filter:
                          comment.score.voteCheck === 1
                            ? `saturate(100)`
                            : `none`,
                      }}
                    />
                    <p>{comment.score.count}</p>
                    <motion.img
                      whileTap={{ scale: 1.3 }}
                      onClick={() => setHandleVote(true, false, comment, null)}
                      className="minus"
                      src={minusIcon}
                      style={{
                        filter:
                          comment.score.voteCheck === -1
                            ? `saturate(100)`
                            : `none`,
                      }}
                    />
                  </div>
                </li>
                {comment.user.username != currentUser.username &&
                comment === savedReplyContent[0] &&
                savedReplyContent[1] === false &&
                isReplying ? (
                  <ReplyBox
                    key={commentId}
                    comment={comment}
                    currentUser={currentUser}
                    setupReply={setupReply}
                    setAddReply={setAddReply}
                  />
                ) : (
                  ""
                )}
                <ul className="reply-container">
                  {checkReply(comment, commentId)}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <motion.div
        className={`${isSticky ? "input-box is-sticky" : "input-box"} ${
          goingDown ? "fade-in-top" : "fade-in-bottom"
        }`}
        ref={stickyElementRef}
      >
        <div className="infoText">
          <AnimatePresence mode="popLayout">
            <motion.p
              variants={variants}
              initial="hide"
              animate="reveal"
              exit="hide"
              transition={{ type: "spring", duration: 0.8 }}
            >
              Write a comment below...
            </motion.p>
          </AnimatePresence>
        </div>

        <textarea
          ref={inputBoxRef}
          id="userInput"
          name="userInput"
          value={inputValue}
          style={{
            height:
              inputScrollHeight < 46 || inputValue === ""
                ? 46
                : inputScrollHeight + "px",
          }}
          onChange={(event) => {
            setInputValue(event.target.value);
            setInputScrollHeight("auto");
            setInputScrollHeight(event.target.scrollHeight - 6);
          }}
        />

        <picture>
          <source srcSet={currentUser.image.webp} media="(min-width: 969px)" />
          <source srcSet={currentUser.image.png} media="(min-width: 375px)" />
          <img src={currentUser.image.png} alt="user_name" />
        </picture>

        <button type="#" onClick={() => addBtn()}>
          {btnText}
        </button>
      </motion.div>

      {modalState && (
        <div className="modal-container">
          <div className="modal-box">
            <header>Delete {isComment ? "comment" : "reply"}</header>
            <p className="info">
              Are you sure you want to delete this{" "}
              {isComment ? "comment" : "reply"}?<br />
              This will remove the {isComment ? "comment" : "reply"} and can't
              be undone.
            </p>
            <div className="btns">
              <button onClick={() => setModalState(false)}>NO, CANCEL</button>
              <button
                onClick={() => {
                  deleteBtn(commentId, isComment, replyId);
                }}
              >
                YES, DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      <motion.div
        className="info-container"
        variants={variants}
        initial={{
          scale: 0.8,
          opacity: 0,
          transition: {
            type: "spring",
            duration: 1.5,
          },
        }}
        animate={{
          scale: 1,
          opacity: 1,
          left: "50%",
          x: "-50%",
          transition: {
            type: "spring",
            duration: 0.8,
          },
        }}
        exit={{
          scale: 0.8,
          opacity: 0,
          transition: {
            type: "spring",
            duration: 1.5,
          },
        }}
      >
        <AnimatePresence mode="popLayout">
          {sMsg.length === 0
            ? null
            : sMsg.map((info, key) => (
                <motion.div
                  className="alert-box"
                  key={key}
                  variants={variants}
                  initial={{ opacity: 0.5, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0.5 }}
                >
                  <div className="icon">
                    {info.action === "hasDeleted" ? deleteSvg : messageSvg}
                  </div>
                  {info.infoTag}
                </motion.div>
              ))}

          {dMsg === null ? null : (
            <motion.div
              className="alert-box"
              variants={variants}
              initial={{ opacity: 0.5, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0.5 }}
            >
              <div className="icon">{editAltSvg}</div>
              {dMsg.infoTag}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default MainSection;
