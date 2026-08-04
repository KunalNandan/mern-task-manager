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

  const toggleComplete = async (id, currentStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: !currentStatus,
          }),
        }
      );

      const updatedTask = await response.json();

      setTasks(
        tasks.map((task) =>
          task._id === id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center p-10">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">📋</div>

          <h1 className="text-4xl font-extrabold text-gray-800">
            Task Manager
          </h1>

          <p className="text-gray-500 mt-2">
            Stay organized. Stay productive.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <input
            type="text"
            placeholder="Enter a task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-lg transition duration-300 shadow-lg"
          >
            ➕ Add
          </button>
        </div>

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

            <button
              onClick={() => toggleComplete(task._id, task.completed)}
            >
              {task.completed ? "Mark Pending" : "Mark Complete"}
            </button>

            <button onClick={() => deleteTask(task._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );

}



export default App;