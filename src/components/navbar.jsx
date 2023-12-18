import { useState, useEffect, useContext } from "react";
import UserToggle from "../components/user-toggle";
import useFetchData from "../hooks/useFetchData";
import useScrollMovement from "../hooks/useScroll";
import { ChangeUserContext } from "../pages/root";
import { CurrentUserContext } from "../pages/root";

const Navbar = (props) => {
  const [goingDown, setGoingDown] = useState(false);
  const changeUser = useContext(ChangeUserContext);
  const currentUser = useContext(CurrentUserContext);

  const data = useFetchData();
  
    useEffect(() => {
      let lastScrollPosition = window.pageYOffset;

      const handleScroll = () => {
        if (data.length !== 0) {
          const currentScrollPosition = window.pageYOffset;

          if (currentScrollPosition > lastScrollPosition) {
            setGoingDown(true);
          } else {
            setGoingDown(false);
          }

          if (
            window.innerHeight + window.pageYOffset >=
              document.body.offsetHeight - 100 ||
            window.pageYOffset === 0
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
    }, []);

  return (
    <>
      <nav
        className={`${goingDown ? "fade-in-bottom-one" : "fade-in-top-one"}`}
      >
        <h1 className="">Comment Section</h1>
        <UserToggle
          data={data}
          users={props.users}
          currentUser={currentUser}
          variants={props.variants}
          changeUser={(user) => changeUser(user)}
        />
      </nav>
    </>
  );
};

export default Navbar;
