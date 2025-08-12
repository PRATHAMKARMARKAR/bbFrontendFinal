import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import axios from "axios";
import { ProductionApi, LocalApi } from "../../../utills";
import { useSelector, useDispatch } from "react-redux";
import { useState,useEffect} from "react";
const Partneroverview = () => {
  const navigate = useNavigate();

  const GoogleIcon = () => <span className="googleimg"></span>;
  const FacebookIcon = () => <span className="fbimg"></span>;
  const StoreIcon = () => <span className="bimg"></span>;
  const ReviewsIcon = () => <span className="reviewimg"></span>;
  const StarIcon = () => <span className="starimg"></span>;
  const LogoutIcon = () => <span className="logoutimg"></span>;

  const SocialButton = ({ icon, text, onClick }) => (
    <button
      className="flex items-center gap-4 p-3 w-full border border-[#28d3fa] bg-white max-w-xs rounded-lg cursor-pointer transition hover:shadow-md"
      onClick={onClick}
    >
      {icon} {text}
    </button>
  );

  const handleProfileClick = () => {
    navigate("/dashboard");
  };
  const handleSettingsClick = () => {};
  const handleBookingsClick = () => {
    navigate("/reservation");
  };
  const handleReviewsClick = () => {
    navigate("/reviews");
  };
  const handleAssistanceClick = () => {};
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const dispatch = useDispatch();
  const handleLogoutClick = async () => {
    try {
      const response = await axios.post(
        `${ProductionApi}/user/logout`,
        {
          withCredentials: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("logged out");
      dispatch({ type: "login/login", payload: false }); // Set login state to false
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
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

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      {/* Left Section */}
      <div className="w-full hidden md:flex md:w-[30%] h-[250px] md:h-full bg-[#FA8128] relative items-center justify-center overflow-hidden">
        <div className="logoimg absolute top-5 left-5 md:top-10 md:left-10 z-10"></div>
        <div className="globeimg hidden md:block absolute w-full h-full opacity-45 z-0"></div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-[70%] h-full relative flex flex-col p-6 md:p-10 overflow-hidden bg-[#fefefe]">
        <div className="map absolute top-0 left-0 w-full h-full opacity-70 z-0"></div>

        <div className="relative z-10 pr-2 md:pr-4 h-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 md:gap-3">
              <h1 className="text-[#FA8128] font-medium text-3xl md:text-4xl">
                Hello,
              </h1>
              <h1 className="text-[#28d3fa] font-medium text-3xl md:text-4xl">
                Partner
              </h1>
            </div>
            <div
              className="crossimg cursor-pointer"
              onClick={() => navigate("/landingpage")}
            ></div>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7 text-lg md:text-xl mt-6">
            <SocialButton
              icon={<GoogleIcon />}
              text="My Profile"
              onClick={handleProfileClick}
            />

            <SocialButton
              icon={<StoreIcon />}
              text="My Bookings"
              onClick={handleBookingsClick}
            />
            <SocialButton
              icon={<ReviewsIcon />}
              text="My Reviews"
              onClick={handleReviewsClick}
            />

            <SocialButton
              icon={<LogoutIcon />}
              text="Logout"
              onClick={handleLogoutClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partneroverview;
