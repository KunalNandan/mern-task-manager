import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import AddTaskForm from "./components/AddTaskForm";
import TaskCard from "./components/TaskCard";

function App() {
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");



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
          dueDate,
          priority,
        })
      });

      const savedTask = await response.json();

      setTasks([...tasks, savedTask]);
      setDueDate("");
      setPriority("Medium");
      setNewTask("");
      toast.success("Task added successfully!");
    } catch (error) {
      console.error(error);
    }
  };


  const deleteTask = async (id) => {

    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== id));
        toast.success("Task deleted!");
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

      toast.success(
        currentStatus
          ? "Task marked as pending!"
          : "Task completed!"
      );
    } catch (error) {
      console.error(error);
    }


  };
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (filter === "completed") {
      return matchesSearch && task.completed;
    }

    if (filter === "pending") {
      return matchesSearch && !task.completed;
    }

    return matchesSearch;
  });

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const updateTask = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${editingTask._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editedTitle,
          }),
        }
      );

      const updatedTask = await response.json();

      setTasks(
        tasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );

      setIsModalOpen(false);
      setEditingTask(null);
      setEditedTitle("");
      toast.success("Task updated!");

    } catch (error) {
      console.error(error);
    }
  };

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Completed tasks go to the bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Priority order
    const priorityOrder = {
      High: 1,
      Medium: 2,
      Low: 3,
    };

    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    // Due date
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center p-10">
      <div className="w-full max-w-7xl mx-auto p-8">
        <Header />

        <Dashboard
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
          completionPercentage={completionPercentage}
        />

        <AddTaskForm
          newTask={newTask}
          setNewTask={setNewTask}
          dueDate={dueDate}
          setDueDate={setDueDate}
          priority={priority}
          setPriority={setPriority}
          addTask={addTask}
        />


        <div className="mt-4">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 mt-4">

          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition ${filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg transition ${filter === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            Pending
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg transition ${filter === "completed"
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            Completed
          </button>

        </div>

        {sortedTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            toggleComplete={toggleComplete}
            deleteTask={deleteTask}
            setEditingTask={setEditingTask}
            setEditedTitle={setEditedTitle}
            setIsModalOpen={setIsModalOpen}
          />
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">

            <h2 className="text-2xl font-bold mb-4">
              ✏️ Edit Task
            </h2>

            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={updateTask}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>

            </div>

          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );

}



export default App;