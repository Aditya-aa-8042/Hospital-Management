import { useState } from "react";

// Change this to your backend URL (must match PORT in backend .env)
const API_URL = "http://localhost:5000";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    otp: "",
    role: "patient",
    // doctor-only fields
    specialization: "",
    experience: "",
    fees: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Backend only knows "user" and "doctor"
  const apiRole = formData.role === "doctor" ? "doctor" : "user";
  const fullPhone = `+91${formData.phone}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const post = async (path, body) => {
    const url = `${API_URL}/api/auth${path}`;

    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new Error(`Cannot reach the server at ${API_URL}. Is the backend running?`);
    }

    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }

    if (!res.ok) {
      throw new Error(data.message || `Request to ${url} failed (status ${res.status})`);
    }
    if (!text) {
      throw new Error(`Empty response from ${url} (status ${res.status})`);
    }
    return data;
  };

  const run = async (fn) => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await fn();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Validates the form fields (used before sending OTP)
  const validateForm = () => {
    if (!formData.name.trim()) return "Please enter your name";
    if (formData.phone.length !== 10) return "Please enter a valid 10-digit mobile number";
    if (!formData.email.includes("@")) return "Please enter a valid email address";
    if (formData.password.length < 6) return "Password must be at least 6 characters";

    if (formData.role === "doctor") {
      if (!formData.specialization.trim()) return "Please enter your specialization";
      if (formData.experience === "" || Number(formData.experience) < 0)
        return "Please enter your years of experience";
      if (formData.fees === "" || Number(formData.fees) < 0)
        return "Please enter your consultation fees";
    }
    return "";
  };

  // Step 1: Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();

    const problem = validateForm();
    if (problem) {
      setError(problem);
      return;
    }

    run(async () => {
      await post("/send-otp", { phone: fullPhone });
      setOtpSent(true);
      setMessage("OTP sent to your mobile number");
    });
  };

  // Step 2: Register (backend verifies the OTP and creates the account)
  const handleRegister = (e) => {
    e.preventDefault();

    if (formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    run(async () => {
      const body = {
        role: apiRole,
        phone: fullPhone,
        otp: formData.otp,
        password: formData.password,
        email: formData.email,
      };

      if (apiRole === "doctor") {
        body.name = formData.name;
        body.specialization = formData.specialization;
        body.experience = Number(formData.experience);
        body.fees = Number(formData.fees);
      } else {
        body.fullName = formData.name;
      }

      const data = await post("/register", body);

      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userRole", apiRole);
      // Full reload so the Navbar re-reads localStorage.
      // Doctors go to their dashboard; patients go to the home page.
      window.location.href = apiRole === "doctor" ? "/doctor/dashboard" : "/";
    });
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Register your account
        </p>

        {/* Error / success messages */}
        {error && (
          <p className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 mt-4">
            {error}
          </p>
        )}
        {message && (
          <p className="bg-green-50 text-green-600 text-sm rounded-lg px-4 py-2 mt-4">
            {message}
          </p>
        )}

        <form className="mt-6" onSubmit={otpSent ? handleRegister : handleSendOtp}>

          {/* Name */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={otpSent}
            placeholder="Enter your full name"
            className={inputClass}
          />

          {/* Phone */}
          <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
            Mobile Number
          </label>

          <div className="flex">
            <span className="flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
              +91
            </span>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  setFormData({ ...formData, phone: value });
                }
              }}
              disabled={otpSent}
              placeholder="Enter mobile number"
              maxLength="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-r-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={otpSent}
            placeholder="Enter your email"
            className={inputClass}
          />

          {/* Password */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={otpSent}
              placeholder="Enter your password (min 6 characters)"
              className={inputClass}
            />
          </div>

          {/* Role */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={otpSent}
              className={inputClass}
            >
              <option value="patient">User</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {/* Doctor-only fields */}
          {formData.role === "doctor" && (
            <>
              <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                disabled={otpSent}
                placeholder="e.g. Cardiologist"
                className={inputClass}
              />

              <div className="flex gap-4 mt-5">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    min="0"
                    value={formData.experience}
                    onChange={handleChange}
                    disabled={otpSent}
                    placeholder="e.g. 10"
                    className={inputClass}
                  />
                </div>

                {/* <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fees (₹)
                  </label>
                  <input
                    type="number"
                    name="fees"
                    min="0"
                    value={formData.fees}
                    onChange={handleChange}
                    disabled={otpSent}
                    placeholder="e.g. 600"
                    className={inputClass}
                  />
                </div> */}
              </div>
            </>
          )}

          {/* OTP */}
          {otpSent && (
            <>
              <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
                Enter OTP
              </label>

              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 6) {
                    setFormData({ ...formData, otp: value });
                  }
                }}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center tracking-[0.5em] outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}

          {/* Main button: Send OTP, then Create Account */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Please wait..." : otpSent ? "Verify OTP & Create Account" : "Send OTP"}
          </button>

          {/* Go back and edit details */}
          {otpSent && (
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setFormData({ ...formData, otp: "" });
                setError("");
                setMessage("");
              }}
              className="w-full mt-3 text-blue-600 hover:underline text-sm"
            >
              Edit details / Resend OTP
            </button>
          )}
        </form>

        {/* Login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </a>
        </p>

      </div>
    </div>
  );
};

export default RegisterUser;