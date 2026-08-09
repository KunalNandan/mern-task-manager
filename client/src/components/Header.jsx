function Header() {
    return (
        <div className="text-center mb-5 sm:mb-8">

            {/* Icon */}
            <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">
                📋
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Task Manager
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-gray-500 mt-1 sm:mt-2">
                Stay organized. Stay productive.
            </p>

        </div>
    );
}

export default Header;