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
  { name: "Dermatology", description: "Diagnosis and treatment of skin, hair and nail conditions." },
  { name: "Gynecology", description: "Care for women's reproductive health and related conditions." },
  { name: "Obstetrics", description: "Care during pregnancy, childbirth and the postpartum period." },
  { name: "General Medicine", description: "Diagnosis and treatment of common illnesses and ongoing health concerns." },
  { name: "General Surgery", description: "Surgical assessment and treatment for a range of diseases and conditions." },
  { name: "Gastroenterology", description: "Diagnosis and treatment of digestive system disorders." },
  { name: "Nephrology", description: "Diagnosis and care for kidney diseases and related conditions." },
  { name: "Urology", description: "Care for urinary tract conditions and the male reproductive system." },
  { name: "Pulmonology", description: "Diagnosis and treatment of lung and respiratory diseases." },
  { name: "Endocrinology", description: "Care for hormonal and metabolic disorders." },
  { name: "Psychiatry", description: "Assessment and treatment of mental health conditions." },
  { name: "Ophthalmology", description: "Diagnosis and treatment of eye diseases and vision conditions." },
  { name: "ENT (Otolaryngology)", description: "Care for ear, nose and throat disorders." },
  { name: "Dentistry", description: "Preventive and restorative care for teeth and oral health." },
  { name: "Rheumatology", description: "Diagnosis and treatment of joint and autoimmune diseases." },
  { name: "Hematology", description: "Diagnosis and care for blood-related disorders." },
  { name: "Infectious Disease", description: "Diagnosis and treatment of bacterial, viral and fungal infections." },
  { name: "Immunology", description: "Evaluation and care for immune system disorders." },
  { name: "Geriatrics", description: "Healthcare focused on the needs of older adults." },
  { name: "Neonatology", description: "Specialized healthcare for newborn babies." },
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
