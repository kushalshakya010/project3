const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const paymentRoutes = require("./routes/paymentRoutes");
const offenseRoutes = require("./routes/offenseRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(express.json()); // For parsing JSON requests
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, { useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Payment routes
app.use("/api/payments", paymentRoutes);
app.use("/api/offenses", offenseRoutes);

app.use("/api/users", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
