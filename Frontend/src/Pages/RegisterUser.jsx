import { useState } from "react";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    otp: "",
    role: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (formData.phone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!formData.email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    // Backend API will be called here
    console.log("OTP sent to:", formData.phone);

    setOtpSent(true);
  };

  // Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (formData.otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    // Backend OTP verification will happen here
    console.log("OTP:", formData.otp);

    setVerified(true);
  };

  // Final Registration
  const handleRegister = (e) => {
    e.preventDefault();

    if (!verified) {
      alert("Please verify your mobile number first");
      return;
    }

    // Send registration data to backend
    console.log("Registration Data:", formData);

    alert("Registration successful!");
  };

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

        <form className="mt-6">

          {/* Name */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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
                  setFormData({
                    ...formData,
                    phone: value,
                  });
                }
              }}
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
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Send OTP */}
          {!otpSent && (
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Send OTP
            </button>
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
                    setFormData({
                      ...formData,
                      otp: value,
                    });
                  }
                }}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center tracking-[0.5em] outline-none focus:ring-2 focus:ring-blue-500"
              />

              {!verified && (
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Verify OTP
                </button>
              )}
            </>
          )}

          {/* Verification Status */}
          {verified && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-center">
              ✓ Mobile number verified
            </div>
          )}

          {/* Register */}
          {verified && (
            <button
              type="button"
              onClick={handleRegister}
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Create Account
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
