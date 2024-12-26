import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Card,
  Collapse,
} from "@material-tailwind/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addAlert } from "../features/Alert/AlertSlice";
import { removeUserLoginCredential } from "../features/userSignupSignin/userSSSlice";
import uniqid from "uniqid";
import CreateAlbum from "./CreateAlbum";

export default function NavBarComp() {
  const [openNav, setOpenNav] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6"></ul>
  );

  const SignOutHandler = () => {
    navigate("/user/login", { replace: true });
    dispatch(removeUserLoginCredential());
    dispatch(addAlert({ alertId: uniqid(), message: "Logout", color: "red" }));
  };

  return (
    <Navbar className="fixed top-5 z-10 h-max max-w-screen-2xl  rounded-none px-4 py-2 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between text-blue-gray-900">
        {/* <Typography className="mr-4 cursor-pointer py-1.5 font-medium">
          KoviasPix
        </Typography> */}
        <NavLink to="/user/auth/photos">
          <Typography variant="h4" color="blue" textGradient>
            KoviasPix
          </Typography>
        </NavLink>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">
            {" "}
            <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              <li>
                <CreateAlbum />
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-x-1">
            <Button
              color="red"
              variant="gradient"
              size="sm"
              className="hidden lg:inline-block"
              onClick={SignOutHandler}
            >
              <span>Sign Out</span>
            </Button>
          </div>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav}>
        <div className="flex py-4 flex-col items-start  gap-4">
          <CreateAlbum />
          <Button
            color="red"
            variant="gradient"
            size="sm"
            className=""
            onClick={SignOutHandler}
          >
            <span>Log Out</span>
          </Button>
        </div>
      </Collapse>
    </Navbar>
  );
}
