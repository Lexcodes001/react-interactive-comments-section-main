import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import UserToggle from "../components/user-toggle";
import MainSection from "./main-section";
import ARPng from "../assets/images/avatars/image-amyrobson.png";
import ARWebp from "../assets/images/avatars/image-amyrobson.webp";
import JOPng from "../assets/images/avatars/image-juliusomo.png";
import JOWebp from "../assets/images/avatars/image-juliusomo.webp";
import MBPng from "../assets/images/avatars/image-maxblagun.png";
import MBWebp from "../assets/images/avatars/image-maxblagun.webp";
import RMPng from "../assets/images/avatars/image-ramsesmiron.png";
import RMWebp from "../assets/images/avatars/image-ramsesmiron.webp";

const DataSource = () => {
    

    
    
    
    
    
    
    
    
    const [btnText, setBtnText] = useState("Send");
    const [sMsg, setSMsg] = useState([]);
    const [dMsg, setDMsg] = useState(null);
    const [checkReplyInfo, setCheckReplyInfo] = useState(false);
    const [checkEditInfo, setCheckEditInfo] = useState(false);
    

    // Using Fetch API
    // useEffect(() => {
    //   fetch('./src/data.json')
    //     .then(response => {
    //       if (response.status !== 200) {
    //         throw new Error('Error fetching data');
    //       }
    //       alert('status is', response.status);
    //       return response.json();
    //     })
    //     .then(jsonData => {
    //       if (data.length < 1) {
    //         localStorage.setItem("currentUser", JSON.stringify(users[0]));
    //         localStorage.setItem("comments", JSON.stringify(jsonData));
    //         window.location.reload(false);
    //       }
    //     })
    //     .catch(error => setError(error));
    // }, []);


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
        const newData = [...data];
        newData.push(commentInfo);
        setData(newData);
        localStorage.setItem("comments", JSON.stringify(newData));
        setData(JSON.parse(localStorage.getItem("comments")));
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
      const newData = [...data];
      newData[id].replies.push(replyInfo);
      setData(newData);
      localStorage.setItem("comments", JSON.stringify(data));
      setData(JSON.parse(localStorage.getItem("comments")));
      setHasReplied(true);
      setFilterContent(content);
      setIsReplying(false);
      setDMsg(null);
      setCheckReplyInfo(false);
    };

    const deleteBtn = (commentId, isComment, replyId) => {
      if (isComment) {
        data.splice(commentId, 1);
      } else {
        data[commentId].replies.splice(replyId, 1);
      }
      localStorage.setItem("comments", JSON.stringify(data));
      showModal(false);
      setHasDeleted(true);
    };

    const handleVote = (comment, isComment, voteMode, replyId, id) => {
      let returnValue = voteMode ? 1 : -1;

      if (isComment) {
        if (data[id].score.voteCheck === false) {
          if (voteMode) {
            data[id].score.count++;
          } else {
            if (data[id].score.count === 0) {
              return data[id].score.count;
            } else {
              data[id].score.count--;
            }
          }
          data[id].score.voteCheck = returnValue;
        } else {
          if (data[id].score.voteCheck === -1) {
            data[id].score.count++;
          } else {
            data[id].score.count--;
          }
          data[id].score.voteCheck = false;
        }
      } else {
        if (data[id].replies[replyId].score.voteCheck === false) {
          if (voteMode) {
            data[id].replies[replyId].score.count++;
          } else {
            if (data[id].replies[replyId].score.count === 0) {
              return data[id].replies[replyId].score.count;
            } else {
              data[id].replies[replyId].score.count--;
            }
          }
          data[id].replies[replyId].score.voteCheck = returnValue;
        } else {
          if (data[id].replies[replyId].score.voteCheck === -1) {
            data[id].replies[replyId].score.count++;
          } else {
            data[id].replies[replyId].score.count--;
          }
          data[id].replies[replyId].score.voteCheck = false;
        }
      }
      localStorage.setItem("comments", JSON.stringify(data));
      setData(JSON.parse(localStorage.getItem("comments")));
    };

    const showModal = (bool) => {
      if (bool) {
        setModalState(bool);
      } else {
        setModalState(bool);
      }
    };

    const saveState = (comment, isComment, reply) => {
      let cmtIndex = data.indexOf(comment);
      if (reply !== null) {
        let rplyIndex = data[cmtIndex].replies.indexOf(reply);
        setReplyId(rplyIndex);
        setReplyingTo(reply.replyingTo);
      }
      setCommentId(cmtIndex);
      setIsComment(isComment);
    };

    const setEdit = (comment, isComment, reply) => {
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
      localStorage.setItem("comments", JSON.stringify(data));
      setData(JSON.parse(localStorage.getItem("comments")));
    };

    const editContent = (cmnt, isComment, replyId, content, id) => {
      if (isComment) {
        setIsComment(true);
        data[id].content = content;
      } else {
        setIsComment(false);
        data[id].replies[replyId].content = content;
      }
      setDMsg(null);
      setHasEdited(true);
      setIsEditing(false);
      setCheckEditInfo(false);
      localStorage.setItem("comments", JSON.stringify(data));
      setData(JSON.parse(localStorage.getItem("comments")));
    };

    const setReply = (comment, isComment, reply) => {
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
      localStorage.setItem("comments", JSON.stringify(data));
      setData(JSON.parse(localStorage.getItem("comments")));
    };
}