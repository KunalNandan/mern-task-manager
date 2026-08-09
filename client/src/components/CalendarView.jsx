import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CalendarView({
    tasks,
    setEditingTask,
    setEditedTitle,
    setIsModalOpen,
    toggleComplete,
    deleteTask,
}) {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const tasksForSelectedDate = tasks.filter((task) => {
        if (!task.dueDate) return false;

        const taskDate = new Date(task.dueDate);

        return (
            taskDate.getFullYear() === selectedDate.getFullYear() &&
            taskDate.getMonth() === selectedDate.getMonth() &&
            taskDate.getDate() === selectedDate.getDate()
        );
    });

    return (
        <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📅 Task Calendar
            </h2>

            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={({ date }) => {
                    const tasksForDate = tasks.filter((task) => {
                        if (!task.dueDate) return false;

                        const taskDate = new Date(task.dueDate);

                        return (
                            taskDate.getFullYear() === date.getFullYear() &&
                            taskDate.getMonth() === date.getMonth() &&
                            taskDate.getDate() === date.getDate()
                        );
                    });

                    if (tasksForDate.length === 0) {
                        return null;
                    }

                    const hasOverdue = tasksForDate.some(
                        (task) =>
                            !task.completed &&
                            new Date(task.dueDate) < new Date()
                    );

                    const hasPending = tasksForDate.some(
                        (task) => !task.completed
                    );

                    if (hasOverdue) {
                        return (
                            <div className="text-red-600 text-xs mt-1">
                                ●
                            </div>
                        );
                    }

                    if (hasPending) {
                        return (
                            <div className="text-yellow-500 text-xs mt-1">
                                ●
                            </div>
                        );
                    }

                    return (
                        <div className="text-green-600 text-xs mt-1">
                            ●
                        </div>
                    );
                }}
            />

            <div className="mt-6">

                <h3 className="text-lg font-semibold text-gray-700">
                    Tasks for{" "}
                    {selectedDate.toLocaleDateString("en-IN")}
                </h3>

                {tasksForSelectedDate.length === 0 ? (
                    <p className="text-gray-500 mt-3">
                        No tasks for this date.
                    </p>
                ) : (
                    <div className="mt-3 space-y-3">
                        {tasksForSelectedDate.map((task) => (
                            <div
                                key={task._id}
                                className="border rounded-xl p-4 hover:shadow-md transition"
                            >
                                <h4 className="font-semibold text-gray-800">
                                    {task.title}
                                </h4>

                                <p className="text-sm text-gray-500 mt-1">
                                    {task.category} • {task.priority}
                                </p>

                                <p className="text-sm mt-2">
                                    {task.completed ? "✅ Completed" : "⏳ Pending"}
                                </p>

                                <button
                                    onClick={() => {
                                        setEditingTask(task);
                                        setEditedTitle(task.title);
                                        setIsModalOpen(true);
                                    }}
                                    className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    ✏️ Edit Task
                                </button>

                                <button
                                    onClick={() => toggleComplete(task._id, task.completed)}
                                    className="mt-3 ml-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                                >
                                    {task.completed ? "↩️ Mark Pending" : "✅ Complete"}
                                </button>

                                <button
                                    onClick={() => deleteTask(task._id)}
                                    className="mt-3 ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}

            </div>

        </div>
    );
}

export default CalendarView;