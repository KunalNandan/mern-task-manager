require("dotenv").config();

const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/taskmanager")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

const sendEmail = require("./utils/sendEmail");



app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

