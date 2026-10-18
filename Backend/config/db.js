import dns from "node:dns";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dnsServers = process.env.MONGODB_DNS_SERVERS
      ?.split(",")
      .map((server) => server.trim())
      .filter(Boolean);

    if (dnsServers?.length) {
      dns.setServers(dnsServers);
    }

    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI

    );

  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);

    process.exit(1);
  }
};

export default connectDB;