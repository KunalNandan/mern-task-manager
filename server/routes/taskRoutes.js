const express = require("express");
const router = express.Router();

const {
  getTasks,
  createTask,
  deleteTask,
} = require("../controllers/taskController");

router.delete("/:id", deleteTask);

// GET all tasks
router.get("/", getTasks);

// CREATE a task
router.post("/", createTask);

module.exports = router;