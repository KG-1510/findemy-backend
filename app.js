const express = require("express");
const coursesRoutes = require("./routes/courses.route.js");
const userRoutes = require("./routes/users.route.js");
const paymentRoutes = require("./routes/payment.route.js");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/courses", coursesRoutes);
app.use("/user", userRoutes);
app.use("/payment", paymentRoutes);

mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log("👍 Connection with MongoDB established successfully!");
});

app.listen(process.env.PORT || 3001, () => {
  console.log("✅ Server started at port: 3001");
});
