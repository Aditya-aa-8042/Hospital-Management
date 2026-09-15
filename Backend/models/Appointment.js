import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // Person who logged in and booked the appointment
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Actual patient details
    patientName: {
      type: String,
      required: true,
    },

    patientAge: {
      type: Number,
      required: true,
    },

    patientGender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    patientPhone: {
      type: String,
      required: true,
    },

    // Doctor selected for appointment
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);

export default Appointment;