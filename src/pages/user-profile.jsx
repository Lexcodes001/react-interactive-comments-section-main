import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import ARPng from "../assets/images/avatars/image-amyrobson.png";
import ARWebp from "../assets/images/avatars/image-amyrobson.webp";
import JOPng from "../assets/images/avatars/image-juliusomo.png";
import JOWebp from "../assets/images/avatars/image-juliusomo.webp";
import MBPng from "../assets/images/avatars/image-maxblagun.png";
import MBWebp from "../assets/images/avatars/image-maxblagun.webp";
import RMPng from "../assets/images/avatars/image-ramsesmiron.png";
import RMWebp from "../assets/images/avatars/image-ramsesmiron.webp";

const UserProfile = () => {
  const [isError, setIsError] = useState(true);
  const [error, setError] = useState("");
  const [userIndex, setUserIndex] = useState(null);
  const users = [
    {
      image: {
        png: JOPng,
        webp: JOWebp,
      },
      username: "juliusomo",
      fullname: "Julius Omo"
    },
    {
      image: {
        png: ARPng,
        webp: ARWebp,
      },
      username: "amyrobson",
      fullname: "Amy Robson"
    },
    {
      image: {
        png: MBPng,
        webp: MBWebp,
      },
      username: "maxblagun",
      fullname: "Max Blagun"
    },
    {
      image: {
        png: RMPng,
        webp: RMWebp,
      },
      username: "ramsesmiron",
      fullname: "Ramses Miron"
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
        duration: 0.8,
      },
    },
    hide: {
      scale: 0.95,
      opacity: 0,
      x: -10,
      transition: {
        type: "spring",
        duration: 0.8,
      },
    },
  };
  const user = useParams();

  useEffect(() => {
    const findUserIndex = () => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].username === user.name) {
          return i;
        }
      }
    };

    let result = findUserIndex();

    const checkResult = (ans) => {
      if (ans === undefined) {
        setIsError(true);
        setError("user not found!");
      } else {
        setIsError(false);
        setUserIndex(ans);
      }
    };

    checkResult(result);
  }, [userIndex]);

  return (
    <>
      {isError ? (
        <motion.p>{error}</motion.p>
      ) : (
        <motion.div
          className="profile-page"
          variants={variants}
          initial="leftClosed"
          animate="leftOpened"
          exit="leftClosed"
        >
          <motion.div
            className="cover-bg"
            style={{
              backgroundImage: `url(${users[userIndex].image.webp})`,
            }}
          >
            <Link className="prev-page" to={".."}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="1 1 23 23"
                id="angle-left"
                width={10}
                height={10}
              >
                <path
                  fill="var(--light-grayish-blue)"
                  d="M11.29,12l3.54-3.54a1,1,0,0,0,0-1.41,1,1,0,0,0-1.42,0L9.17,11.29a1,1,0,0,0,0,1.42L13.41,17a1,1,0,0,0,.71.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41Z"
                ></path>
              </svg>
              <p>Back</p>
            </Link>
            <motion.picture>
              <source
                srcSet={users[userIndex].image.webp}
                media="(min-width: 969px)"
              />
              <source
                srcSet={users[userIndex].image.png}
                media="(min-width: 375px)"
              />
              <img src={users[userIndex].image.png} alt="user_name" />
            </motion.picture>
          </motion.div>
          <motion.h1>{users[userIndex].fullname}</motion.h1>
        </motion.div>
      )}
    </>
  );
};

export default UserProfile;
