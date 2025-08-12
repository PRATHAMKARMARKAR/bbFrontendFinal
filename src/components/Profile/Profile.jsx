import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState , useEffect } from "react";
import { useSelector } from "react-redux";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ProductionApi, LocalApi } from "../../../utills";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/landingpage");
    dispatch({ type: "login/login" });
  };
  const menuItems = [
    "My Profile",
    "Notifications",
    "Payment Methods",
    "Passwords",
  ];
  const [selectedItem, setSelectedItem] = useState("My Profile");
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const handleApi = async (e) => {
    console.log("your token which is stored", token);
    
    e.preventDefault();
    try {
      const response = await axios.post(
        `${ProductionApi}/user/addDetails`,
        { firstName, lastName, email, dateOfBirth, phoneNo },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Profile data saved!");
     if (response.data == 200) {
      navigate("/landingpage")
     }
      dispatch({type : "details/setName", payload: firstName});
      dispatch({type : "details/setEmail", payload: email});
      dispatch({type : "details/setPhoneNo", payload: phoneNo});
    } catch (error) {
      toast.error("Failed to save profile data!");
      console.log("Error", error);
    }
  };
  const [oldPassWord, setOldPassword] = useState("");
  const [newPassWord, setNewPassword] = useState("");
  const [confirmPassWord, setConfirmPassword] = useState("");
  const handlePasswordApi = async (e) => {
    try {
      const response = await axios.post(
        `${ProductionApi}/user/changePassword`,
        {
          currentPassword: oldPassWord,
          newPassword: newPassWord,
          confirmPassword: confirmPassWord,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
toast.success("Password changed successfully!");
      console.log("Data Added", response.data);
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to change password!");
    }
  };
  const [toggleEmail, setToggleEmail] = useState(false);
  const handleToggleEmail = () => {
    setToggleEmail(!toggleEmail);
  };
  const handleEmailToggleAPI = async () => {
    try {
      const response = await axios.post(
        `${ProductionApi}/user/toggleEmail`,
        {
          status: toggleEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Toggle Email added", response.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  const [isBankClicked, setIsBankClicked] = useState(false);
  const handleBankClick = () => {
    setIsBankClicked(!isBankClicked);
  };
  useEffect(() => {
  const handleBeforeUnload = (event) => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        navigator.sendBeacon(
          `${ProductionApi}/user/logout`,
          JSON.stringify({})
        );
        localStorage.removeItem("token");
      } catch (e) {
        console.warn("Logout beacon failed:", e);
      }
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);
useEffect(() => {
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${ProductionApi}/user/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
console.log(data);

      // Assuming response data structure looks like:
      // { firstName: "John", lastName: "Doe", email: "...", ... }
      setFirstName(data.data.firstName || "" );
      setLastName(data.data.lastName || "");
      setEmail(data.data.email|| "" );
      setDateOfBirth(data.data.dateOfBirth || "");
      setPhoneNo(data.data.phoneNo || "");
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load profile data");
    }
  };

  if (token) {
    fetchUserDetails();
  }
}, [token]);

  return (
    <>
      <div className="page-details p-2 sm:px-10">
        {/* NAVBAR */}
        <div className="navbar flex flex-col sm:flex-row items-start sm:items-center p-2 m-4 justify-between text-2xl gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className="logo-bag"></div>
            <div className="logo"></div>
          </div>
          <div className="nav-links flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div className="relative">
              <select className="appearance-none border-2 border-[#FA8128] rounded-lg p-2 pr-10 bg-white">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <img src="/Dropdown.svg" alt="" className="w-7 h-7" />
              </div>
            </div>
            <div className="burger p-2 cursor-pointer">
              <GiHamburgerMenu
                size={35}
                color="#FA8128"
                onClick={() => {
                  navigate("/useroverview");
                }}
              />
            </div>
          </div>
        </div>
        <div className="main-section flex flex-col lg:flex-row w-full mt-5 gap-4">
          {/* LEFT MENU */}
          <div className="left-section w-full lg:w-[20%] px-8 pt-3 pb-5 flex flex-col gap-10 border-t-4 border-r-0 lg:border-r-4 border-b-4 border-[#63C5DA] shadow-[4px_4px_10px_#FA8128]">
            <div className="file flex-col">
              <div className="heading-left text-[32px] md:text-[50px] text-[#63C5DA] underline font-bold">
                My Ads
              </div>
            </div>
            <div className="flex flex-col gap-10 text-[20px] md:text-[22px] text-center font-bold">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className={`left-item rounded-3xl p-2 text-[20px] md:text-[23px] cursor-pointer transition duration-200
                    ${
                      selectedItem === item
                        ? "bg-[#FA8128] text-white"
                        : "bg-white text-[#FA8128]"
                    }`}
                  onClick={() => handleItemClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="right-section w-full lg:w-[80%]">
            {selectedItem === "My Profile" && (
              <div className="profile-div flex flex-col gap-10 px-5 md:px-10 pt-10 text-[20px] md:text-[24px] h-full text-[#FA8128] font-bold">
                <div className="my-profile"> My Profile</div>
                <div className="flex flex-col gap-14">
                  <div className="row-1 flex justify-between items-center font-light">
                    <input
                      className="content-input  text-black border-2 border-[#63C5DA] rounded px-2 py-2 w-full max-w-[400px] text-[18px] md:text-[20px]"
                      placeholder={firstName}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                      className="content-input  text-black border-2 border-[#63C5DA] rounded px-2 py-2 w-full max-w-[400px] text-[18px] md:text-[20px]"
                      placeholder={lastName}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="row-2 flex justify-between items-center font-light">
                    <input
                      type="date"
                      className="content-input text-black  border-2 border-[#63C5DA] rounded px-2 py-2 w-full max-w-[400px] text-[18px] md:text-[20px]"
                      placeholder={dateOfBirth}
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                    <input
                      className="content-input text-black border-2 border-[#63C5DA] rounded px-2 py-2 w-full max-w-[400px] text-[18px] md:text-[20px]"
                      placeholder={email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="row-3 flex justify-between items-center font-light">
                    <input
                      type="number"
                      value={phoneNo}
                      className="content-input text-black border-2 border-[#63C5DA] rounded px-2 py-2 w-full max-w-[400px] text-[18px] md:text-[20px]"
                      placeholder={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                    />
                  </div>

                  <button
                    className="bg-[#FA8128] text-white px-3 py-1  rounded-3xl w-26 cursor-pointer  hover:bg-[#e96e12] transition duration-300"
                    onClick={handleApi}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
            {selectedItem === "Notifications" && (
              <div className="notification-div flex flex-col gap-10 px-5 md:px-10 pt-10 text-[20px] md:text-[24px] h-full text-[#FA8128] font-bold">
                <div className="my-notifications"> My Notifications</div>
                <div className="text-black text-[18px] font-medium">
                  {" "}
                  Choose your notification preferences and how you prefer to be
                  contacted.
                </div>
                <div className="text-[#FA8128] text-[18px]">
                  Message/Reminders
                </div>
                <div className="text-black text-[18px] font-medium">
                  Recieve my booking information
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="text-[#FA8128]">Email</div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div
                      className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2   rounded-full peer peer-checked:bg-[#FA8128] transition-all duration-300"
                      onClick={() => handleToggleEmail}
                    ></div>
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-full"></div>
                  </label>
                </div>
              </div>
            )}
            {selectedItem === "Payment Methods" && (
              <div className="bank-div px-5 md:px-10 pt-10 text-[20px] md:text-[24px] flex flex-col gap-8 h-full text-[#FA8128] font-bold">
                {!isBankClicked ? (
                  <>
                    <div className="bank-acc">Bank Account</div>
                    <div
                      className="bank-acc p-3 border-[#63C5DA] border-2 w-fit flex items-center gap-2 cursor-pointer"
                      onClick={handleBankClick}
                    >
                      Add payment method
                      <AiOutlinePlusCircle className="text-2xl" />
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="bank-yes-div flex flex-col gap-4 text-black font-medium">
                      <div className="bank-row-1 flex flex-col md:flex-row gap-2">
                        <div className="bank-row-1-detail md:w-1/2">
                          Account Holder Name
                        </div>
                        <input
                          className="content-input border-2 border-[#63C5DA] rounded px-2 py-2 w-full text-[18px] md:text-[20px]"
                          placeholder="Lorem ipsum"
                        />
                      </div>
                      <div className="bank-row-2 flex flex-col md:flex-row gap-2">
                        <div className="bank-row-2-detail md:w-1/2">Email</div>
                        <input
                          className="content-input border-2 border-[#63C5DA] rounded px-2 py-2 w-full text-[18px] md:text-[20px]"
                          placeholder="Lorem ipsum"
                        />
                      </div>

                      <div className="bank-row-4 flex flex-col md:flex-row gap-2">
                        <div className="bank-row-4-detail md:w-1/2">
                          Account Number
                        </div>
                        <input
                          className="content-input border-2 border-[#63C5DA] rounded px-2 py-2 w-full text-[18px] md:text-[20px]"
                          placeholder="Lorem ipsum"
                        />
                      </div>
                      <div className="bank-row-5 flex flex-col md:flex-row gap-2">
                        <div className="bank-row-5-detail md:w-1/2">
                          Account Holder's Address
                        </div>
                        <input
                          className="content-input border-2 border-[#63C5DA] rounded px-2 py-2 w-full text-[18px] md:text-[20px]"
                          placeholder="Lorem ipsum"
                        />
                      </div>
                      <div className="bank-row-6 flex flex-col md:flex-row gap-2">
                        <div className="bank-row-6-detail md:w-1/2">
                          Account Holder's Post Code
                        </div>
                        <input
                          className="content-input border-2 border-[#63C5DA] rounded px-2 py-2 w-full text-[18px] md:text-[20px]"
                          placeholder="Lorem ipsum"
                        />
                      </div>
                      <div className="bank-row-7 flex flex-col md:flex-row gap-2">
                        <div className="bank-row-7-detail md:w-1/2">
                          Account Holder's Town/City
                        </div>
                        <input
                          className="content-input border-2 border-[#63C5DA] rounded px-2 py-2 w-full text-[18px] md:text-[20px]"
                          placeholder="Lorem ipsum"
                        />
                      </div>
                      <div className="bank-row-8 flex flex-col md:flex-row gap-2">
                        <div className="bank-row-8-detail md:w-1/2">
                          State Code
                        </div>
                        <input
                          className="content-input border-2 border-[#63C5DA] rounded px-2 py-2 w-full text-[18px] md:text-[20px]"
                          placeholder="Lorem ipsum"
                        />
                      </div>
                      <div className="bank-row-9 flex flex-col sm:flex-row gap-4 mt-4 font-bold">
                        <button className="bg-[#FA8128] text-white px-4 py-2 rounded-3xl w-full sm:w-auto">
                          Save
                        </button>
                        <button className="bg-[#FA8128] text-white px-4 py-2 rounded-3xl w-full sm:w-auto">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedItem === "Passwords" && (
              <div className="password-div flex flex-col gap-10 px-5 md:px-10 pt-10 text-[20px] md:text-[24px] h-full text-[#FA8128] font-medium">
                <div className="passwordAndSecurity">Password and Security</div>
                <div className="row-1 flex justify-between items-center">
                  <input
                    type="password"
                    className="content-input text-black  border-2 border-[#63C5DA] rounded px-2 py-2 w-full max-w-[400px] text-[18px] md:text-[20px]"
                    placeholder="Current Password"
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="row-2 flex justify-between items-center">
                  <input
                    type="password"
                    className="content-input text-black    border-2 border-[#63C5DA] rounded px-2 py-2 w-full max-w-[400px] text-[18px] md:text-[20px]"
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="row-2 flex justify-between items-center">
                  <input
                    type="password"
                    className="content-input text-black   border-2 border-[#63C5DA] rounded px-2 py-2 w-full max-w-[400px] text-[18px] md:text-[20px]"
                    placeholder="Re-enter Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="text-black text-[15px]">
                  Your password must be at least 8 characters long and include
                  at least one letter and one number. Increase its security by
                  including special characters.
                </div>
                <button
                  className="bg-[#FA8128] hover:bg-[#e96e12] cursor-pointer text-white px-3 py-1 rounded-3xl w-60 transition duration-300"
                  onClick={handlePasswordApi}
                >
                  Reset Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
