const Task = require("../models/Task");

// GET all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.userId,
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a new task
const createTask = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const task = new Task({
      title: req.body.title,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      category: req.body.category,
      userId: req.userId,
    });

    console.log("Task Before Save:", task);

    const savedTask = await task.save();

    res.status(201).json(savedTask);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE a task
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE task completion
const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        $set: {
          title: req.body.title,
          dueDate: req.body.dueDate,
          priority: req.body.priority,
          category: req.body.category,
          completed: req.body.completed,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
};