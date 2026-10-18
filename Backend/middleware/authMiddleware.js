import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";

// Verifies JWT token, attaches req.user (or req.doctor) based on role
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token invalid or expired",
      });
    }

    // decoded._id + decoded.role were set when the token was signed
    if (decoded.role === "doctor") {
      const doctor = await Doctor.findById(decoded._id).select("-password");
      if (!doctor) {
        return res.status(401).json({
          success: false,
          message: "Doctor account not found",
        });
      }
      req.doctor = doctor;
      req.user = doctor; // convenience, so generic middleware can just check req.user
      req.userRole = "doctor";
    } else {
      const user = await User.findById(decoded._id).select("-password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User account not found",
        });
      }
      req.user = user;
      req.userRole = user.role; // "patient" or "admin"
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
      error: error.message,
    });
  }
};

// Restricts access to specific roles, e.g. authorize("admin"), authorize("doctor")
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied for role: ${req.userRole}`,
      });
    }
    next();
  };
};