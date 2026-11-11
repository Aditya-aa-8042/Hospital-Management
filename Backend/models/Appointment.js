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

    // Structured disease/condition, used to match against a Doctor's `treats`
    // field when the user skips choosing a doctor manually.
    disease: {
      type: String,
      required: true,
      trim: true,
    },

    reason: {
      type: String,
      required: true,
    },

    // "Cancelled" = the doctor rejected it. "Cancelled by patient" = the patient cancelled it
    // themselves (kept separate so a patient's cancellation isn't counted as a rejection).
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled", "Cancelled by patient", "Postponed"],
      default: "Pending",
    },

    // Payment is requested only after the doctor confirms the appointment.
    paymentStatus: {
      type: String,
      enum: ["NotRequired", "Pending", "Paid", "Expired", "Cancelled"],
      default: "NotRequired",
    },
    confirmedAt: { type: Date, default: null },
    paymentDeadlineAt: { type: Date, default: null },
    cancellationReason: { type: String, default: "" },

    // How many minutes before the appointment the patient wants to be reminded
    // (30, 60, 120 or 1440). null = no reminder. It is relative to the appointment, so if the
    // doctor postpones the appointment the reminder moves with it.
    reminderMinutesBefore: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
