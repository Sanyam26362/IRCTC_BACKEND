require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const trainRoutes = require("./routes/trains");
const availRoutes = require("./routes/availability");
const bookingRoutes = require("./routes/booking");
const {errorHandler} = require("./middlewares/errorHandler");

const app = express();
connectDB();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));

app.use("/api/auth", authRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/availability", availRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
