// No changes were made to this file. It is included here for context only.
// only to be run once to seed the database with initial department data.

// Run once with: node scripts/seedDepartments.js
// Inserts your existing hardcoded departments into MongoDB.
// Safe to re-run - it skips any department whose name already exists.


import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Department from "../models/Department.js";

const departments = [
  {
    name: "Cardiology",
    description:
      "Our Cardiology department specializes in the diagnosis and treatment of heart-related conditions. Our team of cardiologists is dedicated to providing comprehensive care for patients with cardiovascular diseases.",
  },
  {
    name: "Neurology",
    description:
      "The Neurology department focuses on the diagnosis and management of neurological disorders. Our neurologists are skilled in treating conditions such as epilepsy, stroke, and neurodegenerative diseases.",
  },
  {
    name: "Orthopedics",
    description:
      "Our Orthopedics department provides comprehensive care for musculoskeletal conditions. Our orthopedic surgeons specialize in joint replacement, sports injuries, and fracture management.",
  },
  {
    name: "Pediatrics",
    description:
      "The Pediatrics department is dedicated to the health and well-being of children. Our pediatricians provide preventive care, vaccinations, and treatment for various childhood illnesses.",
  },
  {
    name: "Oncology",
    description:
      "The Oncology department is committed to providing comprehensive cancer care. Our oncologists work closely with other specialists to develop personalized treatment plans for each patient.",
  },
];

const seed = async () => {
  await connectDB();

  for (const dept of departments) {
    const exists = await Department.findOne({ name: dept.name });
    if (exists) {
      console.log(`Skipping "${dept.name}" - already exists`);
      continue;
    }
    await Department.create(dept);
    console.log(`Inserted "${dept.name}"`);
  }

  console.log("Done.");
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});