import React, { useState , useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const UserBookings = () => {
  const [isbooking, setIsBooking] = useState(false);
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/landingpage");
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
    <>
      <div className="page-details p-2 sm:px-10">
        {/* NAVBAR */}
        <div className="navbar flex flex-row flex-wrap items-center justify-between p-2 m-4 text-xl sm:text-2xl gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
            <div className="logo-bag"></div>
            <div className="logo"></div>
          </div>
          <div className="nav-links flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div className="relative w-full sm:w-40">
              <select className="appearance-none border-2 border-[#FA8128] rounded-lg p-2 pr-10 bg-white w-full">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <img src="/Dropdown.svg" alt="" className="w-5 h-5" />
              </div>
            </div>
            <div className="burger p-2">
              <GiHamburgerMenu size={30} className="text-[#FA8128] cursor-pointer" onClick={()=>{navigate("/useroverview")}} />
            </div>
          </div>
        </div>

        {/* TOP SECTION */}
        <div className="top-div w-full flex flex-col lg:flex-row flex-wrap gap-4 items-start lg:items-center justify-between p-4 pl-10 pr-10">
          <div className="text-div font-bold">
            <div className="text-div-1 text-[#FA8128] text-4xl sm:text-5xl mb-2">
              Your Bookings
            </div>
            {isbooking ? (
              <div className="text-div-2 text-2xl sm:text-3xl text-[#63C5DA]"></div>
            ) : (
              <div className="text-div-2 text-2xl sm:text-3xl text-[#63C5DA]">
                No Upcoming Reservations
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative w-full sm:w-40">
              <select className="appearance-none w-full border-2 border-[#FA8128] rounded-lg p-2 pr-10 bg-white text-base">
                <option value="en">Upcoming</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <img src="/Dropdown.svg" alt="Dropdown" className="w-5 h-5" />
              </div>
            </div>

            <div className="relative w-full sm:w-40">
              <select className="appearance-none w-full border-2 border-[#FA8128] rounded-lg p-2 pr-10 bg-white text-base">
                <option value="en">Date</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <img src="/Dropdown.svg" alt="Dropdown" className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="bottom-div  w-full pl-4 sm:pl-10 pr-4 sm:pr-10 overflow-auto">
          {isbooking ? (
            <div className="reviews-div flex border-2 border-[#63C5DA] p-5 space-y-4">
              <div className="mr-5 ">
                <img
                  src="/BookingPhoto.svg"
                  className="h-auto w-[90%] object-cover shadow-[-8px_-8px_10px_#FA8128,-8px_8px_10px_#FA8128]"
                />
              </div>
              <div className="flex flex-col justify-between w-full">
                <div>
                  <div className="luggage-name text-[#FA8128] font-medium text-lg">
                    Luggage 001
                  </div>
                  <div className="address text-[#FA8128] text-sm md:text-base">
                    Queens Maritoon, Melbourne
                  </div>
                </div>
                <div>
                  <div className="reviews-bottom mt-4 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="drop border-2 border-[#63C5DA] px-4 py-2 rounded-md text-sm text-[#FA8128] shadow-sm">
                        drop off date
                      </div>
                      <div className="pickup border-2 border-[#63C5DA] px-4 py-2 rounded-md text-sm text-[#FA8128] shadow-sm">
                        pickup date
                      </div>
                    </div>
                    <button className="bg-[#FA8128] text-white px-4 py-2 rounded-3xl self-start md:self-auto">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bottom-div w-full h-full flex justify-center items-center pl-4 sm:pl-10 pr-4 sm:pr-10 overflow-auto">
              <img
                src="Reservation.svg"
                alt="No Bookings"
                className="w-[45%] h-[50%] object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserBookings;
