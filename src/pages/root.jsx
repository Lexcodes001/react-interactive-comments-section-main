import React, { useState, useEffect, createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import ARPng from "../assets/images/avatars/image-amyrobson.png";
import ARWebp from "../assets/images/avatars/image-amyrobson.webp";
import JOPng from "../assets/images/avatars/image-juliusomo.png";
import JOWebp from "../assets/images/avatars/image-juliusomo.webp";
import MBPng from "../assets/images/avatars/image-maxblagun.png";
import MBWebp from "../assets/images/avatars/image-maxblagun.webp";
import RMPng from "../assets/images/avatars/image-ramsesmiron.png";
import RMWebp from "../assets/images/avatars/image-ramsesmiron.webp";

export const CurrentUserContext = createContext();
export const ChangeUserContext = createContext();

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

const RootLayout = () => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || users[0]
  );

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  const changeUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <>
      <ChangeUserContext.Provider
        value={(arg) => {
          changeUser(arg);
        }}
      >
        <CurrentUserContext.Provider value={currentUser}>
          <main>
            <Outlet />
          </main>
        </CurrentUserContext.Provider>
      </ChangeUserContext.Provider>
    </>
  );
};

export default RootLayout;
