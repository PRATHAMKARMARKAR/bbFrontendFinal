import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import "../../styles/LandingPage.css";
import { TbArrowBack } from "react-icons/tb";
import { FaLock } from "react-icons/fa";
import { GiWorld, GiHamburgerMenu } from "react-icons/gi";
import { IoIosSearch } from "react-icons/io";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import { HiArrowNarrowRight } from "react-icons/hi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ProductionApi, LocalApi } from "../../../utills";
// adjust path as needed
const Onboardingpage = () => {
  const [count, setCount] = useState(5);
  const [earnings, setEarnings] = useState(15);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => {
    if (count > 0) setCount((prev) => prev - 1);
  };
  const handleCalculate = () => {
    setEarnings(count * 3);
  };

  const navigate = useNavigate();
  const imgArr = Array(6).fill({ img: "/Tower.svg" });

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: (
      <div className="custom-arrow-left absolute top-1/2 -translate-y-1/2 left-[-40px] z-10">
        <BsArrowLeftCircle className="text-4xl text-[#63C5DA] cursor-pointer hover:text-[#47a7bf] transition-all duration-300" />
      </div>
    ),
    nextArrow: (
      <div className="custom-arrow-right absolute top-1/2 -translate-y-1/2 right-[-40px] z-10">
        <BsArrowRightCircle className="text-4xl text-[#63C5DA] cursor-pointer hover:text-[#47a7bf] transition-all duration-300" />
      </div>
    ),
  };

  const reviewsArr = [
    { name: "Sophie Leone", review: "A Happy Customer", img: "/person.svg" },
    { name: "John Doe", review: "Great Service!", img: "/person.svg" },
    { name: "Jane Smith", review: "Highly Recommend!", img: "/person.svg" },
    { name: "Mark Johnson", review: "Very Satisfied!", img: "/person.svg" },
  ];
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

  const settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: (
      <div className="custom-arrow-left">
        <BsArrowLeftCircle className="text-4xl text-[#63C5DA] cursor-pointer hover:text-[#47a7bf] transition-all duration-300" />
      </div>
    ),
    nextArrow: (
      <div className="custom-arrow-right">
        <BsArrowRightCircle className="text-4xl text-[#63C5DA] cursor-pointer hover:text-[#47a7bf] transition-all duration-300" />
      </div>
    ),
  };
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  useEffect(() => {
    console.log("logged in ? : ", isLoggedIn);
  }, []);
  const dispatch = useDispatch();
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const handleLogoutApi = async () => {
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
      navigate("/register/partner");
      dispatch({ type: "login/login", payload: false }); // Set login state to false
      localStorage.removeItem("token");
    } catch (error) {
      console.log("error : ", error);
    }
  };

  const handleLogoClick = () => {
    navigate("/landingpage");
    if (!isLoggedIn) {
      dispatch({ type: "login/login" });
    }
  };

  return (
    <>
      <div className="page p-2 md:pl-15 md:pr-15 px-5">
        {/* Navbar */}
        <div className="w-full">
          {/* Mobile layout: visible on small screens only */}
          <div className="md:hidden flex flex-col gap-4 p-4">
            <div className="flex justify-between items-center">
              <div className="flex" onClick={handleLogoClick}>
                <div className="logo-bag"></div>
                <div className="logo"></div>
              </div>
              <div className="burger p-2">
                <GiHamburgerMenu
                  size={30}
                  color="#FA8128"
                  onClick={() => {
                    if (isLoggedIn && !isPartner) {
                      navigate("/useroverview");
                    } else if (isPartner && isLoggedIn) {
                      navigate("/partneroverview");
                    }
                  }}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="relative w-full">
                <select className="appearance-none border-2 border-[#FA8128] rounded-lg p-2 pr-10 bg-white w-full">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <img src="/Dropdown.svg" alt="" className="w-7 h-7" />
                </div>
              </div>
            </div>
          </div>

          {/* Original navbar visible only on medium and up */}
          <div className="hidden md:block">
            <div className="navbar flex p-2 pl-15 pr-15  m-4 justify-between text-2xl ">
              {/* === Your original code stays untouched here === */}
              <div className="flex " onClick={handleLogoClick}>
                <div className="logo-bag"></div>
                <div className="logo"></div>
              </div>
              <div className="nav-links flex gap-15">
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
                <div className="burger p-2">
                  <GiHamburgerMenu
                    size={35}
                    color="#FA8128"
                    onClick={() => {
                      if (isLoggedIn && !isPartner) {
                        navigate("/useroverview");
                      } else if (isPartner && isLoggedIn) {
                        navigate("/partneroverview");
                      }
                    }}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="page1 ml-0  -mt-0 md:-mt-12 h-auto md:h-screen w-full flex flex-col md:flex-row items-center justify-center px-4 md:px-0 py-10 md:py-0 gap-10 md:gap-0">
          {/* Mobile: Replace left section with a decorative circle */}
          <div className="left1 w-screen md:w-[40%] md:-mr-20 h-40 md:h-auto  items-center justify-center hidden md:block">
            <div className="block md:hidden w-32 h-32 border-4 border-cyan-400 rounded-full"></div>
          </div>

          {/* Right Section (Original Content) */}
          <div className="right1 h-auto md:h-[60%] flex flex-col items-center justify-center text-center px-4 w-full md:w-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-orange-400 mb-4 md:mr-24">
              Earn money effortlessly!
            </h2>
            <p className="text-lg md:text-3xl text-cyan-500 mb-6 text-center md:text-right md:ml-10">
              Life isn’t just about parcels
              <br />
              Why not boost your income by storing <br /> luggage?
            </p>
            <div className="w-full flex justify-center md:justify-end md:pr-44">
              <button
                className="bg-[#FA8128] w-60 md:w-72 z-[1] text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-[#FA8128] transition border-5 border-[#FFA480] cursor-pointer"
                onClick={() => {
                  // Set isPartner to true
                  isLoggedIn
                    ? handleLogoutApi()
                    : navigate("/register/partner");
                }}
              >
                Become a partner
              </button>
            </div>
          </div>
        </div>

        {/* Benefit Section */}
        <div className="w-full flex flex-wrap flex-col md:flex-row justify-between items-center md:items-start p-6 md:p-10 gap-10">
          <h2 className="text-4xl md:text-6xl text-center md:text-left overflow-y-hidden h-auto md:h-36 font-bold text-[#FA8128] mb-2">
            Storing luggage with Baggage Bugs is a total{" "}
            <br className="hidden md:block" />
            <span className="text-cyan-500"> game-changer!</span>
          </h2>

          {/* Left Box */}
          <div className="border-2 border-l-white border-cyan-300 p-6 w-full md:w-[50%]">
            <div className="mt-8 space-y-6 text-left">
              <div>
                <p className="text-[#FA8128] font-semibold text-xl">
                  No costs, just cash!
                </p>
                <p className="text-cyan-500 font-extralight">
                  Keep 100% of the profits.
                </p>
              </div>
              <div>
                <p className="text-[#FA8128] font-semibold text-xl">
                  Money straight to your account
                </p>
                <p className="text-cyan-500 font-extralight">
                  Get paid every month hassle-free.
                </p>
              </div>
              <div>
                <p className="text-[#FA8128] font-semibold text-xl">
                  Get noticed!
                </p>
                <p className="text-cyan-500 font-extralight">
                  Let the world discover your business for free.
                </p>
              </div>
              <div>
                <p className="text-[#FA8128] font-semibold text-xl">
                  More bags, more bucks!
                </p>
                <p className="text-cyan-500 font-extralight">
                  Every customer is a potential buyer for you.
                </p>
              </div>
            </div>
          </div>

          {/* Right Box */}
          <div className="flex flex-col items-center justify-center w-full md:w-[40%] text-center">
            {/* Capacity Section */}
            <div className="flex flex-col sm:flex-row items-center border border-cyan-500 rounded overflow-hidden mb-6 p-2">
              <div className="bg-white px-4 py-2 text-cyan-500 font-medium">
                Your capacity
              </div>
              <div className="bg-[#FA8128] text-white px-3 py-3 flex items-center gap-2">
                <div className="bg-[#FA8128] px-1  flex items-center gap-3 ">
                  <span
                    onClick={decrement}
                    className="cursor-pointer select-none"
                  >
                    ↓
                  </span>
                  <span className="text-lg font-semibold">{count}</span>
                  <span
                    onClick={increment}
                    className="cursor-pointer select-none"
                  >
                    ↑
                  </span>
                </div>
              </div>
            </div>

            {/* Earnings Section */}
            <p className="text-cyan-500 text-xl md:text-2xl font-medium">
              Upto
            </p>
            <p className="text-3xl md:text-4xl font-bold text-[#FA8128] mb-1">
              {earnings} EUR/month
            </p>
            <a href="#" className="text-cyan-500 text-sm underline mb-6">
              How is this estimated?
            </a>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              className="bg-[#FA8128] text-white font-semibold px-8 py-3 text-base md:text-lg rounded-full shadow-md hover:bg-[#FA8128] transition border-5 border-[#FFA480]"
            >
              Calculate
            </button>
          </div>
        </div>

        <div className="section-5 mt-12 relative">
          <div className="w-[90%] md:w-[75%] mx-auto md:ml-[4%] mt-10 md:mt-28 p-5 md:p-10 md:pr-20 border-2 border-[#63C5DA] md:border-l-0">
            <div className="text-[32px] md:text-[50px] font-bold leading-tight">
              <div className="text-[#FA8128]">
                No more worries about your luggage!
              </div>
              <div className="text-[#63C5DA]">
                We take care of it like its our own
              </div>
            </div>

            <div className="text-[#FA8128] text-[20px] md:text-[30px] leading-tight mt-6 md:mt-15">
              <div>Comprehensive Protection</div>
              <div className="text-[#63C5DA]">
                Your luggage is safeguarded with coverage up to €10,000 for
                damage, loss, or theft.
              </div>
            </div>

            <div className="text-[#FA8128] text-[20px] md:text-[30px] leading-tight mt-6 md:mt-10">
              <div>Reliable storage partners</div>
              <div className="text-[#63C5DA]">
                Our verified partners ensure secure handling through ID checks
                and reservation confirmations
              </div>
            </div>
          </div>

          {/* This keeps the bag image exactly positioned for large screens */}
          <div className="luggage-onboarding z-10 md:absolute md:translate-x-[1050px] md:-translate-y-[580px] mt-10 md:mt-0 mx-auto md:mx-0 hidden md:block"></div>
        </div>
        <div className="section-4 mt-45 flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40">
          <div className="text-[#63C5DA] text-[30px] sm:text-[40px] md:text-[45px] font-bold text-center">
            <span className="text-[#FA8128]">Reviews </span>
            from our Backpackers
          </div>

          <Slider
            {...settings2}
            className="w-full sm:w-[90%] md:w-[80%] mt-6 sm:mt-8 md:mt-10"
          >
            {reviewsArr.map((review, index) => (
              <div
                key={index}
                className="reviews h-auto sm:h-[450px] md:h-[500px] w-full sm:w-[90%] md:w-[70%] p-3 sm:p-5 flex flex-col sm:flex-row justify-center sm:justify-between items-center border-[#63C5DA] mt-4 sm:mt-5 mx-auto"
              >
                {/* Middle Content */}
                <div className="flex flex-col sm:flex-row flex-[100%] sm:flex-[70%] border-2 border-[#63C5DA] p-4 sm:p-5 px-6 sm:px-10 text-center sm:text-left items-center sm:items-start rounded-lg shadow-md box-border w-full">
                  {/* Image Section */}
                  <div className="reviews-left flex-[100%] sm:flex-[35%] flex justify-center items-center mb-4 sm:mb-0">
                    <img
                      src={review.img}
                      alt="Person"
                      className="h-[180px] sm:h-[80%] w-auto object-cover shadow-[-8px_-8px_10px_#FA8128,-8px_8px_10px_#FA8128]"
                    />
                  </div>
                  {/* Text Section */}
                  <div className="reviews-right flex-[100%] sm:flex-[65%] text-left pl-0 sm:pl-5">
                    <p className="text-xl sm:text-2xl font-bold text-gray-700">
                      {review.name}
                    </p>
                    <p className="text-base sm:text-lg text-gray-500 mt-2">
                      {review.review}
                    </p>
                  </div>
                </div>

                {/* Right Arrow */}
              </div>
            ))}
          </Slider>
        </div>
        <div className="section-7 mt-25 mx-auto max-w-[90%] sm:px-0">
          <div className="text-[#FA8128] text-[45px] font-bold text-center ">
            Frequently <span className="text-[#63C5DA]">Asked Questions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 text-center">
            <div className="p-4 border border-[#63C5DA] rounded-lg shadow-md bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg text-[#FA8128] font-semibold">
                  What is Baggage Bugs storage?
                </h3>
                <HiArrowNarrowRight className="text-[#63C5DA] text-2xl ml-2" />
              </div>
            </div>

            <div className="p-4 border border-[#63C5DA] rounded-lg shadow-md bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg text-[#FA8128] font-semibold">
                  How to book luggage storage?
                </h3>
                <HiArrowNarrowRight className="text-[#63C5DA] text-2xl ml-2" />
              </div>
            </div>

            <div className="p-4 border border-[#63C5DA] rounded-lg shadow-md bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg text-[#FA8128] font-semibold">
                  How much does luggage cost?
                </h3>
                <HiArrowNarrowRight className="text-[#63C5DA] text-2xl ml-2" />
              </div>
            </div>

            <div className="p-4 border border-[#63C5DA] rounded-lg shadow-md bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg text-[#FA8128] font-semibold">
                  Cost of 2 days of luggage?
                </h3>
                <HiArrowNarrowRight className="text-[#63C5DA] text-2xl ml-2" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:px-[7%] lg:px-[7%] py-10">
          <div className="section-9 mt-40 w-full flex flex-col md:flex-row h-auto md:h-[500px]">
            {/* Left Section */}
            <div className="section-9-left w-full md:w-1/2 flex flex-col gap-5 px-0 md:px-4">
              <div className="leading-tight">
                <div className="text-[#FA8128] text-[50px] md:text-[70px] font-bold">
                  About
                </div>
                <div className="text-[#63C5DA] text-[50px] md:text-[70px] font-bold">
                  Baggage Bugs
                </div>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="/Rating.svg"
                  alt="Star"
                  className="w-6 h-6 md:w-8 md:h-8"
                />
                <img
                  src="/Rating.svg"
                  alt="Star"
                  className="w-6 h-6 md:w-8 md:h-8"
                />
                <img
                  src="/Rating.svg"
                  alt="Star"
                  className="w-6 h-6 md:w-8 md:h-8"
                />
                <img
                  src="/Rating.svg"
                  alt="Star"
                  className="w-6 h-6 md:w-8 md:h-8"
                />
                <img
                  src="/Rating.svg"
                  alt="Star"
                  className="w-6 h-6 md:w-8 md:h-8"
                />
              </div>
              <div className="leading-tight text-[18px] md:text-[25px]">
                <div className="text-[#63C5DA]">
                  5 star ratings by{" "}
                  <span className="text-[#FA8128]">2345+</span> verified
                </div>
                <div className="text-[#63C5DA]">bag packers</div>
              </div>
              <div className="font-light flex gap-4 md:gap-5 text-[24px] md:text-[40px]">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/Instagram.svg"
                    alt="Instagram"
                    className="w-8 h-8 md:w-10 md:h-10"
                  />
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/Facebook.svg"
                    alt="Facebook"
                    className="w-8 h-8 md:w-10 md:h-10"
                  />
                </a>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/LinkedIn.svg"
                    alt="LinkedIn"
                    className="w-8 h-8 md:w-10 md:h-10"
                  />
                </a>
                <a
                  href="https://www.twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/X.svg"
                    alt="Twitter"
                    className="w-8 h-8 md:w-10 md:h-10"
                  />
                </a>
              </div>
              <div className="mt-4 text-[18px] md:text-[25px]">
                <div className="text-[#FA8128]">Contact Us</div>
                <div className="text-[#63C5DA]">baggagebugs123@gmail.com</div>
                <div className="text-[#63C5DA]">+88 8373746498</div>
              </div>
            </div>

            {/* Right Section */}
            <div className="section-9-right w-full md:w-1/2 text-[20px] md:text-[32px] text-[#63C5DA] flex flex-col justify-between mt-10 md:mt-0 px-0 md:px-4">
              <div>
                <span className="text-[#FA8128] font-bold">Baggage Bugs</span>{" "}
                is a collaborative luggage storage network, partnering with
                trusted shops worldwide to provide a secure and convenient
                solution for travelers.
              </div>
              <div>
                <span className="text-[#FA8128] font-bold">
                  Say goodbye to the hassle
                </span>{" "}
                of carrying heavy bags while exploring a new city.
              </div>
              <div>
                Your luggage will always have a{" "}
                <span className="text-[#FA8128] font-bold">safe place</span>,
                allowing you to enjoy your journey to the fullest!
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboardingpage;
