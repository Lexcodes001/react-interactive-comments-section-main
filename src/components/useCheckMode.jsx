import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function useCheckMode(variants, filterContent, replyingTo, isEditing, isReplying, hasCommented, hasEdited, hasReplied, hasDeleted, isComment, commentId, replyId, msg){
  const [infoObj, setInfoObj] = useState(null);
  useEffect(()=>{
    
    alert('has-commented!');
    let info;
    if (isEditing) {
      info = {
        mode: '',
        infoTag : <motion.p
        key={0}
        variants={variants}
        initial={{opacity: 0.5}}
        animate={{opacity: 1}}
        exit={{opacity: 0.5}}>
        You are currently editing this {isReplying === true ? 'reply' : 'comment'}: <br /> "<span className='bold'>{filterContent.slice(0,30).trim()}</span>..."</motion.p>
      };
      setInfoObj(info);
    } else if (isReplying) {
      info = {
        mode: '',
        infoTag : <motion.p
        key={1}
        variants={variants}
        initial={{opacity: 0.5}}
        animate={{opacity: 1}}
        exit={{opacity: 0.5}}>
        You are currently replying to <span className="bold">@{replyingTo}</span></motion.p>
        };
      setInfoObj(info);
    } else if (hasEdited) {
      info = {
        mode: '',
        infoTag : <motion.p
        key={3}
        variants={variants}
        initial={{opacity: 0.5}}
        animate={{opacity: 1}}
        exit={{opacity: 0.5}}>
        You just edited this {isComment ? 'comment' : 'reply'}: <br /> "<span className="bold">{filterContent.slice(0,30).trim()}</span>..."</motion.p>
      };
      setInfoObj(info);
      setTimeout(function() {
        setHasEdited(false);
        setMsg([]);
      }, 5000);
    } else if (hasReplied) {
      info = {
        mode: '',
        infoTag : <motion.p
        key={4}
        variants={variants}
        initial={{opacity: 0.5}}
        animate={{opacity: 1}}
        exit={{opacity: 0.5}}>
        You just replied to <span className="bold">@{replyingTo}</span></motion.p>
      };
      setInfoObj(info);
      setTimeout(function() {
        setHasReplied(false);
        setMsg([]);
      }, 5000);
    } else if (hasCommented) {
      info = {
        mode: '',
        infoTag : <motion.p
        key={2}
        variants={variants}
        initial={{opacity: 0.5}}
        animate={{opacity: 1}}
        exit={{opacity: 0.5}}>
        You just added a new comment: <br /> "<span className="bold">{filterContent.slice(0,30).trim()}</span>..."</motion.p>
      };
      setInfoObj(info);
      setTimeout(function() {
        setHasCommented(false);
        setMsg([]);
      }, 5000);
    } else if (hasDeleted) {
      info = {
        mode: '',
        infoTag : <motion.p
        key={5}
        variants={variants}
        initial={{opacity: 0.5}}
        animate={{opacity: 1}}
        exit={{opacity: 0.5}}>
          {isComment ? <>The comment</> : <>Your reply to <span className="bold">@{replyingTo}</span></> } has been removed successfully!</motion.p>
        };
        setInfoObj(info);
        setTimeout(function() {
          setHasDeleted(false);
          setMsg([]);
        }, 5000);
    } else {
      console.log('naught!');
    }
    console.log(msg);
    infoObj !== null && infoObj;
  }, [variants, filterContent, replyingTo, isEditing, isReplying, hasCommented, hasEdited, hasReplied, hasDeleted, isComment, commentId, replyId, msg]);
}

export default useCheckMode;