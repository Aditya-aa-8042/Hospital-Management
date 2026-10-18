import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    // The account (User) that registered/manages this patient
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    address: {
      type: String,
      trim: true,
    },

    // Relationship to the account holder, e.g. "Self", "Son", "Spouse"
    relationToAccountHolder: {
      type: String,
      default: "Self",
    },

    medicalHistory: [
      {
        condition: { type: String },
        diagnosedOn: { type: Date },
        notes: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;