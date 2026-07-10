const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URL, {
      tls: true,
      tlsAllowInvalidCertificates: false,
      serverSelectionTimeoutMS: 10000, // 10s timeout
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4
    });
    console.log(`Database connection successful: ${connection.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    console.error(
      "Please ensure your IP is whitelisted in MongoDB Atlas and try again."
    );
    // Don't exit — server will retry on next request
  }
};

module.exports = dbConnect;