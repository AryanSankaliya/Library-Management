const dotenv = require("dotenv");
// Load env
dotenv.config({ path: "../.env" });

const express = require("express");
const mongoose = require("mongoose");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const otpRoutes = require("./routes/otprouters");

const Book = require("./models/Book");
const cors = require("cors");

const DB_URL = process.env.MONGO_URI;
const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());

// DB connection
mongoose
  .connect(DB_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.json({ message: "backend work well" });
});

app.use("/library/book", bookRoutes);
app.use("/library/user", require("./routes/userRoutes"));
app.use("/library/otp", otpRoutes);
app.use("/library/activity", require("./routes/activityRoutes"));

// Start Cron Job
// const startCronJob = require("./cronScheduler");
// startCronJob();

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(DB_URL);
    console.log("DB connected");

    // Start server AFTER DB connection
    app.listen(PORT, () => {
      console.log(`Backend running on PORT ${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed:", err);
  }
}

// Start the server
startServer();
