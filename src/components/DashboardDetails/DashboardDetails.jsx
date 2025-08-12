import React, { useState, useEffect } from "react";
import "../../styles/DashboardDetails.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ProductionApi, LocalApi } from "../../../utills";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
const DashboardDetails = () => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/landingpage");
  };
  const menuItems = [
    "Details",
    "Parameters",
    "Availabilities",
    "Bank Account",
    "Income",
  ];
  const [detailsAdded, isDetailsAdded] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Details");

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };
  const [isFristEditClickled, setIsFirstEditClicked] = useState(false);
  const handleFirstEditClick = () => {
    setIsFirstEditClicked(!isFristEditClickled);
  };
  const handleSave1 = () => {
    setIsFirstEditClicked(false);
  };

  const handleCancel1 = () => {
    setIsFirstEditClicked(false);
  };

  const [isYes3Clicked, setIsYes3Clicked] = useState(false);
  const handleYes3 = () => {
    setIsYes3Clicked(!isYes3Clicked);
  };
  const handleSave3 = () => {
    setIsYes3Clicked(false);
  };
  const handleCancel3 = () => {
    setIsYes3Clicked(false);
  };

  // Storage

  const [selected, setSelected] = useState();
  const [storageEdit, setStorageEdit] = useState(false);
  const [storageCapacity, setStorageCapacity] = useState("0");
  const [prevDetails, setPrevDetails] = useState(true);

  //  bank details

  const [isBankClicked, setIsBankClicked] = useState(false);
  const handleBankClick = () => {
    setIsBankClicked(!isBankClicked);
  };
  const handleBankSave = () => {
    setIsBankClicked(false);
  };
  const handleBankCancel = () => {
    setIsBankClicked(false);
  };
  const [activeButtons, setActiveButtons] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const handleClick = (button) => {
    setActiveButtons((prev) => {
      if (prev.includes(button)) {
        // If button is already selected, remove it
        return prev.filter((item) => item !== button);
      } else {
        // Otherwise, add the button to the active buttons
        return [...prev, button];
      }
    });
  };
  const services = activeButtons;
  // Api call
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [wifi, setWifi] = useState(false);
  const [capacity, setCapacity] = useState("0");
  const [limited, setLimited] = useState();
  const [type, setType] = useState("airport storage");
  const [timing, setTiming] = useState("9AM - 9PM");
  console.log(
    name,
    email,
    address,
    phone,
    services,
    capacity,
    wifi,
    typeof limited,
    typeof type,
    typeof timing,
    typeof activeButtons
  );

const [bankDetails, setBankDetails] = useState({
  holderName: "",
  email: "",
  accountNumber: "",
  address: "",
  postCode: "",
  city: "",
  stateCode: "",
  ifscCode: "",
  bankName: "",
  branchName: "",
});

// Validation for basic details (for button styling)
const isBasicDetailsValid =
  name.trim() !== "" &&
  email.trim() !== "" &&
  address.trim() !== "" &&
  phone.trim() !== "";

// Full validation including bank details (for API call)
const isDetailsValid =
  name.trim() !== "" &&
  email.trim() !== "" &&
  address.trim() !== "" &&
  phone.trim() !== "" &&
  bankDetails.holderName.trim() !== "" &&
  bankDetails.email.trim() !== "" &&
  bankDetails.accountNumber.trim() !== "" &&
  bankDetails.address.trim() !== "" &&
  bankDetails.postCode.trim() !== "" &&
  bankDetails.city.trim() !== "" &&
  bankDetails.stateCode.trim() !== "" ;

  const handleDetailsAPI = async () => {
   // Check if all required fields are filled
   if (!isDetailsValid) {
     toast.error("Please fill out all required fields including bank details.");
     return;
   }

    try {
      const response = await axios.post(
        `${ProductionApi}/facility/register`,
        {
          name,
          email,
          address,
          phone,
          services: {
            wifi,
          },
          capacity,
          limited,
          type,
          timing,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Registered Successfully:", response.data);
   
        toast.success("Details added");
        navigate("/landingpage");
   
      // Optional: Log form data if response status is 400
    } catch (error) {
      console.error("Error while registering facility:", error);
      toast.error("Failed to add details");
    }
  };
  const [details, setDetails] = useState(true);
  const [facilities, setFacilities] = useState([]);



  const handleFacilityApi = async () => {
   
    try {
      const response = await axios.get(
        `${ProductionApi}/facility/`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Facility Data:", response.data.data);
      setFacilities(response.data.data);
    } catch (error) {
      console.error("Error fetching facility data:", error);
    }
    try {
      const response = await axios.get(
        `${ProductionApi}/user/addBankAccount`,
        {
          accountNumber: "123456789012",
          bankName: "State Bank of India",
          ifscCode: "SBIN0001234",
          accountHolderName: "John Doe",
          holderAddress: "123 Main Street",
          holderPostalCode: "110001",
          holderCity: "New Delhi",
          holderStateCode: "DL",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Facility Data:", response.data.data);
      setFacilities(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFacilityApi();
    console.log("Token in DashboardDetails:", token);
  }, []);
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
              <select className="appearance-none border-2 border-[#FA8128] rounded-lg p-2 pr-8 bg-white text-xl">
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
              <GiHamburgerMenu
                size={35}
                color="#FA8128"
                className="cursor-pointer"
                onClick={() => {
                  navigate("/partneroverview");
                }}
              />
            </div>
          </div>
        </div>

        {/* MAIN SECTION */}
        <div className="main-section flex flex-col lg:flex-row w-full mt-5 gap-4">
          {/* LEFT MENU */}
          <div className="left-section w-full lg:w-[20%] px-8 pt-3 pb-5 flex flex-col gap-8 border-t-4 border-r-0 lg:border-r-4 border-b-4 border-[#63C5DA] shadow-[4px_4px_10px_#FA8128]">
            <div className="file flex-col">
              <div className="heading-left text-[32px] md:text-[50px] text-[#63C5DA] underline font-bold">
                My Ads
              </div>
            </div>
            <div className="flex flex-col gap-5 text-[20px] md:text-[22px] text-center font-bold">
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
           <button
  onClick={handleDetailsAPI}
  disabled={!isDetailsValid}
  className={`px-3 py-3 rounded-3xl cursor-pointer transition ${
    isDetailsValid
      ? "bg-[#FA8128] text-white"
      : "bg-gray-400 text-white cursor-not-allowed"
  }`}
>
  Save
</button>
          </div>

          {/* RIGHT SECTION */}
          <div className="right-section w-full lg:w-[80%]">
            {/* DETAILS SECTION */}
            {selectedItem === "Details" && (
              <>
                {detailsAdded ? (
                  <div className="details-div flex flex-col justify-between px-5 md:px-10 pt-10 text-[20px] md:text-[24px] h-full   font-medium">
                    <div className="row-1 flex">
                      <div className="row-1-detail flex-[30%]">
                        Facility Name
                      </div>
                      <input
                        className="content-input flex-[35%] border-2 border-[#63C5DA] rounded px-2 py-2 w-full max-w-[400px] text-[18px] md:text-[20px] "
                        placeholder="Lorem ipsum"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                      />
                      <div
                        className="edit text-[#63C5DA] flex-[25%] text-right"
                        onClick={() => handleFirstEditClick}
                      >
                        <div className="edit text-[#63C5DA] flex-[25%] text-right">
                          {isFristEditClickled ? (
                            <div className="space-x-2">
                              <button
                                className="bg-[#FA8128] text-white px-3 py-1  rounded-3xl"
                                onClick={handleSave1}
                              >
                                Save
                              </button>
                              <button
                                className="bg-[#FA8128]  text-white px-3 py-1 rounded-3xl  "
                                onClick={handleCancel1}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <span></span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row-2 flex">
                      <div className="row-2-detail flex-[30%]">
                        Contact Information of the Partner
                      </div>
                    </div>
                    <div className="row-3 flex ">
                      <div className="row-3-detail flex-[30%]">
                        Email Address
                      </div>
                      <input
                        className="content-input flex-[35%] border-2 items-start border-[#63C5DA] rounded px-2 py-2 w-full max-w-[400px] text-[18px] md:text-[20px] focus:border-[#63C5DA] focus:ring-0"
                        placeholder="Shuddjdsi26@gmail.com"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                      />
                      <div className="flex-[25%]"></div>
                    </div>
                    <div className="row-4 flex ">
                      <div className="row-4-detail flex-[30%]">Telephone</div>
                      <input
                        className="content-input flex-[35%] border-2 border-[#63C5DA] rounded px-2 py-2 w-full max-w-[400px] text-[18px] md:text-[20px]"
                        placeholder="+99 873629273839"
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone}
                      />
                      <div className="flex-[25%]"></div>
                    </div>
                    <div className="row-5 flex">
                      <div className="row-5-detail flex-[30%]">
                        Type of Luggage Storage
                      </div>
                      <select
                        className="content-input border-2 flex-[35%] border-[#63C5DA] rounded px-2 py-2 w-full max-w-[400px] text-[18px] md:text-[20px]"
                        onChange={(e) => setType(e.target.value)}
                        value={type} // Correct event handler
                      >
                        <option value="airport-luggage">Airport Luggage</option>
                      </select>

                      <div className="edit text-white flex-[25%] text-right">
                        Edit
                      </div>
                    </div>
                    <div className="row-6 flex">
                      <div className="row-6-detail flex-[30%]">Address</div>
                      <input
                        className="content-input flex-[35%] border-2 border-[#63C5DA] rounded px-2 py-2 w-full max-w-[400px] text-[18px] md:text-[20px]"
                        placeholder="wolfer dog streetrnckclc"
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                      />
                      <div className="edit text-white flex-[25%] text-right">
                        Edit
                      </div>
                    </div>
                    <div className="row-7 flex">
                      <div className="content flex-[30%]">
                        Bagpacker Services
                      </div>
                      <div className="flex flex-[35%] gap-2">
                        {["wifi", "restroom", "CCtv"].map((label) => (
                          <button
                            key={label}
                            className={`border-2 border-[#63C5DA] rounded flex-1 px-1 py-1 capitalize ${
                              activeButtons.includes(label)
                                ? "bg-orange-500 text-white"
                                : "bg-white text-[#FA8128]"
                            }`}
                            value={wifi}
                            onClick={() => {
                              setActiveButtons((prev) =>
                                prev.includes(label)
                                  ? prev.filter((item) => item !== label)
                                  : [...prev, label]
                              );
                              // Set wifi flag separately if needed
                              if (label === "wifi") {
                                setWifi((prev) => !prev);
                              }
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      <div className="content-edit text-white flex-[25%] text-right">
                        Edit
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {prevDetails ? (
                      <div className="bottom-div w-full max-h-[65vh] px-4 md:px-10 overflow-auto">
                        {facilities.map((facility) => (
                          <div className="reviews-div border-2 border-[#63C5DA] p-5 mb-2">
                            <div className="reviews-top flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-gray-200   gap-2">
                              <div className="name font-semibold text-lg">
                                {facility.name}
                              </div>
                              <div className="booking-id text-sm md:text-base">
                                Facility : {facility._id}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <div>
                                <div className="address   text-sm md:text-base">
                                  {facility.address}
                                </div>
                              </div>

                              <div className="reviews-bottom mt-4     items-start lg:items-center">
                                <button className="bg-[#FA8128] text-white px-4 py-2 rounded-3xl self-start md:self-auto">
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div
                          className="bank-acc p-3 border-[#63C5DA]   mt-10 ml-10 border-2 w-fit flex items-center gap-2 cursor-pointer"
                          onClick={() => isDetailsAdded(true)}
                        >
                          Add New Facility
                          <AiOutlinePlusCircle className="text-2xl" />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="bank-acc p-3 border-[#63C5DA]   mt-10 ml-10 border-2 w-fit flex items-center gap-2 cursor-pointer"
                        onClick={() => isDetailsAdded(true)}
                      >
                        Add New Facility
                        <AiOutlinePlusCircle className="text-2xl" />
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* PARAMETERS SECTION */}
            {selectedItem === "Parameters" && (
              <div className="parameters-div px-5 md:px-10 pt-10 text-[20px] md:text-[24px] flex flex-col gap-8 h-full text-[#FA8128] font-bold">
                <div className="params-right-item1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="storage">
                    <div className="storage-capacity">Storage Capacity</div>
                    <div className="storage-capacity-text text-[#63C5DA] text-[18px] md:text-[20px]">
                      Storage capacity allows to limit the number of luggage
                      kept daily.
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {storageEdit ? (
                      <input
                        type="number"
                        placeholder="0"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="border-2 border-[#63C5DA] px-3 py-2 rounded text-[#FA8128]"
                      />
                    ) : (
                      <button
                        onClick={() => setStorageEdit(true)}
                        className="border-2 border-[#63C5DA] bg-white text-[#FA8128] px-3 py-2"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                <div className="param-right-item2 flex flex-col justify-between items-start">
                  <div className="param-right-item2  ">
                    <div className="Limited-storage">Limited Storage?</div>

                    <div className="options-div items-center flex w-full justify-between gap-[700px]">
                      <div className="yes-no-options flex gap-2">
                        <button
                          className={`border-[#63C5DA] border-2 px-3 py-2 rounded ${
                            selected === true
                              ? "bg-[#FA8128] text-white"
                              : "bg-white text-[#FA8128]"
                          }`}
                          onClick={() => {
                            setLimited(true);
                            setSelected(true);
                          }}
                        >
                          Yes
                        </button>

                        <button
                          className={`border-[#63C5DA] border-2 px-3 py-2 rounded ${
                            selected === false
                              ? "bg-[#FA8128] text-white"
                              : "bg-white text-[#FA8128]"
                          }`}
                          onClick={() => {
                            setLimited(false);
                            setSelected(false);
                          }}
                        >
                          No
                        </button>
                      </div>

                      {/* Right Side - Save/Cancel */}

                      {storageEdit && (
                        <div className="save-cancel-options flex gap-2">
                          <div className="space-x-2">
                            <button
                              className="bg-[#FA8128] text-white px-3 py-1  rounded-3xl"
                              onClick={() => setStorageEdit(false)}
                            >
                              Save
                            </button>
                            <button
                              className="bg-[#FA8128]  text-white px-3 py-1 rounded-3xl  "
                              onClick={() => setStorageEdit(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="params-right-item3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="storage">
                    <div className="change-email">Alternate Email Address</div>
                    <div className="storage-capacity-text text-[#63C5DA] text-[18px] md:text-[20px]">
                      Receive a copy of reservation emails on an additional
                      email address.
                    </div>
                    <div className="add-email">
                      <input
                        className="content-input border-2 border-[#63C5DA] rounded px-2 py-2 w-full max-w-[400px] text-[18px] md:text-[20px]"
                        placeholder="enter email"
                      />
                    </div>
                  </div>
                  <div className="edit text-[#63C5DA]">Edit</div>
                </div>
              </div>
            )}

            {/* AVAILABILITIES SECTION */}
            {selectedItem === "Availabilities" && (
              <div className="available-div px-5 md:px-10 pt-10 text-[20px] md:text-[24px] flex flex-col justify-between h-full text-[#FA8128] font-bold">
                <div className="available-right-item1">
                  <div className="available-right-item1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="opening-hours">
                      <div className="opening-hours-text">Opening Hours</div>
                      <div className="opening-hours-text text-[#63C5DA] text-[18px] md:text-[20px]">
                        Open 24 hours a day and 7 days a week
                      </div>
                    </div>
                  </div>

                  {isYes3Clicked ? (
                    <div className="options-div flex w-full  gap-96 items-center">
                      {/* Left Side - Yes/No */}
                      <div className="yes-no-options flex   gap-2">
                        <button className="border-[#63C5DA] border-2 text-white bg-[#FA8128] px-3 py-2">
                          Yes
                        </button>
                        <button
                          className="border-[#63C5DA] border-2 text-white bg-[#FA8128] px-3 py-2"
                          onClick={handleCancel3}
                        >
                          No
                        </button>
                      </div>

                      {/* Right Side - Save/Cancel */}
                      <div className="yes-no-options flex gap-2">
                        <button
                          className="bg-[#FA8128] text-white px-3 py-1  rounded-3xl"
                          onClick={handleSave3}
                        >
                          Save
                        </button>
                        <button
                          className="bg-[#FA8128] text-white px-3 py-1  rounded-3xl"
                          onClick={handleCancel3}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="border-[#63C5DA] border-2 text-white bg-[#FA8128] px-3 py-2"
                      onClick={handleYes3}
                    >
                      Yes
                    </button>
                  )}

                  {isYes3Clicked && (
                    <div className="flex flex-col gap-1 mt-3 text-black">
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => (
                        <div
                          key={day}
                          className="flex justify-between items-center text-[18px]"
                        >
                          <div className="">Are you open on {day}s?</div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2   rounded-full peer peer-checked:bg-[#FA8128] transition-all duration-300"></div>
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-full"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="">
                  <div className="available-right-item2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="closing">
                      <div className="closing-hours">Closing Hours</div>
                      <div className="storage-capacity-text text-[#63C5DA] text-[18px] md:text-[20px]">
                        Indicate your closing periods to avoid receiving
                        reservations
                      </div>
                    </div>
                  </div>
                  <div className="available-right-item3 flex flex-col gap-2 text-[18px] md:text-[20px] text-black font-medium">
                    <div className="storage-capacity-text  ">
                      From Apr 18, 2025 to Apr 18, 2025 - Closed
                    </div>
                    <div className="storage-capacity-text  ">
                      From Jan 1, 2026 to Jan 1, 2026 - Closed
                    </div>
                    <div className="storage-capacity-text ">
                      From Jan 26, 2026 to Jan 26, 2026 - Closed
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BANK ACCOUNT SECTION */}
            {selectedItem === "Bank Account" && (
              <div className="bank-div px-5 md:px-10 pt-10 text-[20px] md:text-[24px] flex flex-col gap-8 h-full text-[#FA8128] font-bold">
                <div className="bank-acc">Bank Account</div>
                {!isBankClicked ? (
                  <div
                    className="bank-acc p-3 border-[#63C5DA] border-2 w-fit flex items-center gap-2 cursor-pointer"
                    onClick={handleBankClick}
                  >
                    Add payment method
                    <AiOutlinePlusCircle className="text-2xl" />
                  </div>
                ) : (
                  <div>
                    <div className="bank-yes-div flex flex-col gap-4 text-black font-medium">
                      <div className="bank-row-1 flex flex-col md:flex-row gap-2">
                        <div className="bank-row-1-detail md:w-1/2">
                          Account Holder Name
                        </div>
                        <input
                          value={bankDetails.holderName}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              holderName: e.target.value,
                            })
                          }
                          className="content-input border-2 border-[#63C5DA] rounded px-2 py-2 w-full text-[18px] md:text-[20px]"
                          placeholder="Lorem ipsum"
                        />
                      </div>

                      <div className="bank-row-2 flex flex-col md:flex-row gap-2">
                        <div className="bank-row-2-detail md:w-1/2">Email</div>
                        <input
                          value={bankDetails.email}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              email: e.target.value,
                            })
                          }
                          className="content-input border-2 border-[#63C5DA] rounded px-2 py-2 w-full text-[18px] md:text-[20px]"
                          placeholder="Lorem ipsum"
                        />
                      </div>

                      <div className="bank-row-4 flex flex-col md:flex-row gap-2">
                        <div className="bank-row-4-detail md:w-1/2">
                          Account Number
                        </div>
                        <input
                          value={bankDetails.accountNumber}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              accountNumber: e.target.value,
                            })
                          }
                          className="content-input border-2 border-[#63C5DA] rounded px-2 py-2 w-full text-[18px] md:text-[20px]"
                          placeholder="Lorem ipsum"
                        />
                      </div>

                      <div className="bank-row-5 flex flex-col md:flex-row gap-2">
                        <div className="bank-row-5-detail md:w-1/2">
                          Account Holder's Address
                        </div>
                        <input
                          value={bankDetails.address}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              address: e.target.value,
                            })
                          }
                          className="content-input border-2 border-[#63C5DA] rounded px-2 py-2 w-full text-[18px] md:text-[20px]"
                          placeholder="Lorem ipsum"
                        />
                      </div>

                      <div className="bank-row-6 flex flex-col md:flex-row gap-2">
                        <div className="bank-row-6-detail md:w-1/2">
                          Account Holder's Post Code
                        </div>
                        <input
                          value={bankDetails.postCode}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              postCode: e.target.value,
                            })
                          }
                          className="content-input border-2 border-[#63C5DA] rounded px-2 py-2 w-full text-[18px] md:text-[20px]"
                          placeholder="Lorem ipsum"
                        />
                      </div>

                      <div className="bank-row-7 flex flex-col md:flex-row gap-2">
                        <div className="bank-row-7-detail md:w-1/2">
                          Account Holder's Town/City
                        </div>
                        <input
                          value={bankDetails.city}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              city: e.target.value,
                            })
                          }
                          className="content-input border-2 border-[#63C5DA] rounded px-2 py-2 w-full text-[18px] md:text-[20px]"
                          placeholder="Lorem ipsum"
                        />
                      </div>

                      <div className="bank-row-8 flex flex-col md:flex-row gap-2">
                        <div className="bank-row-8-detail md:w-1/2">
                          State Code
                        </div>
                        <input
                          value={bankDetails.stateCode}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              stateCode: e.target.value,
                            })
                          }
                          className="content-input border-2 border-[#63C5DA] rounded px-2 py-2 w-full text-[18px] md:text-[20px]"
                          placeholder="Lorem ipsum"
                        />
                      </div>

                      <div className="bank-row-9 flex flex-col sm:flex-row gap-4 mt-4"></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* INCOME SECTION */}
            {selectedItem === "Income" && (
              <div className="income-div px-5 md:px-10 pt-10 text-[20px] md:text-[24px] flex flex-col gap-8 h-full text-[#FA8128] font-bold">
                <div className="income-right-item1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="total">Total Earnings</div>
                  <div className="opening-hours-text text-[#63C5DA] text-[18px] md:text-[20px] flex">
                    <div className="amount px-3 py-1 border border-[#63C5DA] text-black gont-medium">
                      100000
                    </div>
                    <div className="currency px-5 py-1 bg-[#FA8128] text-white">
                      EUR
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      className="appearance-none border-2 border-[#FA8128] rounded-lg px-2 pr-10 bg-white font-light text-black"
                      defaultValue=""
                    >
                      <option value="" disabled className="">
                        Sort by
                      </option>
                      <option value="month">Month</option>
                      <option value="earning">Earning</option>
                      <option value="status">Status</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <img src="/Dropdown.svg" alt="" className="w-7 h-7" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between font-light flex-wrap gap-6 text-black">
                  <div>
                    <div className="font-bold text-[#FA8128]">Month</div>
                    <hr className="border-b border-[#63C5DA] my-1 " />
                    <div>January</div>
                    <div>February</div>
                    <div>March</div>
                    <div>April</div>
                    <div>May</div>
                    <div>June</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#FA8128]">Earning</div>
                    <hr className="border-b border-[#63C5DA] my-1" />
                    <div>€10,000</div>
                    <div>€8,500</div>
                    <div>€12,200</div>
                    <div>€9,800</div>
                    <div>€11,300</div>
                    <div>€13,700</div>
                  </div>
                  <div className="text-black">
                    <div className="font-bold text-[#FA8128]">Status</div>
                    <hr className="border-b border-[#63C5DA] my-1" />
                    <div>Paid</div>
                    <div>Pending</div>
                    <div>Failed</div>
                    <div>Paid</div>
                    <div>Pending</div>
                    <div>Paid</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardDetails;
