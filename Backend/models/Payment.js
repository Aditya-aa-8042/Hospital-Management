import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // Account holder who made the payment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Patient the payment/appointment is for
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    // Appointment this payment is for
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["UPI", "Card", "Net Banking", "Cash"],
      required: true,
    },

    // Masked account number, e.g. XXXX1234
    accountNumber: {
      type: String,
      default: null,
    },

    // UPI ID, e.g. abhishek@upi
    upiId: {
      type: String,
      default: null,
    },

    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Refunded"],
      default: "Pending",
    },

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;