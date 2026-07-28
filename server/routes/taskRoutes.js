const express = require("express");
const router = express.Router();

const {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} = require("../controllers/taskController");

router.delete("/:id", deleteTask);

router.patch("/:id", updateTask);

// GET all tasks
router.get("/", getTasks);

// CREATE a task
router.post("/", createTask);

module.exports = router;