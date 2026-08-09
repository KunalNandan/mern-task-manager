function Dashboard({
    totalTasks,
    completedTasks,
    pendingTasks,
    completionPercentage,
    workTasks,
    studyTasks,
    personalTasks,
}) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">

            {/* Main Statistics */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">

                <div className="bg-blue-100 rounded-xl p-3 sm:p-4 text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-700">
                        {totalTasks}
                    </h2>
                    <p className="text-xs sm:text-sm">
                        📋 Total
                    </p>
                </div>

                <div className="bg-green-100 rounded-xl p-3 sm:p-4 text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-green-700">
                        {completedTasks}
                    </h2>
                    <p className="text-xs sm:text-sm">
                        ✅ Completed
                    </p>
                </div>

                <div className="bg-yellow-100 rounded-xl p-3 sm:p-4 text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-yellow-700">
                        {pendingTasks}
                    </h2>
                    <p className="text-xs sm:text-sm">
                        ⏳ Pending
                    </p>
                </div>

            </div>


            {/* Category Statistics */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-5">

                <div className="bg-blue-50 rounded-xl p-3 sm:p-4 text-center min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-blue-700">
                        {workTasks}
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-600">
                        💼 Work
                    </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-3 sm:p-4 text-center min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-purple-700">
                        {studyTasks}
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-600">
                        📘 Study
                    </p>
                </div>

                <div className="bg-green-50 rounded-xl p-3 sm:p-4 text-center min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-green-700">
                        {personalTasks}
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-600">
                        🏠 Personal
                    </p>
                </div>

            </div>


            {/* Progress */}
            <div className="mt-6">

                <div className="flex justify-between items-center mb-2">

                    <h2 className="text-base sm:text-lg font-semibold">
                        📊 Progress
                    </h2>

                    <span className="font-bold text-blue-600">
                        {completionPercentage}%
                    </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                    <div
                        className="bg-blue-600 h-3 sm:h-4 rounded-full transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                    ></div>
                </div>

                <p className="text-gray-600 mt-2 text-xs sm:text-sm">
                    {completedTasks} of {totalTasks} tasks completed
                </p>

            </div>

        </div>
    );
}

export default Dashboard;