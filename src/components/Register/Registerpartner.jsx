import React, { useState } from "react";
import "../../styles/Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { ProductionApi } from "../../../utills";
import { ToastContainer, toast } from "react-toastify";

const GoogleIcon = () => <span className="googleimg"></span>;
const FacebookIcon = () => <span className="fbimg"></span>;
const StoreIcon = () => <span className="bimg"></span>;

const SocialButton = ({ icon, text }) => (
  <button className="flex items-center gap-10 p-3 w-full border border-[#28d3fa] bg-white max-w-xs rounded-lg text-black transition">
    {icon} {text}
  </button>
);

const Registerpartner = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handletoLogin = () => navigate("/");
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(`${ProductionApi}/partner/register`, {
        firstName,
        lastName,
        email,
        password,
      });

      const { token, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      toast.success("Registration successful!");
      console.log(response.data);
      
     navigate("/login/partner");
      dispatch({ type: "login/login", payload: true });
    } catch (error) {
      console.log(error);
      toast.error("Registration failed!");
    }
  };

  return (
    <div className="login-main flex flex-col md:flex-row w-full h-auto overflow-y-auto md:h-screen md:overflow-hidden">
      {/* LEFT SIDE */}
      <div className="left-pane md:w-[30%] w-full md:h-full relative bg-[#FA8128] flex items-center justify-center overflow-hidden">
        <div className="globeimg absolute top-10 left-0 md:w-[60%] md:h-[60%] w-1/2 h-1/2 opacity-50 z-0" />
        <div className="passport-img absolute z-10 hidden md:block" />
      </div>

      {/* RIGHT SIDE */}
      <div className="right-pane md:w-[70%] w-full bg-[#fefefe] relative flex items-start justify-start p-6 md:p-10 overflow-hidden">
        <div className="map absolute top-0 left-0 w-full h-full opacity-70 z-0" />
        <div className="map-wrapper w-full max-w-xl relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center w-full mb-10 px-4">
            <h1 className="text-3xl md:text-3xl font-bold flex gap-2">
              <span className="text-[#FA8128]">Hello,</span>
              <span className="text-[#28d3fa]">Partner</span>
            </h1>

            <button
              onClick={() => navigate("/landingpage")}
              className="text-4xl md:text-3xl text-black ml-20"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <h2 className="text-xl md:text-2xl text-black mb-2">Register</h2>

            <input
              type="text"
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full md:w-[300px] p-2 rounded-lg border-2 border-[#63C5DA] text-gray-700 focus:ring-2 focus:ring-[#FA8128] outline-none"
            />
            <input
              type="text"
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              className="w-full md:w-[300px] p-2 rounded-lg border-2 border-[#63C5DA] text-gray-700 focus:ring-2 focus:ring-[#FA8128] outline-none"
            />
            <input
              type="email"
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full md:w-[300px] p-2 rounded-lg border-2 border-[#63C5DA] text-gray-700 focus:ring-2 focus:ring-[#FA8128] outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full md:w-[300px] p-2 rounded-lg border-2 border-[#63C5DA] text-gray-700 focus:ring-2 focus:ring-[#FA8128] outline-none"
            />

            <p className="text-black underline cursor-pointer text-sm max-w-[300px]">
              Forgot password?
            </p>

            <button
              type="submit"
              className="bg-[#FA8128] cursor-pointer hover:bg-[#f77a20] text-white text-lg py-2 px-6 rounded-3xl w-full md:max-w-[300px] border-4 border-[#FFA480] mt-2"
            >
              Register
            </button>

            <div className="flex space-x-1 ml-10 max-w-[300px]">
              <p className="text-black text-sm">Already have an account?</p>
              <span
                onClick={handletoLogin}
                className="underline text-[#FA8128] text-sm cursor-pointer"
              >
                Login
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registerpartner;