import mongoose from "mongoose";

const ambulanceRequestSchema = new mongoose.Schema({
  patientName: { type: String, required: true, trim: true, maxlength: 120 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  pickupAddress: { type: String, required: true, trim: true, maxlength: 500 },
  destinationAddress: { type: String, required: true, trim: true, maxlength: 500 },
  preferredAt: { type: Date, required: true },
  transportType: { type: String, enum: ["Seated", "Wheelchair", "Stretcher"], required: true },
  notes: { type: String, trim: true, maxlength: 1000, default: "" },
  status: { type: String, enum: ["Requested", "Confirmed", "Declined", "Completed", "Cancelled"], default: "Requested" },
}, { timestamps: true });

export default mongoose.model("AmbulanceRequest", ambulanceRequestSchema);
