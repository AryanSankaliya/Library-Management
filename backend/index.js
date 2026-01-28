const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const otpRoutes = require("./routes/otprouters");

const DB_URL = process.env.MONGO_URI;
const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 SAFETY CHECK (IMPORTANT)
if (!DB_URL) {
  console.error("❌ MONGO_URI missing");
  process.exit(1);
}

// DB connect
mongoose
  .connect(DB_URL)
  .then(() => console.log("✅ DB connected"))
  .catch((err) => {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.json({ message: "backend work well" });
});

app.use("/library/book", bookRoutes);
app.use("/library/user", userRoutes);
app.use("/library/otp", otpRoutes);
app.use("/library/activity", require("./routes/activityRoutes"));

// ❗ pehle test ke liye cron band rakh
// const startCronJob = require("./cronScheduler");
// startCronJob();

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
