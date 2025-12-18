import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/Provider";
import logo from "../assets/Logo.png";
import { NavLink } from "react-router";
import { signOut } from "firebase/auth";
import auth from "../Firebase/firebase.config";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  const [ischecked, setIsChecked] = useState(false)

   const handel = () =>{
    setIsChecked(!ischecked);
   }

   useEffect ( ()=>{
    const theme = ischecked? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
   },[ischecked])

  const handelSignOut = () => {
    signOut(auth);
  };
  const Links = (
    <>
      <li>
        <NavLink to="/" className="text-base-content font-bold text-l">
          Home
        </NavLink>
      </li>
      { user && (
        <li>
          <NavLink to="/dashboard" className="text-base-content font-bold text-l">
            Dashboard
          </NavLink>
        </li>
      )}
      <li>
        <NavLink to="/search" className="text-base-content font-bold text-l">
          Search Donor
        </NavLink>
      </li>
      <li>
        <NavLink to="/fund" className="text-base-content font-bold text-l">
          Funding
        </NavLink>
      </li>

    </>
  );
  return (
    <div>
      <div className="navbar ">
        <div className="navbar-start">
          <div className="dropdown  relative z-[9999]">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {Links}
            </ul>
          </div>
          <img className=" w-[170px]" src={logo} alt="Logo"></img>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{Links}</ul>
        </div>
        <div className="navbar-end gap-2">

          {!user && (
            <NavLink to="/registration" className="btn bg-[#EE2B34] text-white">
              Join as a donor
            </NavLink>
          )}

          {!user && (
            <NavLink to="/login" className="btn bg-[#EE2B34] text-white">
              Log In
            </NavLink>
          )}

          {user && (
            <NavLink onClick={handelSignOut} className="btn bg-[#EE2B34] text-white">
              Log out
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;