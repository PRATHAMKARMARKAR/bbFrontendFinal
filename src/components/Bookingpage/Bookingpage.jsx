import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosSearch, IoIosArrowDown } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/Bookingpage.css";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { GoogleApi } from "../../../utills";
import { ProductionApi, LocalApi } from "../../../utills";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { load } from "@cashfreepayments/cashfree-js";
import { v4 as uuidv4 } from "uuid";

const Bookingpage = () => {
  // --- State and Redux Hooks ---
  const location = useLocation();
  const query = location.state?.query || "";
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const facilityIdFromRedux = useSelector((state) => state.facilityId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State variables
  const [sfdata, setsfdata] = useState([]);
  const [fcoord, setfcoord] = useState([]);
  const [distance1, setDistance1] = useState([]);
  const [fDuration, setfDuration] = useState("");
  const [fAddress, setfAddress] = useState("");
  const [fTiming, setfTiming] = useState("");
  const [center, setCenter] = useState({ lat: 41.3851, lng: 2.1734 });
  const [markerPositions, setMarkerPositions] = useState([]);
  const [destination, setDestination] = useState(query);
  const [numberofbag, setNumberofBag] = useState(0);
  const [dropOffDate, setDropOffDate] = useState(new Date());
  const [pickUpDate, setPickUpDate] = useState(new Date());
  const [showDropOffCalendar, setShowDropOffCalendar] = useState(false);
  const [showPickUpCalendar, setShowPickUpCalendar] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [orderId, setOrderId] = useState(uuidv4());
  const [isverified, setisverified] = useState(false);
  const [facilityName, setfacilityName] = useState("");

  // Refs for component logic
  const [map, setMap] = useState(null);
  const cashfreeRef = useRef(null);
  const initialSearchPerformedRef = useRef(false);
  const dropOffCalendarRef = useRef(null); // Ref for Drop-off calendar
  const pickUpCalendarRef = useRef(null); // Ref for Pick-up calendar

  // --- Functions and Callbacks ---
  const handleLogoClick = () => {
    navigate("/landingpage");
    if (!isLoggedIn) {
      dispatch({ type: "login/login" });
    }
  };

  const containerStyle = {
    width: "100%",
    height:
      window.innerWidth < 768
        ? "250px"
        : window.innerWidth < 1024
        ? "400px"
        : "700px",
    maxWidth: "100vw",
    maxHeight: "80vh",
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GoogleApi,
  });

  const handleSearchDestination = useCallback(
    async (searchQuery = destination) => {
      if (!searchQuery) return;

      if (initialSearchPerformedRef.current && searchQuery === query) {
        return;
      }

      initialSearchPerformedRef.current = true;

      try {
        const geoRes = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            searchQuery
          )}&key=${GoogleApi}`
        );
        const geoData = await geoRes.json();

        if (geoData.results.length) {
          const location = geoData.results[0].geometry.location;
          setCenter(location);

          const facilityRes = await axios.post(
            `${ProductionApi}/map/facilitiesBySearch`,
            { userCoordinates: [location.lng, location.lat] },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const fetchedFacilities = facilityRes.data.message;
          setFacilities(fetchedFacilities);

          const coordsArray = fetchedFacilities
            .map((facility) => facility.geolocation?.coordinates)
            .filter(Boolean);

          setfcoord(coordsArray);
          const newMarkers = coordsArray.map((coords) => ({
            lat: coords[1],
            lng: coords[0],
          }));
          setMarkerPositions(newMarkers);

          for (const coords of coordsArray) {
            try {
              const distanceRes = await axios.post(
                `${ProductionApi}/map/facilitiesDistanceTime`,
                {
                  userCoordinates: [location.lng, location.lat],
                  facilityCoordinates: coords,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setDistance1(distanceRes.data);
              setfDuration(distanceRes.data.message.duration);
            } catch (error) {
              console.error("Error fetching distance/time:", error);
            }
          }

          if (map && newMarkers.length > 0) {
            map.panTo(newMarkers[0]);
            map.setZoom(14);
          }
        } else {
          toast.warn("Location not found.");
        }
      } catch (err) {
        console.error("Search error:", err);
        toast.error("Failed to search for facilities.");
      }
    },
    [destination, map, token, query]
  );

  const onLoad = useCallback(
    (mapInstance) => {
      setMap(mapInstance);
      const bounds = new window.google.maps.LatLngBounds(center);
      mapInstance.fitBounds(bounds);
    },
    [center]
  );

  const onUnmount = useCallback(() => setMap(null), []);

  const formatDate = (date) =>
    date instanceof Date ? date.toISOString().split("T")[0] : "";

  const handleBookNow = async (facilityId) => {
    dispatch({ type: "facilityId/setFacilityId", payload: facilityId });
    try {
      const response = await axios.get(
        `${ProductionApi}/facility/get?id=${facilityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setsfdata(response.data);
      setfAddress(response.data.data.address);
      setfTiming(response.data.data.timing);
      setfacilityName(response.data.data.name);
    } catch (error) {
      console.error("Error fetching facility details:", error);
      toast.error("Error fetching facility details.");
    }
  };

  const name = useSelector((state) => state.details.name);
  const phoneNo = useSelector((state) => state.details.phoneNo);
  const email = useSelector((state) => state.details.email);

  const getSessionId = async () => {
    try {
      const res = await axios.post(
        `${ProductionApi}/payment/create`,
        {
          orderId: orderId,
          orderAmount: 2.5,
          customerEmail: email,
          customerPhone: phoneNo,
          customerName: name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data && res.data.data.payment_session_id) {
        setOrderId(res.data.order_id);
        return res.data.data.payment_session_id;
      }
    } catch (error) {
      console.error("Error getting session ID:", error);
      toast.error("Please update your profile information before booking.");
      navigate("/profile");
    }
    return null;
  };

  const verifyPayment = async () => {
    try {
      const res = await axios.post(
        `${ProductionApi}/payment/verify?orderId=${orderId}`
      );
      if (res?.data) {
        toast.success("Payment verified successfully!");
        setisverified(true);
        return true;
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Payment verification failed.");
    }
    return false;
  };

  const handleMakeBookingApi = async () => {
    try {
      const sessionId = await getSessionId();

      if (!cashfreeRef.current) {
        toast.error("Cashfree SDK not ready.");
        return;
      }

      if (!sessionId) {
        toast.error("Invalid payment session ID.");
        return;
      }

      await cashfreeRef.current.checkout({
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      });

      const paymentVerified = await verifyPayment();
      if (paymentVerified) {
        const response = await axios.post(
          `${ProductionApi}/booking/`,
          {
            area: facilityName,
            dropIn: dropOffDate,
            pickup: pickUpDate,
            luggageType: "Bag",
            facilityId: facilityIdFromRedux.facilityId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Booking successful:", response.data);
        toast.success("Booking successful!");
        navigate("/landingpage");
      }
    } catch (err) {
      console.error("Booking process error:", err);
      toast.error("An error occurred during the booking process.");
    }
  };

  useEffect(() => {
    if (query && !initialSearchPerformedRef.current) {
      handleSearchDestination(query);
    }
  }, [query, handleSearchDestination]);

  useEffect(() => {
    const initCashfree = async () => {
      try {
        const sdk = await load({ mode: "sandbox" });
        cashfreeRef.current = sdk;
        console.log("✅ Cashfree SDK loaded");
      } catch (e) {
        console.error("❌ SDK Load Failed:", e);
      }
    };
    initCashfree();
  }, []);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(({ coords }) => {
      const { latitude, longitude } = coords;
      setCenter({ lng: longitude, lat: latitude });
    });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
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

  // Effect to close calendars when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropOffCalendarRef.current &&
        !dropOffCalendarRef.current.contains(event.target)
      ) {
        setShowDropOffCalendar(false);
      }
      if (
        pickUpCalendarRef.current &&
        !pickUpCalendarRef.current.contains(event.target)
      ) {
        setShowPickUpCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // --- JSX Rendering ---
  return (
    <div className="main min-h-screen w-full">
      <ToastContainer />
      {/* Navbar */}
      <div className="navbar flex flex-col lg:flex-row p-2 lg:p-4 lg:pl-16 m-2 lg:m-4 gap-2 lg:gap-4 justify-between text-lg lg:text-2xl">
        {/* Top row for mobile - Logo and hamburger */}
        <div className="flex justify-between items-center lg:contents">
          <div className="flex cursor-pointer" onClick={handleLogoClick}>
            <div className="logo-bag" />
            <div className="logo" />
          </div>
          <div className="lg:hidden">
            <GiHamburgerMenu
              size={32}
              color="#FA8128"
              onClick={() => {
                if (isLoggedIn) {
                  navigate("/useroverview");
                }
              }}
            />
          </div>
        </div>
        {/* Search and controls - stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-2 lg:gap-4 flex-1 lg:flex-none">
          {/* Destination Search */}
          <div className="relative w-full sm:w-[200px] lg:w-[300px]">
            <input
              className="border-2 rounded-4xl border-[#63C5DA] p-2 w-full text-black shadow-md pr-12 h-12 lg:h-12 text-sm lg:text-base"
              placeholder="Destination"
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                initialSearchPerformedRef.current = false;
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearchDestination()}
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
              onClick={() => handleSearchDestination()}
            >
              <IoIosSearch size={20} />
            </span>
          </div>
          {/* Date Pickers Row */}
          <div className="flex gap-2 flex-1">
            {[
              [
                "Drop-off",
                dropOffDate,
                showDropOffCalendar,
                setShowDropOffCalendar,
                setDropOffDate,
                dropOffCalendarRef,
              ],
              [
                "Pick-up",
                pickUpDate,
                showPickUpCalendar,
                setShowPickUpCalendar,
                setPickUpDate,
                pickUpCalendarRef,
              ],
            ].map(([label, date, showCal, toggleCal, updateDate, calRef]) => (
              <div className="relative flex-1" key={label}>
                <input
                  className="border-2 rounded-4xl border-[#63C5DA] p-2 w-full text-black shadow-md h-10 lg:h-12 text-sm lg:text-base"
                  placeholder={label}
                  readOnly
                  value={formatDate(date)}
                  onClick={() => toggleCal(!showCal)}
                />
                {showCal && (
                  <div className="absolute z-50 mt-1 w-[320px]" ref={calRef}>
                    <Calendar
                      onChange={(d) => {
                        const normalizedDate = new Date(
                          d.getFullYear(),
                          d.getMonth(),
                          d.getDate(),
                          12
                        );
                        updateDate(normalizedDate);
                        toggleCal(false);
                      }}
                      value={date}
                      className="text-sm w-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Bag counter and hamburger for desktop */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Bag Count */}
          <div className="box flex h-10 lg:h-12 w-[120px] lg:w-[200px] items-center justify-center text-white text-sm lg:text-base">
            <button
              onClick={() => setNumberofBag((n) => Math.max(n - 1, 0))}
              className="px-2 lg:px-3"
            >
              -
            </button>
            <span className="mx-2 lg:mx-3">{numberofbag}</span>
            <button
              onClick={() => setNumberofBag((n) => n + 1)}
              className="px-2 lg:px-3"
            >
              +
            </button>
          </div>
          {/* Desktop Hamburger */}
          <div className="hidden lg:block">
            <GiHamburgerMenu
              size={40}
              color="#FA8128"
              onClick={() => {
                if (isLoggedIn) {
                  navigate("/useroverview");
                }
              }}
            />
          </div>
        </div>
      </div>
      {/* Google Map and Facility Cards */}
      {isLoaded && (
        <div className="relative">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
             options={{
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "poi.attraction",
        stylers: [{ visibility: "on" }] // Make sure tourist attractions are visible
      },
      {
        featureType: "transit",
        stylers: [{ visibility: "on" }]
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [{ visibility: "on" }]
      },
      {
        featureType: "administrative",
        stylers: [{ visibility: "on" }]
      },
      {
        featureType: "road.local", // Targets local roads/streets
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "landscape.man_made",
        stylers: [{ visibility: "on" }]
      }
    ]
  }}
          >
            {/* Multiple Markers */}
            {markerPositions.map((pos, idx) => (
              <Marker
                key={idx}
                position={pos}
                icon={{
      url: '/LogoBag.svg ', // Replace with your image path
      scaledSize: new window.google.maps.Size(40, 40), // Adjust the size as needed
    }}
                onClick={() => {
                  setClicked(true);
                  handleBookNow(facilities[idx]._id);
                }}
              />
            ))}
          </GoogleMap>
          {/* Facility Cards Vertical List Overlay */}
          {!clicked && facilities.length > 0 && (
            <div className="absolute left-4 top-[10%] bottom-[5%] w-[350px] p-4 flex flex-col gap-4 overflow-y-auto z-10">
              {facilities.map((item, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col sm:flex-row border-2 border-[#63C5DA] rounded-xl shadow-lg p-3 lg:p-4 bg-white"
                >
                  <div className="w-full sm:w-[35%] mb-3 sm:mb-0">
                    <img
                      src="/BookingPhoto.svg"
                      alt="Storage"
                      className="h-32 w-full object-cover rounded-lg shadow-md"
                    />
                  </div>
                  <div className="w-full sm:w-[60%] flex flex-col justify-between sm:pl-4">
                    <div>
                      <div className="text-[#FA8128] text-lg lg:text-xl font-semibold">
                        {item?.name || "Storage Facility"}
                      </div>
                      <div className="text-[#FA8128] text-sm font-light">
                        {item?.address || "Unknown address"}
                      </div>
                      <div className="flex items-center mt-1">
                        {[...Array(item.rating)].map((_, i) => (
                          <img
                            key={i}
                            src="/Rating.svg"
                            alt="Star"
                            className="w-4 h-4 lg:w-5 lg:h-5"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm mt-2">
                      <div className="text-green-700">{item.timing}</div>
                    </div>
                    <button
                      className="bg-[#FA8128] text-white px-4 py-2 rounded-3xl mt-3 self-start text-sm lg:text-base"
                      onClick={async () => {
                        await handleBookNow(item._id);
                        setClicked(true);
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Facility Details Card Overlay */}
          {clicked && (
            <div className="absolute inset-0 flex justify-center items-center p-4 bg-gray-50 bg-opacity-80 backdrop-blur-sm">
              <div className="border-2 border-[#63C5DA] p-4 lg:p-6 shadow-lg bg-white transition-all hover:shadow-xl flex flex-col gap-y-4 divide-y divide-gray-300 max-w-sm lg:max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Image */}
                <div className="w-full h-32 sm:h-48 bg-gray-100 rounded overflow-hidden">
                  <img
                    src="/BookingPhoto.svg"
                    alt="Storage"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Details */}
                <div className="pt-2">
                  <div className="text-[#FA8128] text-lg lg:text-xl font-semibold">
                    {facilityName}
                  </div>
                  <div className="text-[#FA8128] text-sm font-light">
                    {fAddress || "Queens street, Melbourn"}
                  </div>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src="/Rating.svg"
                        alt="Star"
                        className="w-4 h-4 lg:w-5 lg:h-5"
                      />
                    ))}
                  </div>
                </div>
                {/* Availability */}
                <div className="pt-2 text-sm">
                  <div className="text-green-700">{fTiming}</div>
                  <div className="text-[#63C5DA]">
                    {fDuration} away from your location
                  </div>
                </div>
                {/* Facilities */}
                <div className="pt-2 flex gap-2 flex-wrap">
                  {["Wifi", "Restroom", "CCtv"].map((facility) => (
                    <button
                      key={facility}
                      className="border-2 border-[#63C5DA] rounded px-2 lg:px-3 py-1 text-[#FA8128] text-xs lg:text-sm"
                    >
                      {facility}
                    </button>
                  ))}
                </div>
                {/* Pricing */}
                <div className="pt-2 text-center">
                  <p className="text-[#FA8128] text-base lg:text-lg font-medium">
                    At 2.5 EUR per bag/day
                  </p>
                  <div className="grid grid-cols-2 gap-2 justify-center my-2">
                    {["6:30 PM", "8:30 PM", "9:30 PM", "10:00 PM"].map(
                      (time) => (
                        <button
                          key={time}
                          className="border-2 border-[#63C5DA] rounded px-2 lg:px-3 py-1 text-[#FA8128] text-xs lg:text-sm"
                        >
                          {time}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    className="bg-[#FA8128] text-white px-5 py-2 rounded-3xl mt-2 w-full sm:w-auto"
                    onClick={handleMakeBookingApi}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bookingpage;