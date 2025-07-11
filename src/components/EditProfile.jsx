import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useSelector } from "react-redux";
import Dialog from "../utils/Dialog";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [aboutError, setAboutError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [genderError, setGenderError] = useState("");
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const [dialog, setDialog] = useState({
    status: false,
    isOpen: false,
    title: "",
    message: "",
    onClose: null,
  });

  const saveProfile = async () => {
    try {
      if (validationFields()) {
        const res = await axios.patch(
          BASE_URL + "/profile/edit",
          {
            firstName,
            lastName,
            photoUrl,
            age,
            gender,
            about,
          },
          { withCredentials: true }
        );
        if (res.data.success) {
          if (res.data?.message.length >= 0) {
            dispatch(addUser(res?.data?.data));
            setDialog({
              status: true,
              isOpen: true,
              title: "Success",
              message: res?.data?.message,
              onClose: () => {
                navigate("/feed");
              },
            });
          }
        } else {
          setDialog({
            status: false,
            isOpen: true,
            title: "Error",
            message: res?.data,
            onClose: closeDialog,
          });
        }
      }
    } catch (err) {
      console.log("ERROR" + err);
      if (err.response) {
        if (err.response.status === 401) {
          setDialog({
            status: false,
            isOpen: true,
            title: "Unauthorized",
            message:
              "Session expired or unauthorized access. Please login again.",
            onClose: () => {
              closeDialog();
              navigate("/login");
            },
          });
        } else {
          setDialog({
            status: false,
            isOpen: true,
            title: "Error",
            message: err?.response?.data?.error || "Something went wrong!",
            onClose: closeDialog,
          });
        }
      } else {
        setDialog({
          status: false,
          isOpen: true,
          title: "Error",
          message: err?.message || "Unexpected error",
          onClose: closeDialog,
        });
      }
    }
  };
  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };
  function validateInput(value) {
    // Validation
    const words = value.trim().split(/\s+/);
    const charCount = value.length;

    if (charCount > 250) {
      setAboutError("Only 250 characters allowed.");
      return;
    }

    if (words.length > 40) {
      setAboutError("Only 40 words allowed.");
      return;
    }

    const longWord = words.find((word) => word.length > 20);
    if (longWord) {
      setAboutError("Each word must be 20 characters or less.");
      return;
    }
    setAboutError("");
  }
  function validationFields() {
    let isValid = true;

    if (!firstName) {
      setFirstNameError("First Name is required");
      isValid = false;
    } else {
      setFirstNameError("");
    }
    if (!lastName) {
      setLastNameError("Last Name is required");
      isValid = false;
    } else {
      setLastNameError("");
    }
    if (!age) {
      setAgeError("Age is required");
      isValid = false;
    } else {
      setAgeError("");
    }
    if (!photoUrl) {
      setPhotoError("Photo Url is required");
      isValid = false;
    } else {
      setPhotoError("");
    }
    if (!about) {
      setAboutError("about is required");
      isValid = false;
    } else {
      setAboutError("");
    }
    if (!gender) {
      setGenderError("Gender is required");
      isValid = false;
    } else {
      setGenderError("");
    }
    return isValid;
  }
  const handleChange = (e) => {
    const value = e.target.value;
    setAbout(value);
    validateInput(value);
    if (e.trim() !== "") {
      setAboutError("");
    }
  };

  return (
    //  w-[96%] sm:w-[90%] md:w-[90%] lg:w-[80%]
    <div className="flex justify-center my-10">
      <div className="flex justify-center flex-col sm:flex-col md:flex-col lg:flex-row">
        <div
          className="h-130 sm:h-[60] md:h-[60] lg:h-[150] card bg-base-300 w-96 shadow-xl mx-10"
          style={{ backgroundColor: theme === "dark" ? "black" : "#DBDBDB" }}
        >
          <div className="card-body">
            <h2
              className="card-title justify-center"
              style={{
                color: theme === "dark" ? "#ffffff" : "black",
                fontWeight: "bold",
              }}
            >
              Edit Profile
            </h2>
            <div>
              <div
                className="label-text"
                style={{ color: theme === "dark" ? "#ffffff" : "black" }}
              >
                First Name:
              </div>
              <div>
                <input
                  type="text"
                  value={firstName}
                  className="input input-bordered w-full max-w-xs"
                  style={{
                    backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",
                    color: theme === "dark" ? "#ffffff" : "black",
                  }}
                  onChange={(e) => {
                    let val = e.target.value;
                    setFirstName(val);
                    if (val.trim() !== "") {
                      setFirstNameError("");
                    }
                  }}
                />
                {firstNameError && (
                  <p style={{ color: "red", fontSize: 13, marginTop: "1%" }}>
                    {firstNameError}
                  </p>
                )}
              </div>
              <div
                className="label-text"
                style={{ color: theme === "dark" ? "#ffffff" : "black" }}
              >
                Last Name:
              </div>
              <div>
                <input
                  type="text"
                  value={lastName}
                  style={{
                    backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",
                    color: theme === "dark" ? "#ffffff" : "black",
                  }}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => {
                    setLastName(e.target.value);
                    let val = e.target.value;
                    if (val.trim() !== "") {
                      setLastNameError("");
                    }
                  }}
                />
                {lastNameError && (
                  <p style={{ color: "red", fontSize: 13, marginTop: "1%" }}>
                    {lastNameError}
                  </p>
                )}
              </div>
              <div
                className="label-text"
                style={{ color: theme === "dark" ? "#ffffff" : "black" }}
              >
                Photo URL :
              </div>
              <div>
                <input
                  type="text"
                  value={photoUrl}
                  style={{
                    backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",
                    color: theme === "dark" ? "#ffffff" : "black",
                  }}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => {
                    setPhotoUrl(e.target.value);
                    let val = e.target.value;
                    if (val.trim() !== "") {
                      setPhotoError("");
                    }
                  }}
                />
                {photoError && (
                  <p style={{ color: "red", fontSize: 13, marginTop: "1%" }}>
                    {photoError}
                  </p>
                )}
              </div>
              <div
                className="label-text"
                style={{ color: theme === "dark" ? "#ffffff" : "black" }}
              >
                Age:
              </div>
              <div>
                <input
                  type="text"
                  value={age}
                  style={{
                    backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",
                    color: theme === "dark" ? "#ffffff" : "black",
                  }}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => {
                    setAge(e.target.value);
                    let val = e.target.value;
                    if (val.trim() !== "") {
                      setAgeError("");
                    }
                  }}
                />
                {ageError && (
                  <p style={{ color: "red", fontSize: 13, marginTop: "1%" }}>
                    {ageError}
                  </p>
                )}
              </div>
              <div
                className="label-text"
                style={{ color: theme === "dark" ? "#ffffff" : "black" }}
              >
                Gender:
              </div>

              <select
                className="select select-bordered w-full max-w-xs"
                value={gender}
                style={{
                  backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",
                  color: theme === "dark" ? "#ffffff" : "black",
                }}
                onChange={(e) => {
                  setGender(e.target.value);
                  let val = e.target.value;
                  if (val.trim() !== "") {
                    setGenderError("");
                  }
                }}
              >
                <option disabled value="">
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <span
                className="label-text"
                style={{ color: theme === "dark" ? "#ffffff" : "black" }}
              >
                About:
              </span>
              <div>
                <input
                  type="text"
                  value={about}
                  className="input input-bordered w-full max-w-xs"
                  style={{
                    backgroundColor: theme === "dark" ? "#1D232A" : "#FFFFFF",
                    color: theme === "dark" ? "#ffffff" : "black",
                  }}
                  onChange={handleChange}
                />
                {aboutError && (
                  <p style={{ color: "red", fontSize: 13, marginTop: "1%" }}>
                    {aboutError}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="card-actions justify-center m-2">
            <button className="btn btn-primary" onClick={saveProfile}>
              Save Profile
            </button>
          </div>
        </div>
        <UserCard
          user={{ firstName, lastName, photoUrl, age, gender, about }}
        />
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
      {dialog.isOpen && (
        <Dialog
          status={dialog.status}
          isOpen={dialog.isOpen}
          title={dialog.title}
          message={dialog.message}
          onClose={dialog.onClose}
        />
      )}
    </div>
  );
};
export default EditProfile;
