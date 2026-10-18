import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional - lets you show an icon/image per department later without a schema change
    icon: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;