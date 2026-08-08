function Dashboard({
    totalTasks,
    completedTasks,
    pendingTasks,
    completionPercentage,
}) {
    return (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

            <div className="grid grid-cols-3 gap-4">

                <div className="bg-blue-100 rounded-xl p-4 text-center">
                    <h2 className="text-2xl font-bold text-blue-700">
                        {totalTasks}
                    </h2>
                    <p>📋 Total</p>
                </div>

                <div className="bg-green-100 rounded-xl p-4 text-center">
                    <h2 className="text-2xl font-bold text-green-700">
                        {completedTasks}
                    </h2>
                    <p>✅ Completed</p>
                </div>

                <div className="bg-yellow-100 rounded-xl p-4 text-center">
                    <h2 className="text-2xl font-bold text-yellow-700">
                        {pendingTasks}
                    </h2>
                    <p>⏳ Pending</p>
                </div>

            </div>

            <div className="mt-6">

                <div className="flex justify-between mb-2">
                    <h2 className="text-lg font-semibold">
                        📊 Progress
                    </h2>

                    <span className="font-bold text-blue-600">
                        {completionPercentage}%
                    </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                    ></div>
                </div>

                <p className="text-gray-600 mt-2 text-sm">
                    {completedTasks} of {totalTasks} tasks completed
                </p>

            </div>

        </div>
    );
}

export default Dashboard;