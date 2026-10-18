import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      unique: true,
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

    availableTime: {
      type: String,
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
  }
);

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