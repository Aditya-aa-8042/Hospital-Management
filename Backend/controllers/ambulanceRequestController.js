import AmbulanceRequest from "../models/AmbulanceRequest.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createAmbulanceRequest = asyncHandler(async (req, res) => {
  const { patientName, phone, pickupAddress, destinationAddress, preferredAt, transportType, notes = "" } = req.body;

  if (!patientName?.trim() || !phone?.trim() || !pickupAddress?.trim() || !destinationAddress?.trim() || !preferredAt || !transportType) {
    res.status(400);
    throw new Error("Please complete all required ambulance request fields");
  }
  if (!["Seated", "Wheelchair", "Stretcher"].includes(transportType)) {
    res.status(400);
    throw new Error("Please select a valid transport type");
  }

  const requestedTime = new Date(preferredAt);
  if (Number.isNaN(requestedTime.getTime()) || requestedTime <= new Date()) {
    res.status(400);
    throw new Error("Please choose a future pickup date and time");
  }

  const request = await AmbulanceRequest.create({
    patientName: patientName.trim(),
    phone: phone.trim(),
    pickupAddress: pickupAddress.trim(),
    destinationAddress: destinationAddress.trim(),
    preferredAt: requestedTime,
    transportType,
    notes: notes.trim(),
  });

  res.status(201).json({
    success: true,
    message: "Ambulance transport request received. It is not confirmed until hospital staff contact you.",
    data: request,
  });
});

export const getAmbulanceRequests = asyncHandler(async (req, res) => {
  const requests = await AmbulanceRequest.find().sort({ preferredAt: 1, createdAt: -1 });
  res.status(200).json({ success: true, count: requests.length, data: requests });
});
