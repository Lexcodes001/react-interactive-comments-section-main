import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserToggle from "./components/user-toggle";
import MainSection from './components/main-section';
import './App.css';

const App = () => {
  const users = [
    {
      image: { 
        png: "./src/assets/images/avatars/image-juliusomo.png",
        webp: "./src/assets/images/avatars/image-juliusomo.webp"
      },
      username: "juliusomo"
    },
    {
      image: { 
          png: "./src/assets/images/avatars/image-amyrobson.png",
          webp: "./src/assets/images/avatars/image-amyrobson.webp"
        },
        username: "amyrobson"
    },
    {
      image: { 
          png: "./src/assets/images/avatars/image-maxblagun.png",
          webp: "./src/assets/images/avatars/image-maxblagun.webp"
        },
        username: "maxblagun"
    },
    {
      image: { 
        png: "./src/assets/images/avatars/image-ramsesmiron.png",
        webp: "./src/assets/images/avatars/image-ramsesmiron.webp"
      },
      username: "ramsesmiron"
    }
  ];

  const variants = {
    leftOpened: {
      opacity: 1, x: 0,
      transition: { type: "tween", staggerChildren: 0.07, delayChildren: 0.2 }
    },
    leftClosed: {
      opacity: 0, x: "100%",
      transition: { type: "tween", staggerChildren: 0.05, staggerDirection: -1 }
    },
    topOpened: {
      opacity: 1, x: 0, y: 0, zIndex: 0, scale: 1,
      transition: { type: "spring", bounce: 0.5, staggerChildren: 0.07, delayChildren: 0.2 }
    },
    topClosed: {
      opacity: 0, x: 0, y: "-200%", zIndex: -5, scale: 0,
      transition: { type: "spring", bounce: 0.5, staggerChildren: 0.05, staggerDirection: -1 }
    },
    topReveal: {
      opacity: 1, x: 0, y: 0, zIndex: 0, scaleY: 1,
      transition: { type: "spring", bounce: 0.5, staggerChildren: 0.07, delayChildren: 0.2 }
    },
    topHide: {
      opacity: 0,  x: 0, y: 0, zIndex: 0, scaleY: 0,
      transition: { type: "spring", bounce: 0.5, staggerChildren: 0.05, staggerDirection: -1 }
    },
    desktopUsersOpened: {
      opacity: 1, x: -257, y: 48, zIndex: 0, scale: 1,
      transition: { type: "spring", bounce: 0.5, staggerChildren: 0.07, delayChildren: 0.2 }
    },
    desktopUsersClosed: {
      opacity: 0, x: -50, y: "-200%", zIndex: 0, scale: 0.5,
      transition: { type: "spring", bounce: 0.5, staggerChildren: 0.05, staggerDirection: -1 }
    },
    reveal: {
      scale: 1, opacity: 1, x: 0,
      transition: {
        type: "spring", duration: 2
      }
    },
    hide: {
      scale: 0.8, opacity: 0, x: -10,
      transition: {
        type: "spring", duration: 2
      }
    }
  };

  const stickyElementRef = useRef(null);
  const [data, setData] = useState(JSON.parse(localStorage.getItem("comments")) || []);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("currentUser")) || users[0]);
  const [modalState, setModalState] = useState(false);
  const [error, setError] = useState(null);
  const [isComment, setIsComment] = useState(null);
  const [commentId, setCommentId] = useState(null);
  const [replyId, setReplyId] = useState(null);
  const [hasCommented, setHasCommented] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [hasReplied, setHasReplied] = useState(false);
  const [replyingTo, setReplyingTo] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [hasDeleted, setHasDeleted] = useState(false);
  const [filterContent, setFilterContent] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputScrollHeight, setInputScrollHeight] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const scrollListenerRef = useRef(null);
  const [goingDown, setGoingDown] = useState(false);
  const [btnText, setBtnText] = useState("Send");
  const [sMsg, setSMsg] = useState([]);
  const [dMsg, setDMsg] = useState(null);
  const [checkReplyInfo, setCheckReplyInfo] = useState(false);
  const [checkEditInfo, setCheckEditInfo] = useState(false);
  const inputBoxRef = useRef(null);
  
  useEffect(() => {
    fetch('./src/assets/data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
        return response.json();
      })
      .then(jsonData => {
        if (data.length === 0) {
          localStorage.setItem("currentUser", JSON.stringify(jsonData.users[0]));
          localStorage.setItem("comments", JSON.stringify(jsonData.comments));
          window.location.reload(false);
        }
      })
      .catch(error => setError(error));
  }, []);

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
  
      window.addEventListener('scroll', handleScrollEvent);
  
      return () => {
        window.removeEventListener('scroll', handleScrollEvent);
      };
    }
  }, [window.pageYOffset]);

  useEffect(() => {
    let lastScrollPosition = window.pageYOffset;
		const inputRef = inputBoxRef.current;
		
    const handleScroll = () => {
      if (data.length !== 0) {
        const currentScrollPosition = window.pageYOffset;
        const inputRef = inputBoxRef.current;
        
        if ((currentScrollPosition > lastScrollPosition)) {
          setGoingDown(true);
        } else {
          setGoingDown(false);
        }

        if (((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 100)) || (window.pageYOffset === 0) || (inputRef == document.activeElement)) {
          setGoingDown(false);
        }

        lastScrollPosition = currentScrollPosition;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  
  useEffect(()=>{
    let info;
    if (isEditing && checkEditInfo) {
      info = {
        mode: 'dynamic',
        infoTag : <motion.p
        key={0}
        variants={variants}
        initial={{opacity: 0.5}}
        animate={{opacity: 1}}
        exit={{opacity: 0.5}}>
        You are currently editing this {!isComment ? 'reply' : 'comment'}: <br /> "<span className='bold'>{filterContent.slice(0,30).trim()}</span>..."</motion.p>
      };
      setDMsg(info);
      setCheckEditInfo(null);
    }
    
    if (isReplying && checkReplyInfo) {
      info = {
        mode: 'dynamic',
        infoTag : <motion.p
        key={1}
        variants={variants}
        initial={{opacity: 0.5}}
        animate={{opacity: 1}}
        exit={{opacity: 0.5}}>
        You are currently replying to <span className="bold">@{replyingTo}</span></motion.p>
        };
      setDMsg(info);
      setCheckReplyInfo(null);
    }
    
    if (hasEdited) {
      info = {
        mode: 'static',
        infoTag : <motion.p
        key={3}
        variants={variants}
        initial={{opacity: 0.5}}
        animate={{opacity: 1}}
        exit={{opacity: 0.5}}>
        You just edited this {isComment ? 'comment' : 'reply'}: <br /> "<span className="bold">{filterContent.slice(0,30).trim()}</span>..."</motion.p>
      };
      setSMsg([...sMsg, info]);
      setHasEdited(false);
      setTimeout(function() {
        setSMsg([]);
      }, 5000);
    }
    
    if (hasReplied) {
      info = {
        mode: 'static',
        infoTag : <motion.p
        key={4}
        variants={variants}
        initial={{opacity: 0.5}}
        animate={{opacity: 1}}
        exit={{opacity: 0.5}}>
        You just replied to <span className="bold">@{replyingTo}</span></motion.p>
      };
      setSMsg([...sMsg, info]);
      setHasReplied(false);
      setTimeout(function() {
        setSMsg([]);
      }, 5000);
    }
    
    if (hasCommented) {
      info = {
        mode: 'static',
        infoTag : <motion.p
        key={2}
        variants={variants}
        initial={{opacity: 0.5}}
        animate={{opacity: 1}}
        exit={{opacity: 0.5}}>
        You just added a new comment: <br /> "<span className="bold">{filterContent.slice(0,30).trim()}</span>..."</motion.p>
      };
      setSMsg([...sMsg, info]);
      setHasCommented(false);
      setTimeout(function() {
        setSMsg([]);
      }, 5000);
    }
    
    if (hasDeleted) {
      info = {
        mode: 'static',
        infoTag : <motion.p
        key={5}
        variants={variants}
        initial={{opacity: 0.5}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}>
          {isComment ? <>The comment</> : <>Your reply to <span className="bold">@{replyingTo}</span></> } has been removed successfully!</motion.p>
        };
        setSMsg([...sMsg, info]);
        setHasDeleted(false);
        setTimeout(function() {
          setSMsg([]);
        }, 5000);
    }
  }, [variants, filterContent, replyingTo, isEditing, isReplying, hasCommented, hasEdited, hasReplied, hasDeleted, isComment, commentId, replyId]);

  const changeUser = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
  }

  const addBtn = () => {
    const createDate = new Date().getTime();
    
    if (inputValue) {
      const commentInfo = {
        id: Number(`${(data.length) + 1}`),
        content: `${inputValue}`,
        createdAt: `${createDate}`,
        score: {count: 0, voteCheck: false},
        user: {
          image: {
            png: currentUser.image.png,
            webp: currentUser.image.webp
          },
          username: currentUser.username
        },
        replies: []
      }
      //data = data.filter(item => item != null);
      const newData = [...data];
      newData.push(commentInfo);
      setData(newData);
      localStorage.setItem("comments", JSON.stringify(newData));
      setData(JSON.parse(localStorage.getItem("comments")));
      setHasCommented(true);
      setFilterContent(inputValue);
      setInputValue("");
    }
  }

  const addReply = (comment, content, id) => {
    const createDate = new Date().getTime();
    
    const replyInfo = {
      id: Number(`${(data[id].replies.length) + 1}`),
      content: `${content}`,
      createdAt: `${createDate}`,
      score: {count: 0, voteCheck: false},
      replyingTo: `${replyingTo}`,
      user: {
        image: {
          png: currentUser.image.png,
          webp: currentUser.image.webp
        },
        username: currentUser.username
      }
    }
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
  }

  const deleteBtn = (commentId, isComment, replyId) => {
    if (isComment) {
      data.splice(commentId, 1);
    } else {
      data[commentId].replies.splice(replyId, 1);
    }
    localStorage.setItem("comments", JSON.stringify(data));
    showModal(false);
    setHasDeleted(true);
  }

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
      } else{
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
  }

  const showModal = (bool) => {
    if (bool) {
      setModalState(bool);
    } else {
      setModalState(bool);
    }
    
  }

  const saveState = (comment, isComment, reply) => {
    let cmtIndex = data.indexOf(comment);
    if (reply !== null) {
      let rplyIndex = data[cmtIndex].replies.indexOf(reply);
      setReplyId(rplyIndex);
      setReplyingTo(reply.replyingTo);
    }
    setCommentId(cmtIndex);
    setIsComment(isComment);
  }

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
    setCheckEditInfo(checkEditInfo => {
      if(checkEditInfo === null) {
        return false;
      } else {
        return !checkEditInfo;
      }
    });
    localStorage.setItem("comments", JSON.stringify(data));
    setData(JSON.parse(localStorage.getItem("comments")));
  }

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
  }

  const setReply = (comment, isComment, reply) => {
    if (isComment) {
      setReplyingTo(comment.user.username);
    } else {
      setReplyingTo(reply.user.username);
    }
    isReplying === true && setDMsg(null);
    setIsEditing(false);
    setIsReplying(!isReplying);
    setCheckEditInfo(false);
    setCheckReplyInfo(checkReplyInfo => {
      if(checkReplyInfo === null) {
        return false;
      } else {
        return !checkReplyInfo;
      }
    });
    console.log(checkReplyInfo);
    localStorage.setItem("comments", JSON.stringify(data));
    setData(JSON.parse(localStorage.getItem("comments")));
  }

  return (
    <div className='body'>
      <nav className={`${goingDown ? 'fade-in-bottom-one' : 'fade-in-top-one'}`}>
        <h1 className="">Comment Section</h1>
        <UserToggle 
          data={data} 
          error={error} 
          users={users}
          currentUser={currentUser}
          variants={variants}
          changeUser={(user)=>changeUser(user)}
        />
      </nav>
      <MainSection 
        data={data} 
        error={error}
        users={users}
        currentUser={currentUser} 
        showModal={(arg)=>showModal(arg)} 
        saveState={(comment, isCmnt, reply)=>saveState(comment, isCmnt, reply)} 
        handleVote={(comment, isComment, voteMode, replyId, id)=>handleVote(comment, isComment, voteMode, replyId, id)} 
        isReplying={isReplying} 
        isEditing={isEditing}
        setReply={(comment, isComment, reply)=>setReply(comment, isComment, reply)} 
        addReply={(comment, content, id)=>addReply(comment, content, id)}
        setEdit={(comment, isComment, replyId, content)=>{setEdit(comment, isComment, replyId, content)}}
        editContent={(comment, isComment, replyId, content, id)=>{editContent(comment, isComment, replyId, content, id)}}
        variants={variants}
      />
      <div className={`${isSticky ? 'input-box is-sticky' : 'input-box'} ${goingDown ? 'fade-in-top' : 'fade-in-bottom'}`} 
			  ref={stickyElementRef}>
        <div className='infoText'>
          <AnimatePresence mode='popLayout'>
            <motion.p
              variants={variants}
              initial="hide"
              animate="reveal"
              exit="hide"
              transition={{ type: "spring", duration: 0.8 }}>
              Write a comment below...
            </motion.p>
          </AnimatePresence>
        </div>
        
        <textarea 
          ref={inputBoxRef}
          id="userInput"
          name="userInput"
          value={inputValue}
          style={{height: (inputScrollHeight < 46 || inputValue === '') ? 46 : inputScrollHeight + 'px'}}
          onChange={(event)=>{
            setInputValue(event.target.value);
            setInputScrollHeight('auto');
            setInputScrollHeight(event.target.scrollHeight - 6);
          }}
        />
        
        <picture>
          <source srcSet={currentUser.image.webp} media="(min-width: 969px)"/>
          <source srcSet={currentUser.image.png} media="(min-width: 375px)"/>
          <img src={currentUser.image.png} alt="user_name"/>
        </picture>
        
        <button type="#" onClick={()=> addBtn()}>{btnText}</button>
      </div>

      {
        modalState && 
        <div className="modal-container">
          <div className="modal-box">
            <header>Delete {isComment ? 'comment' : 'reply'}</header>
            <p className="info">Are you sure you want to delete this {isComment ? 'comment' : 'reply'}?<br />This will remove the {isComment ? 'comment' : 'reply'} and can't be undone.</p>
            <div className="btns">
              <button onClick={()=>setModalState(false)}>NO, CANCEL</button>
              <button onClick={()=>{deleteBtn(commentId, isComment, replyId)}}>YES, DELETE</button>
            </div>
          </div>
        </div>
      }

      <motion.div 
          className='info-container'
          variants={variants}
              initial= {{
                scale: 0.8, opacity: 0,
                transition: {
                  type: "spring", duration: 1.5
              }}}
              animate= {{
                scale: 1, opacity: 1, left: '50%', x: '-50%',
                transition: {
                  type: "spring", duration: 0.8
                }}}
              exit= {{
                scale: 0.8, opacity: 0,
                transition: {
                  type: "spring", duration: 1.5
              }}}>
          <AnimatePresence mode='popLayout'>
            
            {
              (sMsg.length === 0) ? 
              null :
              sMsg.map((info, key) => (
                <motion.div 
                  className="alert-box" 
                  key={key}
                  variants={variants}
                  initial={{opacity: 0.5, x: 100}}
                  animate={{opacity: 1, x: 0}}
                  exit={{opacity: 0.5}}>
                  <div className="icon">
                    <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>
                  </div>
                  {info.infoTag}
                </motion.div>
            ))}

            {
              (dMsg === null) ? 
              null :
              <motion.div 
                className="alert-box"
                variants={variants}
                initial={{opacity: 0.5, x: 100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0.5}}>
                <div className="icon">
                  <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>
                </div>
                {dMsg.infoTag}
              </motion.div>
              }
            
          </AnimatePresence>
        </motion.div>

    </div>
  );
}

export default App;