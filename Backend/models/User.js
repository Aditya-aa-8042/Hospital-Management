
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
 
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
 
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
 
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      trim: true,
    },
 
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
 
    age: {
      type: Number,
      min: 1,
      max: 120,
    },
 
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
 
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
 
    address: {
      type: String,
      trim: true,
    },
 
    emergencyContact: {
      type: String,
    },
 
    role: {
      type: String,
      enum: ["patient", "admin"],
      default: "patient",
    },
 
    profileImage: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
  },
  {
    timestamps: true,
  }
);
 
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  return token;
};
 
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
 
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};
 
const User = mongoose.model("User", userSchema);
 
export default User;