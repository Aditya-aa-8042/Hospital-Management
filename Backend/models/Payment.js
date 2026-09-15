import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    Phone: {
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

    // Masked account number
    accountNumber: {
      type: String,
      default: null,
      // Example: XXXX1234
    },

    // UPI ID
    upiId: {
      type: String,
      default: null,
      // Example: abhishek@upi
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