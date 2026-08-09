import { useState } from "react";
import { toast } from "react-toastify";

function UserMenu({ user, onLogout, onProfileUpdate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");

    const handleUpdateProfile = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/auth/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to update profile");
                return;
            }

            localStorage.setItem("user", JSON.stringify(data));

            onProfileUpdate(data);

            setIsEditing(false);

            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Unable to update profile");
        }
    };

    return (
        <div className="relative">

            {/* User Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition"
            >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-gray-800">
                        {user?.name}
                    </p>

                    <p className="text-xs text-gray-500">
                        {user?.email}
                    </p>
                </div>

                <span className="text-gray-500">
                    {isOpen ? "▲" : "▼"}
                </span>
            </button>


            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50">

                    {!isEditing ? (
                        <>
                            <div className="p-4 border-b">

                                <p className="font-semibold text-gray-800">
                                    👤 {user?.name}
                                </p>

                                <p className="text-sm text-gray-500 mt-1 break-all">
                                    📧 {user?.email}
                                </p>

                            </div>

                            <div className="p-2">

                                <button
                                    onClick={() => {
                                        setName(user?.name || "");
                                        setIsEditing(true);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                                >
                                    ✏️ Edit Profile
                                </button>

                                <button
                                    onClick={onLogout}
                                    className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                                >
                                    🚪 Logout
                                </button>

                            </div>
                        </>
                    ) : (
                        <div className="p-4">

                            <h3 className="font-semibold text-lg mb-4">
                                ✏️ Edit Profile
                            </h3>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your name"
                            />

                            <div className="flex gap-2 mt-4">

                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleUpdateProfile}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                                >
                                    Save
                                </button>

                            </div>

                        </div>
                    )}

                </div>
            )}

        </div>
    );
}

export default UserMenu;