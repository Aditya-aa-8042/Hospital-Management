import { useState } from "react";

const LoginUserPage = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [role, setRole] = useState("patient");

  const handleSendOtp = (e) => {
    e.preventDefault();

    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    // API call will go here later
    console.log("Sending OTP to:", mobile);

    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    // API call for OTP verification will go here
    console.log("Verifying OTP:", otp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Login
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Login using your mobile number
        </p>

        {/* Mobile Number */}
        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          <label className="block text-sm font-medium text-gray-700 mt-6 mb-2">
            Mobile Number
          </label>

          <div className="flex">
            <span className="flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
              +91
            </span>

            <input
              type="tel"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, ""))
              }
              maxLength="10"
              placeholder="Enter mobile number"
              className="w-full px-4 py-3 border border-gray-300 rounded-r-lg outline-none focus:ring-2 focus:ring-blue-500"
              disabled={otpSent}
            />
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* OTP */}
          {otpSent && (
            <>
              <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
                Enter OTP
              </label>

              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {otpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>

        {/* Change Number */}
        {otpSent && (
          <button
            onClick={() => {
              setOtpSent(false);
              setOtp("");
            }}
            className="w-full mt-4 text-blue-600 hover:underline"
          >
            Change Mobile Number
          </button>
        )}
          <p className="text-center text-sm text-gray-500 mt-6">
          New Here?{" "}
          <a
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </a>
        </p>

        

        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default LoginUserPage;