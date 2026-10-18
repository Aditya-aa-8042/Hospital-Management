import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Bell, Stethoscope, ChevronDown, LogOut, UserCog } from "lucide-react";

const DoctorHeader = ({ doctor, pendingCount }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close the dropdown when clicking anywhere outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/doctor/dashboard" className="flex items-center gap-3">
          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Stethoscope size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-800">MediCare Doctor</h1>
            <p className="text-sm text-gray-500">Doctor Dashboard</p>
          </div>
        </Link>

        <div className="flex items-center gap-5">
          <button className="relative text-gray-600 hover:text-blue-600">
            <Bell size={23} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {pendingCount}
            </span>
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-3"
            >
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-gray-800">Dr. {doctor?.name}</p>
                <p className="text-sm text-gray-500">{doctor?.specialization}</p>
              </div>

              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {doctor?.image ? (
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-blue-600" />
                )}
              </div>

              <ChevronDown size={18} className="text-gray-500 hidden sm:block" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border py-2 z-50">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/doctor/profile");
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserCog size={16} />
                  My Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default DoctorHeader;