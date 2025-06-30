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
      <div className="navbar bg-base-300 shadow-sm">
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
                className="mx-5"
                style={{
                  fontSize: 17,
                  fontWeight: "500",
                  color: "#ffffff",
                }}
                onnclick={() => {
                  navigate("/login");
                }}
              >
                Login
              </div>
            </Link>
            <Link className="justify-between" to="/signup">
              <div
                className="mx-5"
                style={{ fontSize: 17, fontWeight: "400", color: "#ffffff" }}
                onnclick={() => {
                  navigate("/login");
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
              className="form-control justify-center mx-3 my-2"
              style={{ color: theme === "dark" ? "#ffffff" : "black" }}
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
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link className="justify-between" to="/profile">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connections">Connections</Link>
                </li>
                <li>
                  <Link to="/requests">Requests</Link>
                </li>
                <li>
                  <div onClick={toggleTheme}>
                    {theme === "dark" ? <MdDarkMode /> : <MdLightMode />}
                    {theme === "dark" ? "Dark Mode" : "Light Mode"}
                  </div>
                </li>
                <li>
                  <Link onClick={handleLogout}>Logout</Link>
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
