import mongoose from "mongoose";

const serviceBookingSchema = new mongoose.Schema({
  service: {
    type: String,
    enum: [
      "Full Body Checkup",
      "CT Scan",
      "MRI Scan",
      "X-Ray",
      "Dialysis",
      "Eye Checkup",
      "Heart Checkup",
      "Laboratory Tests",
      "Other Health Services",
    ],
    required: true,
  },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  // email: { type: String, trim: true, lowercase: true, maxlength: 254, default: "" },
  adharNumber: { type: String, required: true, trim: true, maxlength: 12, default: "" },
  age: { type: Number, min: 0, max: 120, default: null },
  preferredDate: { type: Date, default: null },
  notes: { type: String, trim: true, maxlength: 1000, default: "" },
  status: { type: String, enum: ["Requested", "Contacted", "Completed", "Cancelled"], default: "Requested" },
}, { timestamps: true });

export default mongoose.model("ServiceBooking", serviceBookingSchema);
