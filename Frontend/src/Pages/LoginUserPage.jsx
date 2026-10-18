import { useState } from "react";

// Change this to your backend URL (must match PORT in backend .env)
const API_URL = "http://localhost:5000";

const LoginUserPage = () => {
  // "login" = phone + password, "forgot" = OTP flow
  const [mode, setMode] = useState("login");

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");

  // forgot-password state
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Backend only knows "user" and "doctor"
  const apiRole = role === "doctor" ? "doctor" : "user";
  const fullPhone = `+91${mobile}`;

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

    // Read as text first so an empty/non-JSON response doesn't crash
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
      throw new Error(`Empty response from ${url} (status ${res.status}). Check the backend port and routes.`);
    }
    return data;
  };

  const onSuccess = (data) => {
    localStorage.setItem("userToken", data.token);
    localStorage.setItem("userRole", apiRole);
    // Full reload so the Navbar re-reads localStorage and shows the dropdown.
    // Doctors go to their dashboard; patients go to the home page.
    window.location.href = apiRole === "doctor" ? "/doctor/dashboard" : "/";
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

  const validMobile = () => {
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return false;
    }
    return true;
  };

  // LOGIN: mobile + password only
  const handleLogin = (e) => {
    e.preventDefault();
    if (!validMobile()) return;
    if (!password) {
      setError("Please enter your password");
      return;
    }
    run(async () => {
      const data = await post("/login", {
        role: apiRole,
        phone: fullPhone,
        password,
      });
      onSuccess(data);
    });
  };

  // FORGOT PASSWORD step 1: send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!validMobile()) return;
    run(async () => {
      await post("/forgot-password/send-otp", {
        role: apiRole,
        phone: fullPhone,
      });
      setOtpSent(true);
      setMessage("OTP sent to your mobile number");
    });
  };

  // FORGOT PASSWORD step 2: verify OTP + set new password
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    run(async () => {
      const data = await post("/forgot-password/reset", {
        role: apiRole,
        phone: fullPhone,
        otp,
        newPassword,
      });
      onSuccess(data);
    });
  };

  const switchMode = (next) => {
    setMode(next);
    setOtpSent(false);
    setOtp("");
    setNewPassword("");
    setPassword("");
    setError("");
    setMessage("");
  };

  const handleSubmit =
    mode === "login"
      ? handleLogin
      : otpSent
      ? handleResetPassword
      : handleSendOtp;

  const buttonText = loading
    ? "Please wait..."
    : mode === "login"
    ? "Login"
    : otpSent
    ? "Verify OTP & Reset Password"
    : "Send OTP";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          {mode === "login" ? "Login" : "Reset Password"}
        </h1>

        <p className="text-center text-gray-500 mt-2">
          {mode === "login"
            ? "Login using your mobile number"
            : "We'll verify your mobile number with an OTP"}
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

        <form onSubmit={handleSubmit}>
          {/* Mobile Number */}
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
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              maxLength="10"
              placeholder="Enter mobile number"
              className="w-full px-4 py-3 border border-gray-300 rounded-r-lg outline-none focus:ring-2 focus:ring-blue-500"
              disabled={otpSent}
            />
          </div>

          {/* Password (login mode only) */}
          {mode === "login" && (
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Role */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={otpSent}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="patient">User</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {/* OTP + new password (forgot mode, after OTP is sent) */}
          {mode === "forgot" && otpSent && (
            <>
              <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
                Enter OTP
              </label>

              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition"
          >
            {buttonText}
          </button>
        </form>

        {/* Forgot password / back to login */}
        <div className="text-center mt-4">
          {mode === "login" ? (
            <button
              type="button"
              onClick={() => switchMode("forgot")}
              className="text-blue-600 font-semibold hover:underline text-sm"
            >
              Forgot password?
            </button>
          ) : (
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="text-blue-600 font-semibold hover:underline text-sm"
            >
              Back to login
            </button>
          )}
        </div>

        {/* Change Number */}
        {otpSent && (
          <button
            type="button"
            onClick={() => {
              setOtpSent(false);
              setOtp("");
              setNewPassword("");
              setMessage("");
            }}
            className="w-full mt-3 text-blue-600 hover:underline text-sm"
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