import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (newTask.trim() === "") return;
  
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTask,
        }),
      });
  
      const savedTask = await response.json();
  
      setTasks([...tasks, savedTask]);
      setNewTask("");
    } catch (error) {
      console.error(error);
    }
  };
  const deleteTask = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );
  
      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Task Manager</h1>

      <input
        type="text"
        placeholder="Enter task..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />

      <button onClick={addTask}>Add</button>

      <hr />

      {tasks.map((task) => (
        <div
        key={task._id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            margin: "10px",
          }}
        >
          <h3>{task.title}</h3>
          <p>
            Status: {task.completed ? "✅ Completed" : "❌ Pending"}
          </p>
          <button onClick={() =>deleteTask(task._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;