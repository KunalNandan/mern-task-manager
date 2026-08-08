function TaskCard({
    task,
    toggleComplete,
    deleteTask,
    setEditingTask,
    setEditedTitle,
    setIsModalOpen,
}) {

    const isOverdue =
        task.dueDate &&
        !task.completed &&
        new Date(task.dueDate) < new Date();
    return (
        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 mt-5">

            <div className="flex justify-between items-start">

                <div>

                    <h2 className="text-2xl font-bold text-gray-800">
                        {task.title}
                    </h2>

                    <div className="flex gap-3 mt-4 flex-wrap">

                        <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${task.priority === "High"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                        >
                            {task.priority}
                        </span>

                        <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${task.completed
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                                }`}
                        >
                            {task.completed ? "Completed" : "Pending"}
                        </span>

                    </div>

                    <p className="text-gray-500 mt-4">
                        {isOverdue && (
                            <div className="mt-3">
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    🚨 OVERDUE
                                </span>
                            </div>
                        )}
                        📅 Due:
                        {" "}
                        {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString("en-IN")
                            : "No Due Date"}
                    </p>

                </div>

            </div>

            <div className="flex gap-3 mt-6">

                <button
                    onClick={() => toggleComplete(task._id, task.completed)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl"
                >
                    ✓ Complete
                </button>

                <button
                    onClick={() => {
                        setEditingTask(task);
                        setEditedTitle(task.title);
                        setIsModalOpen(true);
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl"
                >
                    ✏ Edit
                </button>

                <button
                    onClick={() => deleteTask(task._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
                >
                    🗑 Delete
                </button>

            </div>

        </div>
    );
}

export default TaskCard;