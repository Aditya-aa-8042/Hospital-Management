import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // Person who logged in and booked the appointment
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Patient selected from the dropdown (must belong to bookedBy)
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
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
      enum: ["Pending", "Confirmed", "Completed", "Cancelled" ,"Postponed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;