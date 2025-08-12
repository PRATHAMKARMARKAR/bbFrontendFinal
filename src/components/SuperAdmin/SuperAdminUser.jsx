import React, { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ProductionApi } from "../../../utills.js";

const SuperAdminUser = () => {
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const navigate = useNavigate();

  // Get token and role from URL query params
  const urlToken = new URLSearchParams(window.location.search).get("token");
  const urlRole = new URLSearchParams(window.location.search).get("role");

  // Auth check (optional)
  const isLoggedIn = Boolean(urlToken);

  // Parse API response
  const parseUsers = (data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === "object" && data !== null) {
      return Object.values(data).filter(
        (item) => typeof item === "object" && item._id
      );
    }
    return [];
  };

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${ProductionApi}/user/facilities`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${urlToken}` },
      });
      console.log("Facilities API response:", res.data);
      setUsers(res.data.statusCode || []);
    } catch (err) {
      console.error("Error fetching facilities:", err);
    }
  };

  // Search users by name
  const fetchUsersByName = async () => {
    try {
      if (!searchName.trim()) {
        fetchAllUsers();
        return;
      }
      const res = await axios.get(`${ProductionApi}/user/facilitiesByName`, {
        params: { name: searchName },
        withCredentials: true,
        headers: { Authorization: `Bearer ${urlToken}` },
      });
      console.log("Search Facilities API response:", res.data);
      setUsers(parseUsers(res.data));
    } catch (err) {
      console.error("Error searching facilities:", err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="page p-2 pl-15 pr-15">
      {/* Navbar */}
      <div className="navbar flex p-2 m-4 justify-between text-2xl">
        <div className="flex">
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
                navigate(isLoggedIn ? "/partneroverview" : "/");
              }}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="top-div w-full flex flex-col lg:flex-row flex-wrap gap-4 items-start lg:items-center justify-between p-4 pl-10 pr-10">
        <div className="text-div font-bold">
          <div className="text-div-1 text-[#FA8128] text-4xl sm:text-5xl mb-2">
            Facilities
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Search Box */}
          <div className="flex items-center border-2 border-[#63C5DA] rounded-[2rem] px-4 py-2 w-[500px] text-[#FA8128] bg-white shadow-md">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchUsersByName()}
              placeholder="Search by name"
              className="flex-grow bg-transparent outline-none text-[16px] sm:text-[18px] md:text-[20px]"
            />
            <img
              src="/Search.svg"
              alt="Search"
              className="w-5 h-5 ml-2 cursor-pointer"
              onClick={fetchUsersByName}
            />
          </div>

          {/* Sort */}
          <div className="relative w-full sm:w-40">
            <select className="appearance-none w-full border-2 border-[#FA8128] rounded-lg p-2 pr-10 bg-white text-base">
              <option value="en">Sort By</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <img src="/Dropdown.svg" alt="Dropdown" className="w-5 h-5" />
            </div>
          </div>

          {/* Date */}
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

      {/* Table */}
      <div className="table-div flex flex-col gap-4 p-4 pl-10 pr-10">
        <div className="flex justify-between w-full items-center pb-2 border-b border-gray-300">
          <div className="flex-1">
            <p className="text-[#FA8128] font-bold">Facility Name</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-[#FA8128] font-bold">ID</p>
          </div>
          <div className="flex-1 text-right">
            <p className="text-[#FA8128] font-bold">Type</p>
          </div>
        </div>

        {users.length > 0 ? (
          users.map((facility) => (
            <div
              key={facility._id}
              className="flex justify-between w-full items-center"
            >
              <div className="flex-1">
                <p>{facility.fullName || "-"}</p>
              </div>
              <div className="flex-1 text-center">
                <p>{facility._id || "-"}</p>
              </div>
              <div className="flex-1 text-right">
                <p>{facility.type || "-"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No facilities found</p>
        )}
      </div>
    </div>
  );
};

export default SuperAdminUser;
