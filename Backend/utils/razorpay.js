import crypto from "crypto";

const API_URL = "https://api.razorpay.com/v1";

export const razorpayRequest = async (path, { method = "GET", body } = {}) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    const error = new Error("Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to Backend/.env.");
    error.statusCode = 503;
    throw error;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await response.text();
  let result = {};
  try { result = text ? JSON.parse(text) : {}; } catch { result = {}; }
  if (!response.ok) {
    const error = new Error(result.error?.description || `Razorpay request failed (${response.status})`);
    error.statusCode = response.status >= 500 ? 502 : 400;
    throw error;
  }
  return result;
};

export const verifyRazorpayWebhookSignature = (rawBody, signature) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !Buffer.isBuffer(rawBody) || !/^[a-f0-9]{64}$/i.test(signature || "")) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest();
  const received = Buffer.from(signature, "hex");
  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
};
