import ServiceBooking from "../models/ServiceBooking.js";
import asyncHandler from "../utils/asyncHandler.js";

const allowedServices = [
  "Full Body Checkup",
  "CT Scan",
  "MRI Scan",
  "X-Ray",
  "Dialysis",
  "Eye Checkup",
  "Heart Checkup",
  "Laboratory Tests",
  "Other Health Services",
];

export const createServiceBooking = asyncHandler(async (req, res) => {
  const { service, name, phone, adharNumber = "", age, preferredDate, notes = "" } = req.body;

  if (!allowedServices.includes(service)) {
    res.status(400);
    throw new Error("Please select a valid hospital service");
  }
  if (!name?.trim() || !phone?.trim() || !adharNumber?.trim()) {
    res.status(400);
    throw new Error("Name, phone number, and Aadhaar number are required");
  }
  if (age !== undefined && age !== null && age !== "" && (!Number.isInteger(Number(age)) || Number(age) < 0 || Number(age) > 120)) {
    res.status(400);
    throw new Error("Age must be a number between 0 and 120");
  }

  if (adharNumber && !/^\d{12}$/.test(adharNumber)) {
    res.status(400);
    throw new Error("Aadhaar number must be a 12-digit number");
  }

  if (preferredDate && Number.isNaN(new Date(preferredDate).getTime())) {
    res.status(400);
    throw new Error("Please provide a valid preferred date");
  }

  const booking = await ServiceBooking.create({
    service,
    name: name.trim(),
    phone: phone.trim(),
    adharNumber: adharNumber.trim(),
    age: age === undefined || age === null || age === "" ? null : Number(age),
    preferredDate: preferredDate || null,
    notes: notes.trim(),
  });

  res.status(201).json({ success: true, message: "Service request received", data: booking });
});
