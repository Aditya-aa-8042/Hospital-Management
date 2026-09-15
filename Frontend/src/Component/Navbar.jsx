import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";

const Navbar = () => {
  const isLoggedIn = localStorage.getItem("userToken");

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🏥</span>

          <div>
            <h1 className="text-xl font-bold text-blue-600">
              MediCare
            </h1>

            <p className="text-xs text-gray-500">
              Healthcare Hospital
            </p>
          </div>
        </Link>

        {/* NAVIGATION */}
        <div className=" align-middle  hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 font-medium hover:text-blue-600 transition">Home</Link>
          <Link to="/doctors" className="text-gray-700 font-medium hover:text-blue-600 transition">Doctors</Link>
          <Link to="/about" className="text-gray-700 font-medium hover:text-blue-600 transition">About</Link>
          <Link to="/contact" className="text-gray-700 font-medium hover:text-blue-600 transition">Contact Us</Link>
        </div>

        {/* RIGHT SIDE */}
        {/* <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Dropdown />
          ) : (
            <>
              <Link to="/login" className="text-blue-600 font-semibold"> Login </Link>

              <Link to="/register" className="bg-blue-600 text-white px-5 py-3 rounded-lg"> Sign Up </Link>
            </>
          )}
        </div> */}
        {/* Optional To check dropdown functionality */}
         <div className="flex items-center gap-4">
          <Dropdown />
        </div>
          {/* This part is done to check whether the dropdown is working correctly */}
      </div>
    </nav>
  );
};

export default Navbar;

