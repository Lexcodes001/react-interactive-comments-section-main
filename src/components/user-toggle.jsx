import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const UserToggle = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  // useEffect(()=>{

  // }, [window.innerWidth]);

  return (
    <motion.div className="usertoggle-comp">
      <motion.button onClick={() => setIsOpen((isOpen) => !isOpen)}>
        <picture>
          <source
            srcSet={props.currentUser.image.webp}
            media="(min-width: 969px)"
          />
          <source
            srcSet={props.currentUser.image.png}
            media="(min-width: 375px)"
          />
          <img src={props.currentUser.image.png} alt="user_name" />
        </picture>
      </motion.button>

      <motion.div
        className="users"
        initial={false}
        variants={props.variants}
        animate={
          isOpen
            ? window.innerWidth >= 769
              ? "topReveal"
              : "leftOpened"
            : window.innerWidth < 769
            ? "leftClosed"
            : "topHide"
        }
      >
        {props.users.map((user, id) => (
          <picture
            key={id}
            style={{
              zIndex:
                user.username === props.currentUser.username ? 10 : 10 - id,
            }}
          >
            <source srcSet={user.image.webp} media="(min-width: 969px)" />
            <source srcSet={user.image.png} media="(min-width: 375px)" />
            <img
              onClick={() => {
                props.changeUser(user);
              }}
              className={
                user.username === props.currentUser.username
                  ? `current-user`
                  : ``
              }
              src={user.image.png}
              alt="user_name"
            />
          </picture>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default UserToggle;
