import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import deleteIcon from '../assets/images/icon-delete.svg';
import editIcon from '../assets/images/icon-edit.svg';
import minusIcon from '../assets/images/icon-minus.svg';
import plusIcon from '../assets/images/icon-plus.svg';
import replyIcon from '../assets/images/icon-reply.svg';

const MainSection = (props) => {
  const [commentData, setCommentData] = useState(props.data);
  const [update, setUpdate] = useState(true);
  const [pause, setPause] = useState(false);
  const [savedReplyContent, setSavedReplyContent] = useState([]);
  const [savedEditContent, setSavedEditContent] = useState([]);

  useEffect(() => {
    if (!pause) {
      setCommentData(props.data);
    }
  }, [props.data]);

  useEffect(() => {
    if (!pause) {
      const refreshPage = setInterval(() => {
        setUpdate(!update);
       }, 500);
       return () => clearInterval(refreshPage);
    }
  }, [update, pause]);

  if (props.error) {
    return <div>Error: {error.message}</div>;
  }

  const ReplyBox = (props) => {
    const [replyValue, setReplyValue] = useState('');
    const [inputScrollHeight, setInputScrollHeight] = useState(null);
    return(
      <div className="reply-input-box">
        <picture>
              <source 
                srcSet="./src/assets/images/avatars/image-juliusomo.webp"
                media="(min-width: 969px)"/>
              <source 
                srcSet="./src/assets/images/avatars/image-juliusomo.png"
                media="(min-width: 375px)"/>
              <img 
                src="./src/assets/images/avatars/image-juliusomo.png" 
                alt="user_name"/>
        </picture>
        
        <textarea 
          id="userReply"
          name="userReply"
          value={replyValue}
          onChange={(event)=>{
            setReplyValue(event.target.value);
            setInputScrollHeight('auto');
            setInputScrollHeight(event.target.scrollHeight - 6);
          }}
          style={{height: (inputScrollHeight < 46 || replyValue === '') ? 46 : inputScrollHeight +'px'}}
        />
        
        <button type="#" onClick={()=>{addReply(props.comment, replyValue)}}>Reply</button>
      </div>
    );
  }

  const EditBox = (props) => {
    const [editValue, setEditValue] = useState(props.isComment ? props.comment.content : props.reply.content);
    const [inputScrollHeight, setInputScrollHeight] = useState(null);

    return(
      <div className="edit-input-box">
        
        <textarea 
          id="userEdit"
          name="userEdit"
          value={editValue}
          onChange={(event)=>{
            setEditValue(event.target.value);
            setInputScrollHeight('auto');
            setInputScrollHeight(event.target.scrollHeight - 6);
          }}
          style={{height: (inputScrollHeight < 46 || editValue === '') ? 46 : inputScrollHeight + 'px'}}
        />
        
        <button type="#" onClick={()=> editContent(props.comment, props.isComment, props.reply, editValue)}>Edit</button>
      </div>
    );
  }

  const checkForActions = (comment, isComment, reply, commentId, replyId) => {
    let commentActions = <>
      <motion.span 
        whileTap={{scale: 0.9}}
        onClick={()=>{deleteContent(comment, isComment, null)}} className="delete"><img src={deleteIcon} alt="."/>Delete</motion.span>
      <motion.span 
        whileTap={{scale: 0.9}}
        onClick={()=>setEdit(comment, isComment, null)} className='edit'><img src={editIcon} alt='.'/>Edit</motion.span>
    </>;
    
    let replyActions = <>
        <motion.span 
          whileTap={{scale: 0.9}}
          onClick={()=>{deleteContent(comment, isComment, reply)}} className="delete"><img src={deleteIcon} alt="."/>Delete</motion.span>
        <motion.span 
          whileTap={{scale: 0.9}}
          onClick={()=>setEdit(comment, isComment, reply)} className='edit'><img src={editIcon} alt='.'/>Edit</motion.span>
      </>;
    
    if (isComment) {
      if (comment.user.username === props.currentUser.username) {
        return commentActions;
      } else {
        return <motion.span 
          whileTap={{scale: 0.8}}
          onClick={()=>setReply(comment, true, null)} className="reply"><img src={replyIcon} alt="."/>Reply</motion.span>;
      }
    } else {
      if (reply.user.username === props.currentUser.username) {
        return replyActions;
      } else {
        return <motion.span 
          whileTap={{scale: 0.8}}
          onClick={()=>setReply(comment, false, reply)} className="reply"><img src={replyIcon} alt="."/>Reply</motion.span>;
      }
    }
  }

  const checkReply = (comment, commentId) => {
    if (comment.replies.length !== 0) {
      //comment.replies = comment.replies.filter((item) => item != null);
      return(
        comment.replies.map((reply, replyId) => (
        //return (
              <div key={replyId}>
                <li className={`reply-box reply-item${commentData[commentData.indexOf(comment)].replies.indexOf(reply)}}`}>
                  <div className="user-details box">
                    <picture>
                      <source srcSet={reply.user.image.webp} media="(min-width: 969px)"/>
                      <source srcSet={reply.user.image.png} media="(min-width: 375px)"/>
                      <img src={reply.user.image.png} alt="user_name"/>
                    </picture>
                    <p className="name">{reply.user.username}</p>
                    <p className='user-badge' style= {{display: reply.user.username === props.currentUser.username ? 'block' : 'none'}}>{reply.user.username === props.currentUser.username ? <span>You</span> : ''}</p>
                    <p className="timestamp">{isNaN(reply.createdAt) == false ? updateTimeStamp(reply.createdAt) : (reply.createdAt) }</p>
                  </div>
                  
                  <div className="comment box">
                    {
                      (reply.user.username === props.currentUser.username) && (savedEditContent[1] === reply) ? <EditBox key={replyId} comment={comment} isComment={false} reply={reply}/> : <p><span className="replying-to">@{reply.replyingTo} </span>{replaceNewlineWithBr(reply.content)}</p>
                    }
                  </div>
                  
                  <div className="actions box">
                    {checkForActions(comment, false, reply, commentId, replyId)}
                  </div>
                  
                  <div className="votes box">
                    <motion.img
                      whileTap={{scale: 1.3}}
                      onClick={() => handleVote(false, true, comment, reply)} 
                      className="plus" src={plusIcon} 
                      style={{filter: reply.score.voteCheck === 1 ? `saturate(100)` : `none`}}/>
                    <p>{reply.score.count}</p>
                    <motion.img
                      whileTap={{scale: 1.3}}
                      onClick={() => handleVote(false, false, comment, reply)} 
                      className="minus" src={minusIcon} 
                      style={{filter: reply.score.voteCheck === -1 ? `saturate(100)` : `none`}}/>
                  </div>
                </li>
                {
                  (reply.user.username != props.currentUser.username) && (reply === savedReplyContent[1]) ? <ReplyBox key={replyId} comment={comment} /> : ''
                }
              </div>
      )));
    } else {
      return '';
    }
  }

  const handleVote = (isComment, voteMode, comment, reply) => {
    let id = commentData.indexOf(comment);
    let replyId = commentData[id].replies.indexOf(reply);
    props.handleVote(comment, isComment, voteMode, replyId, id);
  }

  const setEdit = (comment, isComment, reply) => {
    setPause(!pause);
    let id = commentData.indexOf(comment);
    props.setEdit(comment, isComment, reply, id);
    if (isComment) {
      if (savedEditContent[0] === comment) {
        setSavedEditContent([false, false]);
      } else {
        setSavedEditContent([comment, false]);
      }
    } else {
      if ((savedEditContent[0] === comment) && (savedEditContent[1] === reply)) {
        setSavedEditContent([false, false]);
      } else {
        setSavedEditContent([comment, reply]);
      }
    }
    setSavedReplyContent([false, false]);
  }

  const editContent = (comment, isComment, reply, content) => {
    setPause(false);
    let id = commentData.indexOf(comment);
    let replyId = commentData[id].replies.indexOf(reply);
    props.editContent(comment, isComment, replyId, content, id);
    setSavedEditContent([false, false]);
  }

  const setReply = (comment, isComment, reply) => {
    setPause(!pause);
    let id = commentData.indexOf(comment);
    props.setReply(comment, isComment, reply, id);
    if (isComment) {
      if (savedReplyContent[0] === comment) {
        setSavedReplyContent([false, false]);
      } else {
        setSavedReplyContent([comment, false]);
      }
    } else {
      if ((savedReplyContent[0] === comment) && (savedReplyContent[1] === reply)) {
        setSavedReplyContent([false, false]);
      } else {
        setSavedReplyContent([comment, reply]);
      }
    }
    setSavedEditContent([false, false]);
  }

  const addReply = (comment, content) => {
    setPause(false);
    let id = commentData.indexOf(comment);
    console.log(id);
    props.addReply(comment, content, id);
    setSavedReplyContent([false, false]);
  }

  const deleteContent = (comment, isComment, reply) => {
    props.saveState(comment, isComment, reply);
    setTimeout(
      props.showModal(true), 5000);
  }

  const replaceNewlineWithBr = (str) => {
    return str.split("\n").flatMap((line, index) => [
      line,
      index !== str.length - 1 && <br key={index}/>,
    ]);
  }

  const updateTimeStamp = (createDate) => {
    let currentDate = new Date();
    let timeDiff = Math.round((currentDate.getTime()) - createDate);
    
    if (timeDiff < 60000) {
      return 'just now';
    } else if (timeDiff >= 60000 && timeDiff < 3600000) {
      let minuteRange = Math.round(timeDiff / 60000);
      if (minuteRange == 1) {
        return 'a minute ago';
      } else {
        return `${minuteRange} mins ago`;
      }
    } else if (timeDiff >= 3600000 && timeDiff < 86400000) {
      let hourRange = Math.round(timeDiff / 3600000);
      if (hourRange == 1) {
        return 'an hour ago';
      } else {
        return `${hourRange} hrs ago`;
      }
    } else if (timeDiff >= 86400000 && timeDiff < 604800000) {
      let weekRange = Math.round(timeDiff / 86400000);
      if (weekRange == 1) {
        return 'a week ago';
      } else {
        return `${weekRange} wks ago`;
      }
    } else if (timeDiff >= 604800000 && timeDiff < 2592000000) {
      let monthRange = Math.round(timeDiff / 604800000);
      if (monthRange == 1) {
        return 'a month ago';
      } else {
        return `${monthRange} month ago`;
      }
    } else {
      return `some years ago`;
    }
  };

  return (
    
    <ul 
      className="comments-container"
      variants={props.variants}
      initial="hide"
      animate="reveal"
      exit="hide"
      transition={{ type: "spring", duration: 3 }}>
      <AnimatePresence initial={true} mode='popLayout'>
      {
        commentData.map((comment, commentId) => (
          <motion.div
            variants={props.variants}
            initial="hide"
            animate="reveal"
            exit="hide"
            transition={{ type: "spring", duration: 3 }}
            key={commentId}>
            <li className={`comment-box comment-item${commentData[commentData.indexOf(comment)]}}`}>
              <div className="user-details box">
                <picture>
                  <source srcSet={comment.user.image.webp} media="(min-width: 969px)"/>
                  <source srcSet={comment.user.image.png} media="(min-width: 375px)"/>
                  <img src={comment.user.image.png} alt="user_name"/>
                </picture>
                <p className="name">{comment.user.username}</p>
                <p className='user-badge' style= {{display: comment.user.username === props.currentUser.username ? 'block' : 'none'}}>{comment.user.username === props.currentUser.username ? <span>You</span> : ''}</p>
                <p className="timestamp">{isNaN(comment.createdAt) === false ? updateTimeStamp(comment.createdAt) : (comment.createdAt) }</p>
              </div>
              
              <div className="comment box">
                {
                (comment.user.username === props.currentUser.username) && (comment === savedEditContent[0] && savedEditContent[1] === false && props.isEditing) ? <EditBox key={commentId} comment={comment} isComment={true} reply={null}/> : <p>{replaceNewlineWithBr(comment.content)}</p>
              }
              </div>
              
              <div className="actions box">
                {checkForActions(comment, true, false, commentId, null)}
              </div>
                                  
              <div className="votes box">
                <motion.img
                  whileTap={{scale: 1.3}}
                  onClick={() => handleVote(true, true, comment, null)} 
                  className="plus" src={plusIcon} 
                  style={{filter: comment.score.voteCheck === 1 ? `saturate(100)` : `none`}}/>
                <p>{comment.score.count}</p>
                <motion.img
                  whileTap={{scale: 1.3}}
                  onClick={() => handleVote(true, false, comment, null)} 
                  className="minus" src={minusIcon} 
                  style={{filter: comment.score.voteCheck === -1 ? `saturate(100)` : `none`}}/>
              </div>
            </li>
            {
              (comment.user.username != props.currentUser.username) && (comment === savedReplyContent[0] && savedReplyContent[1] === false && props.isReplying) ? <ReplyBox key={commentId} comment={comment}/> : ''
            }
            <ul className='reply-container'>{checkReply(comment, commentId)}</ul>
          </motion.div>
        ))}
        </AnimatePresence>
    </ul>
  );
}

export default MainSection;