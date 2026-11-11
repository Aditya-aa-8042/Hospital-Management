import { Link, NavLink } from "react-router-dom";
import Dropdown from "./Dropdown";

const Navbar = () => {
  const isLoggedIn = localStorage.getItem("userToken");
  const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/doctors", label: "Doctors" },
    { to: "/services", label: "Services" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gray-50/90 px-4 py-3 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-gray-400/60 bg-white px-5 py-2.5 shadow-md shadow-gray-900/10">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🏥</span>
          <div>
            <h1 className="text-xl font-bold leading-tight text-blue-600">MediCare</h1>
            <p className="text-xs text-gray-500">Healthcare Hospital</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 font-bold text-white shadow-sm"
                    : "font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-950"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {isLoggedIn ? (
            <Dropdown />
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-700 transition hover:text-blue-700">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
