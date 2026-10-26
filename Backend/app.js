import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import departmentRoutes from "./routes/Departmentroutes.js";  

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import { DISEASES } from "./utils/diseases.js";

const app = express();

// ---------- Core middleware ----------
app.use(cors()); // TODO: restrict origin to your frontend URL in production, e.g. cors({ origin: "https://yourfrontend.com" })
app.use(express.json()); // parses incoming JSON request bodies
app.use(express.urlencoded({ extended: true }));

// ---------- Health check ----------
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Hospital Management API is running" });
});

// ---------- Routes ----------

// Diseases + usual specialists. Data lives in utils/diseases.js (single source of truth).
app.get("/api/diseases", (req, res) => {
  res.status(200).json({ success: true, data: DISEASES });
});

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/department", departmentRoutes);
// ---------- Error handling (must be last) ----------
app.use(notFound);
app.use(errorHandler);

export default app;