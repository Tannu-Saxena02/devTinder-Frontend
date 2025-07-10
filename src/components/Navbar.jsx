import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import applogo from "../assets/chatdev.png"; // Assuming you have a logo image
import { addTheme } from "../utils/themeSlice";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { TbUsersPlus } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";
import { IoHome } from "react-icons/io5";
import { MdLockReset } from "react-icons/md";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/logout",
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    dispatch(addTheme(newTheme));
    console.log(newTheme);
  };
  return (
    <div>
      <div
        className="navbar bg-base-300 shadow-sm"
        style={{ backgroundColor: theme === "dark" ? "black" : "#ffffff" }}
      >
        <div className="flex-1">
          <Link className="btn btn-ghost text-xl" to="/">
            <img
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
              src={applogo}
            />
            <div className="mx-2" style={{ color: "#feba00" }}>
              DevConnect
            </div>
          </Link>
        </div>
        {!user && (
          <div className="flex gap-2 mx-5 justify-center">
            <Link className="justify-between" to="/login">
              <div
                className="mx-5 text-[14px] sm:text-[13px] md:text-[15px] lg:text-[17px]"
                style={{
                  fontWeight: "500",
                  color: "#ffffff",
                }}
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </div>
            </Link>
            <Link className="justify-between" to="/signup">
              <div
                className="text-[14px] sm:text-[13px] md:text-[15px] lg:text-[17px]"
                style={{ fontWeight: "400", color: "#ffffff" }}
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign Up
              </div>
            </Link>
          </div>
        )}

        {user && (
          <div className="flex gap-2 mx-5 justify-center">
            <div
              className="form-control justify-center mx-3 my-2 text-[10px] sm:text-[10px] md:text-[13px] lg:text-[17px]"
              style={{
                color: theme === "dark" ? "#ffffff" : "black",
                fontWeight: "500",
              }}
            >
              Welcome, {user.firstName}
            </div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={user.photoUrl}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow"
                style={{
                  backgroundColor: theme === "dark" ? "black" : "#ffffff",
                }}
              >
                <li>
                  <Link to="/">
                    <IoHome
                      size={20}
                      color={theme === "dark" ? "#ffffff" : "black"}
                    />
                    <div
                      style={{
                        fontSize: 14,
                        color:theme === "dark" ? "#ffffff" : "black"
                      }}
                    >
                      Home
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/feed">
                    <VscFeedback
                      size={20}
                      color={theme === "dark" ? "#ffffff" : "black"}
                    />
                    <div
                      style={{
                        fontSize: 14,
                        color: theme === "dark" ? "#ffffff" : "black",
                      }}
                    >
                      User feed
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/profile">
                    <FaUserEdit
                      size={20}
                      color={theme === "dark" ? "#ffffff" : "black"}
                    />
                    <div
                      style={{
                        fontSize: 14,
                        color: theme === "dark" ? "#ffffff" : "black",
                      }}
                    >
                      Profile
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/connections">
                    <FaUsers
                      size={20}
                      color={theme === "dark" ? "#ffffff" : "black"}
                    />
                    <div
                      style={{
                        fontSize: 14,
                        color: theme === "dark" ? "#ffffff" : "black",
                      }}
                    >
                      Connections
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/requests">
                    <TbUsersPlus
                      size={20}
                      color={theme === "dark" ? "#ffffff" : "black"}
                    />
                    <div
                      style={{
                        fontSize: 14,
                        color: theme === "dark" ? "#ffffff" : "black",
                      }}
                    >
                      Requests
                    </div>
                  </Link>
                </li>
                 <li>
                  <Link to="/resetpassword"
                  onClick={()=>{
                      dispatch(addForgot(false));
                  }}>
                    <MdLockReset
                      size={20}
                      color={theme === "dark" ? "#ffffff" : "black"}
                    />
                    <div
                      style={{
                        fontSize: 14,
                        color: theme === "dark" ? "#ffffff" : "black",
                      }}
                    >
                      Reset Password
                    </div>
                  </Link>
                </li>
                <li>
                  <div onClick={toggleTheme}>
                    {theme === "dark" ?
                    (
                      <MdLightMode
                        size={20}
                        color={theme === "dark" ? "#ffffff" : "black"}
                      />
                    ): (
                      <MdDarkMode
                        size={20}
                        color={theme === "dark" ? "#ffffff" : "black"}
                      />
                    ) 
                    }
                    <div
                      style={{
                        fontSize: 14,
                        color: theme === "dark" ? "#ffffff" : "black",
                      }}
                    >
                      {theme === "dark" ? "Light Mode":"Dark Mode" }
                    </div>
                  </div>
                </li>
                <li>
                  <Link onClick={handleLogout}>
                    <IoLogOutOutline
                      size={20}
                      color={theme === "dark" ? "#ffffff" : "black"}
                    />
                    <div
                      style={{
                        fontSize: 14,
                        color: theme === "dark" ? "#ffffff" : "black",
                      }}
                    >
                      Logout
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* <Button title="Toggle Theme" onPress={toggleTheme} /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
