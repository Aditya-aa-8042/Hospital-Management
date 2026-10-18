// Wraps MSG91's OTP API (v5). MSG91 generates, stores, and verifies the OTP
// on their end - we don't need to store or hash anything ourselves.
//
// Required .env variables:
//   MSG91_AUTH_KEY     - from MSG91 dashboard
//   MSG91_TEMPLATE_ID  - your approved OTP DLT template ID in MSG91 dashboard
//
// Docs: https://docs.msg91.com/reference/send-otp

const MSG91_BASE_URL = "https://control.msg91.com/api/v5/otp";

const DEV_OTP = process.env.DEV_OTP || "123456";
 
// Bypass only works outside production, so it can't be left on by accident
const isBypassOn = () =>
  process.env.DEV_SKIP_OTP === "true" && process.env.NODE_ENV !== "production";
//  comment out the above line and uncomment the below line to force bypass in production (for testing only)

// Normalizes phone to the format MSG91 expects: countrycode + number, no "+", no spaces
// e.g. "+91 98765 43210" -> "919876543210"
const normalizePhone = (phone) => {
  return phone.replace(/[^0-9]/g, "");
};

export const sendOtp = async (phone) => {

  // Bypass OTP sending in development if DEV_SKIP_OTP is true
    if (isBypassOn()) {
    console.log(`[DEV_SKIP_OTP] OTP for ${phone} is ${DEV_OTP} (no SMS sent)`);
    return { type: "success", message: "OTP bypassed in development" };
  }
  // If not bypassing, send the OTP via MSG91

  const mobile = normalizePhone(phone);

  const url = `${MSG91_BASE_URL}?template_id=${process.env.MSG91_TEMPLATE_ID}&mobile=${mobile}&authkey=${process.env.MSG91_AUTH_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  // MSG91 returns { type: "success", message: "..." } on success
  if (data.type !== "success") {
    throw new Error(data.message || "Failed to send OTP via MSG91");
  }

  return data;
};

export const verifyOtp = async (phone, otp) => {

  // Bypass OTP verification in development if DEV_SKIP_OTP is true
  if (isBypassOn()) {
    return String(otp) === DEV_OTP;
  }
// If not bypassing, verify the OTP via MSG91
  const mobile = normalizePhone(phone);

  const url = `${MSG91_BASE_URL}/verify?otp=${otp}&mobile=${mobile}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      authkey: process.env.MSG91_AUTH_KEY,
    },
  });

  const data = await response.json();

  // MSG91 returns { type: "success", message: "OTP verified success" } on success
  return data.type === "success";
};