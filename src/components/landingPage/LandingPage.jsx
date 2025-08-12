import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import "../../styles/LandingPage.css";
import { TbArrowBack } from "react-icons/tb";
import { FaLock } from "react-icons/fa";
import { GiWorld } from "react-icons/gi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosSearch } from "react-icons/io";
import { BsArrowLeftCircle } from "react-icons/bs";
import { BsArrowRightCircle } from "react-icons/bs";
import { HiArrowNarrowRight } from "react-icons/hi";
import Slider from "react-slick";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector, useDispatch } from "react-redux";
import { GoogleApi } from "../../../utills";
import axios from "axios";
import { ProductionApi, LocalApi } from "../../../utills";
import { useSearchParams } from "react-router-dom";
import { Cookie } from "lucide-react";
import setTokenValue from "../redux/features/tokenSlice";
import setRoleValue from "../redux/features/roleSlice";

const LandingPage = () => {
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const isPartner = useSelector((state) => state.partner.isPartner);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  // const [searchParams] = useSearchParams();
const location = useLocation();
const tokenFromLogin = location.state?.token;
const roleFromLogin = location.state?.role;
console.log(tokenFromLogin);

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    const urlRole = new URLSearchParams(window.location.search).get("role");
    if (urlRole === "partner") {
      dispatch({ type: "partner/setIsPartner", payload: true });
    }
    const storedToken = localStorage.getItem("token");
    
    console.log("ispartner : ", isPartner);
    const tokenf = urlToken || tokenFromLogin 
    if (urlToken && !storedToken) {
      
     
      localStorage.setItem("token", tokenf);
      dispatch({ type: "token/setTokenValue", payload: urlToken });
      dispatch({ type: "login/login", payload: true }); // Set login state to true
      console.log("Token from URL saved and user logged in.");
    } else if (storedToken) {
      dispatch({ type: "login/login", payload: true }); // Set login state to true
      console.log("Token from localStorage found, user logged in.");
    }
  }, [dispatch]);
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

  // useEffect(()=>{
  //  const token1 = localStorage.getItem("token");

  //  if(token1) {

  //   console.log("Token found, logout dispatched.");}
  // },[])

  const token = useSelector((state) => state.token.tokenValue);

  const imgArr = [
    {
      img: "/Tower.svg",
    },
    {
      img: "/Tower.svg",
    },
    {
      img: "/Tower.svg",
    },
    {
      img: "/Tower.svg",
    },
    {
      img: "/Tower.svg",
    },
    {
      img: "/Tower.svg",
    },
  ];
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
    responsive: [
      {
        breakpoint: 768, // tablet and below
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: true,
        },
      },
    ],
  };

  const reviewsArr = [
    { name: "Sophie Leone", review: "A Happy Customer", img: "/person.svg" },
    { name: "John Doe", review: "Great Service!", img: "/person.svg" },
    { name: "Jane Smith", review: "Highly Recommend!", img: "/person.svg" },
    { name: "Mark Johnson", review: "Very Satisfied!", img: "/person.svg" },
  ];

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
  const [map, setMap] = React.useState(null);
  const [center, setCenter] = React.useState({ lat: 41.3851, lng: 2.1734 }); // default to Barcelona

  const containerStyle = {
    width: "600px",
    height: "400px",
  };

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.warn("Geolocation not allowed. Using default location.");
        }
      );
    }
    //  Cookies.set("token", token, { expires: 1});
    //  Cookies.set("role", role, { expires: 1 }); // Assuming role is 'user' for this example
  }, []);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GoogleApi,
  });

  const onLoad = React.useCallback(
    function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setMap(map);
    },
    [center]
  );

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleLogoutClick = async () => {
    try {
      const response = await axios.post(
        `${ProductionApi}/user/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("logged out");
      navigate("/");
      dispatch({ type: "login/login", payload: false }); // Set login state to false
      dispatch({ type: "partner/setIsPartner", payload: false }); // Set isPartner to false
      localStorage.removeItem("token");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="page p-2 md:pl-15 md:pr-15 px-3">
        <div className="w-full">
          {/* Mobile layout: visible on small screens only */}
          <div className="md:hidden flex flex-col gap-4 p-4">
            <div className="flex justify-between items-center">
              <div className="flex">
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
              <div
                className="appearance-none border-2 border-[#FA8128] rounded-lg p-2 px-4 cursor-pointer bg-white text-center"
                onClick={() => {
                  if (isLoggedIn) {
                    handleLogoutClick();
                  } else {
                    navigate("/");
                  }
                }}
              >
                {isLoggedIn ? "Logout" : "Login"}
              </div>
              {!isPartner && (
                <div
                  className="appearance-none border-2 border-[#FA8128] rounded-lg p-2 px-4 cursor-pointer bg-white text-center"
                  onClick={() => navigate("/onboarding")}
                >
                  Partner
                </div>
              )}

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
              <div className="flex">
                <div className="logo-bag"></div>
                <div className="logo"></div>
              </div>
              <div className="nav-links flex gap-15">
                <div
                  className="appearance-none border-2 border-[#FA8128] rounded-lg p-2 px-4 cursor-pointer bg-white"
                  onClick={() => {
                    if (isLoggedIn) {
                      handleLogoutClick();
                    } else {
                      navigate("/");
                    }
                  }}
                >
                  {isLoggedIn ? "Logout" : "Login"}
                </div>
                {!isPartner && (
                  <div
                    className="appearance-none border-2 border-[#FA8128] rounded-lg p-2 px-4 cursor-pointer bg-white"
                    onClick={() => navigate("/onboarding")}
                  >
                    Partner
                  </div>
                )}
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

        <div className="w-full md:px-10 lg:px-20 py-10">
          {/* Responsive wrapper for section-1 */}
          <div className="section-1 flex flex-col md:flex-row justify-between items-center gap-10">
            {/* Left Side: Hidden on small screens */}
            <div className="hidden md:block w-full md:w-[850px]">
              <div className="section-1-left mt-[-2%] h-[300px] md:h-[600px] w-full bg-cover bg-center">
                {/* Add background image via CSS or inline style if needed */}
              </div>
            </div>

            {/* Right Side */}
            <div className="section-1-right h-auto md:h-[600px] w-full md:w-[800px] pt-10 md:pt-15 pb-10 pr-0 md:pr-15 flex flex-col justify-between text-right">
              <div className="text-[#FA8128] text-[20px] md:text-[25px]">
                Trusted by 200+ bagpackers
              </div>

              <div className="mt-4">
                <div className="text-[#FA8128] text-[35px] md:text-[55px] font-bold mb-[-10px] md:mb-[-15px]">
                  Keep your Luggage Safe
                </div>
                <div className="text-[#63C5DA] text-[35px] md:text-[55px] mb-[-10px] md:mb-[-15px]">
                  Wherever You Go
                </div>
                <div className="text-[#FA8128] text-[22px] md:text-[30px] mt-2">
                  Starting from 10€ an hour
                </div>
              </div>

              <div className="flex flex-col items-end mt-6 md:mt-10">
                <div className="relative w-full md:w-[500px]">
                  <input
                    className="border-2 rounded-4xl p-2 w-full mb-2 text-[#63C5DA] font-extrabold shadow-md pr-12 h-12"
                    placeholder="Barcelona"
                    type="text"
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && isLoggedIn) {
                        navigate("/bookingpage", {
                          state: { query, isLoggedIn },
                        });
                      }
                    }}
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#63C5DA]">
                    <IoIosSearch size={24} />
                  </span>
                </div>

                <button
                  onClick={() => {
                    navigate("/bookingpage", { state: { isLoggedIn, query } });
                  }}
                  className="pl-12 pr-12 py-2 text-white rounded-4xl bg-[#FA8128] shadow-md hover:bg-[#e4711f]"
                >
                  Search
                </button>
              </div>

              <div className="mt-6 md:mt-10 flex flex-col items-end gap-2">
                <div className="flex items-center text-[#FA8128] text-[18px] md:text-[22px] gap-2 justify-end">
                  <TbArrowBack />
                  <span>Free Cancellation</span>
                </div>

                <div className="flex items-center text-[#FA8128] text-[18px] md:text-[22px] gap-2 justify-end">
                  <FaLock />
                  Luggage Protection €10,000
                </div>

                <div className="flex items-center text-[#FA8128] text-[18px] md:text-[22px] gap-2 justify-end">
                  <GiWorld />
                  10000+ spots
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* section2 */}

        <div className="section-2 flex flex-col-reverse md:flex-row items-center mt-10 gap-10 md:gap-48 ml-4 md:ml-30 relative">
          {/* Text block (How does it work?) - repositioned above on mobile */}
          <div className="section-2-right mb-6 md:mb-0 h-auto md:h-[450px] w-full md:w-[400px] flex flex-col justify-center items-center md:items-end pr-0 md:pr-5 leading-tight">
            <div className="text-[#63C5DA] text-[30px] md:text-[50px] font-bold text-center md:text-right">
              How does it
            </div>
            <div className="text-[#FA8128] text-[30px] md:text-[50px] font-bold text-center md:text-right">
              work?
            </div>
          </div>

          {/* Step circle */}
          <div
            className="
    section-2-left 
    h-[400px] md:h-[500px] 
    w-full md:w-[500px] 
    ml-0 md:ml-10 
    pt-6 md:pt-30 
    pb-6 md:pb-8 
    px-4 md:px-16 
    flex flex-col justify-center md:justify-between 
    text-left 
    border-4 rounded-full border-[#FA8128]
  "
          >
            <div className="flex flex-col gap-1 mb-3 md:mb-0">
              <div className="steps text-[16px] md:text-[20px] leading-tight">
                Step 1
              </div>
              <div className="steps-content text-[#63C5DA] text-[22px] md:text-[35px] leading-[1.2] md:leading-normal">
                Book Luggage <span className="text-[#FA8128]">Storage</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 mb-3 md:mb-0">
              <div className="steps text-[16px] md:text-[20px] leading-tight">
                Step 2
              </div>
              <div className="steps-content text-[#63C5DA] text-[22px] md:text-[35px] leading-[1.2] md:leading-normal">
                Drop Your <span className="text-[#FA8128]">Luggage</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="steps text-[16px] md:text-[20px] leading-tight">
                Step 3
              </div>
              <div className="steps-content text-[#63C5DA] text-[22px] md:text-[35px] leading-[1.2] md:leading-normal">
                Enjoy Your <span className="text-[#FA8128]">Stay</span>
              </div>
            </div>
          </div>

          {/* Luggage-man image - hidden on mobile */}
          <div className="luggage-man h-[400px] md:h-[500px] w-[20px] z-50 translate-x-[370px] translate-y-10 absolute hidden md:block"></div>
        </div>

        <div className="section-3 mt-40">
          <div className="text-[#63C5DA] ml-52 text-[30px] md:text-[45px] font-bold text-center">
            We have your back for the{" "}
            <span className="text-[#FA8128] ml-3  md:ml-1">Luggage</span>
          </div>
          <div className="relative">
            <div className="w-[90%] md:w-[50%] mx-auto md:ml-[4%] mt-10 md:mt-28 p-5 md:p-10 md:pr-20 border-2 border-[#63C5DA] md:border-l-0">
              <div className="text-[32px] md:text-[50px] font-bold text-end leading-tight">
                <div className="text-[#FA8128]">Services starting</div>
                <div className="text-[#FA8128]">from just</div>
                <div className="text-[#63C5DA]">€2.5</div>
              </div>

              <div className="text-[#FA8128] text-end text-[18px] md:text-[22px] leading-tight mt-4 md:mt-5">
                <div>Available 24/7</div>
                <div>Cheaper and Safe</div>
              </div>
            </div>

            {/* ✅ Hidden on mobile only */}
            <div className="suitcase z-10 absolute lg:translate-x-[176%] -translate-y-[80%] hidden md:block"></div>
          </div>
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
          <div className="luggage z-10 md:absolute md:translate-x-[1050px] md:-translate-y-[580px] mt-10 md:mt-0 mx-auto md:mx-0 hidden md:block"></div>
        </div>

        <div className="section-6 mt-25 ml-[7%] mr-[7%] md:ml-[7%] md:mr-[7%]">
          <div className="text-[#FA8128] text-[25px] md:text-[45px] font-bold">
            Accessible Everywhere!
          </div>
          <div className="text-[#63C5DA] text-[30px] md:text-[45px]">
            Safe and reliable luggage storage{" "}
            <span className="text-[#FA8128] font-medium">WORLDWIDE.</span>
          </div>

          {/* Set height and width for the map */}
          <div className="mt-8 w-full max-w-[90vw] h-[300px] md:h-[500px] relative">
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={center}
                zoom={14}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                {/* Optional: Add a Marker at user's location */}
                <></>
              </GoogleMap>
            )}
          </div>
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

        <div className="section-8 mt-40 flex items-center justify-center gap-4 px-4">
          <Slider {...settings} className="w-full md:w-[80%] px-4 md:px-10">
            {imgArr.map((d, index) => (
              <div
                key={index}
                className="tower p-4 rounded-lg flex justify-center"
              >
                <img
                  src={d.img}
                  alt={`Tower ${index}`}
                  className="w-[300px] h-[200px] rounded-lg max-w-full"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </Slider>
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

export default LandingPage;
