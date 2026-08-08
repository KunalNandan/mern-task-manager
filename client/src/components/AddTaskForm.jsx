function AddTaskForm({
    newTask,
    setNewTask,
    dueDate,
    setDueDate,
    priority,
    setPriority,
    addTask,
  }) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
  
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3"
        />
  
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3"
        />
  
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3"
        >
          <option value="High">🔴 High</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Low">🟢 Low</option>
        </select>
  
        <button
          onClick={addTask}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          ➕ Add Task
        </button>
  
      </div>
    );
  }
  
  export default AddTaskForm;