import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import {
  User,
  LogOut,
  Receipt,
  HeartPulse,
  CalendarDays,
  Pencil,
  XCircle,
  MessageCircle,
  ChevronDown,
  Building,
} from "lucide-react";

const Dropdown = () => {
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");

    setIsDropdownOpen(false);

    navigate("/");
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      {/* PROFILE BUTTON */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 hover:bg-gray-100 px-2 py-2 rounded-lg transition"
      >
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
          <User size={22} />
        </div>

        <ChevronDown
          size={18}
          className={`transition ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN MENU */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">

          <div className="px-5 py-4 bg-blue-50 border-b">
            <p className="font-semibold text-gray-800">
              My Account
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Manage your healthcare information
            </p>
          </div>

          <Link
            to="/profile"
            onClick={closeDropdown}
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
          >
            <User size={20} className="text-blue-600" />
            <span className="text-gray-700">My Profile</span>
          </Link>

          <Link
            to="/payment-receipts"
            onClick={closeDropdown}
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
          >
            <Receipt size={20} className="text-blue-600" />
            <span className="text-gray-700">
              Payment Receipts
            </span>
          </Link>

          <Link
            to="/medical-history"
            onClick={closeDropdown}
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
          >
            <HeartPulse size={20} className="text-red-500" />
            <span className="text-gray-700">
              Medical History
            </span>
          </Link>

          <Link
            to="/appointments"
            onClick={closeDropdown}
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
          >
            <CalendarDays size={20} className="text-green-600" />
            <span className="text-gray-700">
              Appointment Details
            </span>
          </Link>

          {/* <Link
            to="/department"
            onClick={closeDropdown}
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
          >
            <Building size={20} className="text-blue-600" />
            <span className="text-gray-700">
              Department
            </span>
          </Link> */}

          {/* <Link
            to="/appointments/update"
            onClick={closeDropdown}
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
          >
            <Pencil size={20} className="text-orange-500" />
            <span className="text-gray-700">
              Update Appointment
            </span>
          </Link>

          <Link
            to="/appointments/cancel"
            onClick={closeDropdown}
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
          >
            <XCircle size={20} className="text-red-500" />
            <span className="text-gray-700">
              Cancel Appointment
            </span>
          </Link> */}

          <Link
            to="/messages"
            onClick={closeDropdown}
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
          >
            <MessageCircle
              size={20}
              className="text-purple-600"
            />

            <span className="text-gray-700">
              Messages
            </span>
          </Link>

          <div className="border-t my-1"></div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={20} />

            <span>Logout</span>
          </button>

        </div>
      )}
    </div>
  );
};

export default Dropdown;