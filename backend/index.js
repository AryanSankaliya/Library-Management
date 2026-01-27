const dotenv = require('dotenv');
// Load env
dotenv.config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const otpRoutes = require('./routes/otprouters')


const Book = require('./models/Book');
const cors = require("cors");

const DB_URL = process.env.MONGO_URI;
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

// DB connection
mongoose.connect(DB_URL)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

app.use('/library/book', bookRoutes)
app.use('/library/user', require("./routes/userRoutes"))
app.use("/library/otp", otpRoutes);
app.use("/library/activity", require('./routes/activityRoutes'));


// Start Cron Job
const startCronJob = require('./cronScheduler');
startCronJob();



const transporter = require('./config/mailer');

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);

  // Verify SMTP Connection for Debugging

  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ SMTP Connection failed:", error);
    } else {

    }
  });
});
