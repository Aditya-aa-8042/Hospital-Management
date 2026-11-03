import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isAvailableNow, formatTimeRange, toMinutes } from "../utils/availability.js";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    phone: {
      type: String,
      required: true,
      unique: true, // login happens by phone now, must be unique
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    fees: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    // Working hours, 24-hour "HH:mm" (what <input type="time"> produces), e.g. "10:00" / "13:00".
    // The display text "10:00 AM - 1:00 PM" is built from these - see toJSON below.
    availableFrom: {
      type: String,
      default: "",
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must be a valid time"],
    },

    availableTo: {
      type: String,
      default: "",
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "End time must be a valid time"],
    },

    availableDays: {
      type: [String], // e.g. ["Monday", "Wednesday", "Friday"]
      default: [],
    },

    treats: {
      type: String, // e.g. "Heart Disease"
      default: "",
    },

    image: {
      type: String,
    },

    role: {
      type: String,
      default: "doctor",
      immutable: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      // Computed fresh on every response - never stored, so it can't go stale.
      transform: (doc, ret) => {
        ret.isAvailable = isAvailableNow(doc);
        ret.availableTime = formatTimeRange(doc.availableFrom, doc.availableTo);
        return ret;
      },
    },
  }
);

// If both times are set, the end must come after the start
doctorSchema.pre("validate", function () {
  const from = toMinutes(this.availableFrom);
  const to = toMinutes(this.availableTo);

  if (from !== null && to !== null && from >= to) {
    this.invalidate("availableTo", "End time must be after the start time");
  }
});

doctorSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  return token;
};

doctorSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

doctorSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;