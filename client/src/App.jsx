import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import AddTaskForm from "./components/AddTaskForm";
import TaskCard from "./components/TaskCard";
import CalendarView from "./components/CalendarView";
import Login from "./components/Login";
import Register from "./components/Register";
import UserMenu from "./components/UserMenu";
import ResetPassword from "./components/ResetPassword";

function App() {
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Personal");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [showRegister, setShowRegister] = useState(false);

  const handleSessionExpired = (message) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    toast.error(message || "Session expired. Please login again.");
  };

  const resetTokenFromUrl = window.location.pathname.startsWith(
    "/reset-password/"
  )
    ? window.location.pathname.split("/reset-password/")[1]
    : null;


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");



  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          handleSessionExpired(data.message);
          return;
        }

        if (!response.ok) {
          console.error("Failed to fetch tasks:", data);
          setTasks([]);
          return;
        }

        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      }
    };

    fetchTasks();
  }, [user]);

  const addTask = async () => {
    if (newTask.trim() === "") return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: newTask,
          dueDate,
          priority,
          category,
        }),
      });

      const data = await response.json();

      // Session expired
      if (response.status === 401) {
        handleSessionExpired(data.message);
        return;
      }

      // Other API errors
      if (!response.ok) {
        toast.error(data.message || "Failed to add task");
        return;
      }

      // Task successfully created
      setTasks([...tasks, data]);
      setDueDate("");
      setPriority("Medium");
      setCategory("Personal");
      setNewTask("");

      toast.success("Task added successfully!");

    } catch (error) {
      console.error(error);
      toast.error("Unable to connect to server");
    }
  };


  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleSessionExpired(data.message);
        return;
      }

      if (!response.ok) {
        console.error("Failed to delete task:", data);
        toast.error(data.message || "Failed to delete task");
        return;
      }

      setTasks(tasks.filter((task) => task._id !== id));

      toast.success("Task deleted!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Unable to delete task");
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            completed: !currentStatus,
          }),
        }
      );

      const updatedTask = await response.json();

      if (response.status === 401) {
        handleSessionExpired(updatedTask.message);
        return;
      }

      if (!response.ok) {
        console.error("Failed to update task:", updatedTask);
        toast.error(updatedTask.message || "Failed to update task");
        return;
      }

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
      console.error("Error updating task:", error);
      toast.error("Unable to update task");
    }
  };
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed);

    const matchesCategory =
      categoryFilter === "all" ||
      task.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalTasks = tasks.length;

  const workTasks = tasks.filter(
    (task) => task.category === "Work"
  ).length;

  const studyTasks = tasks.filter(
    (task) => task.category === "Study"
  ).length;

  const personalTasks = tasks.filter(
    (task) => task.category === "Personal"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const updateTask = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${editingTask._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: editedTitle,
            priority: editingTask.priority,
            category: editingTask.category,
            dueDate: editingTask.dueDate,
          }),
        }
      );

      const updatedTask = await response.json();

      if (response.status === 401) {
        handleSessionExpired(updatedTask.message);
        return;
      }

      if (!response.ok) {
        console.error("Failed to update task:", updatedTask);
        toast.error(updatedTask.message || "Failed to update task");
        return;
      }

      setTasks(
        tasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );

      setIsModalOpen(false);
      setEditingTask(null);
      setEditedTitle("");

      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Unable to update task");
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

  if (resetTokenFromUrl) {
    return (
      <ResetPassword
        token={resetTokenFromUrl}
        onBackToLogin={() => {
          window.history.replaceState({}, "", "/");

          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setUser(null);
        }}
      />
    );
  }
  if (!user) {
    return showRegister ? (
      <Register
        onRegister={() => setShowRegister(false)}
        onShowLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={(loggedInUser) => setUser(loggedInUser)}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (




    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center p-3 sm:p-6 lg:p-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header />
        <div className="flex justify-end mb-4">
          <UserMenu
            user={user}
            onLogout={handleLogout}
            onProfileUpdate={(updatedUser) => {
              setUser(updatedUser);
            }}
          />
        </div>
        <Dashboard
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
          completionPercentage={completionPercentage}
          workTasks={workTasks}
          studyTasks={studyTasks}
          personalTasks={personalTasks}
        />

        <AddTaskForm
          newTask={newTask}
          setNewTask={setNewTask}
          dueDate={dueDate}
          setDueDate={setDueDate}
          priority={priority}
          setPriority={setPriority}
          category={category}
          setCategory={setCategory}
          addTask={addTask}
        />

        <CalendarView
          tasks={tasks}
          setEditingTask={setEditingTask}
          setEditedTitle={setEditedTitle}
          setIsModalOpen={setIsModalOpen}
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
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

        {/* Status Filters */}
        <div className="flex flex-wrap gap-3 mt-6">

          <button
            onClick={() => {
              setFilter("all");
              setCategoryFilter("all");
            }}
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

        {/* Category Filters */}
        <p className="text-sm font-semibold text-gray-500 mt-5 mb-2">
          Filter by Category
        </p>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() => setCategoryFilter("Work")}
            className={`px-4 py-2 rounded-lg transition ${categoryFilter === "Work"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            💼 Work
          </button>

          <button
            onClick={() => setCategoryFilter("Study")}
            className={`px-4 py-2 rounded-lg transition ${categoryFilter === "Study"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            📘 Study
          </button>

          <button
            onClick={() => setCategoryFilter("Personal")}
            className={`px-4 py-2 rounded-lg transition ${categoryFilter === "Personal"
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            🏠 Personal
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

            <select
              value={editingTask?.priority || "Medium"}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  priority: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-2 mt-3"
            >
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>

            <select
              value={editingTask?.category || "Personal"}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  category: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-2 mt-3"
            >
              <option value="Work">💼 Work</option>
              <option value="Study">📘 Study</option>
              <option value="Personal">🏠 Personal</option>
            </select>

            <input
              type="date"
              value={
                editingTask?.dueDate
                  ? new Date(editingTask.dueDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  dueDate: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-2 mt-3"
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