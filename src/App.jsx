import React, { useState, useEffect, useRef } from "react";
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import RootLayout from "./pages/root";
import MainSection from "./pages/main-section";
import "./App.css";
import UserProfile from "./pages/user-profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <MainSection />,
      },
      {
        path: ":name/profile",
        element: <UserProfile />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;