const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/taskmanager")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.get("/api/tasks", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Learn React",
      completed: false,
    },
    {
      id: 2,
      title: "Build Task Manager",
      completed: true,
    },
  ]);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});