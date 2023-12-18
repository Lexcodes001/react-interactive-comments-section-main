import { useState, useEffect } from "react";

const useScrollMovement = (
  goingDown) => {
    let scrollBool;
  useEffect(() => {
    scrollBool = goingDown !== null ? goingDown : false;
  }, [goingDown]);
  
  return goingDown;
};

export default useScrollMovement;