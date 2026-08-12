import { useState } from "react";
import { toast } from "react-toastify";

function UserMenu({ user, onLogout, onProfileUpdate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordStrength, setPasswordStrength] = useState("");

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

    const checkPasswordStrength = (password) => {
        if (!password) {
            setPasswordStrength("");
            return;
        }

        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

        if (password.length < 6) {
            setPasswordStrength("Weak");
        } else if (
            password.length >= 8 &&
            hasUppercase &&
            hasNumber &&
            hasSpecialChar
        ) {
            setPasswordStrength("Strong");
        } else {
            setPasswordStrength("Medium");
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all password fields");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/auth/change-password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(
                    data.message || "Failed to change password"
                );
                return;
            }

            toast.success("Password changed successfully!");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setIsChangingPassword(false);

        } catch (error) {
            console.error(error);
            toast.error("Unable to change password");
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

                    {isChangingPassword ? (

                        // 🔐 Change Password
                        <div className="p-4">

                            <h3 className="font-semibold text-lg mb-4">
                                🔐 Change Password
                            </h3>

                            <div className="relative mb-3">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Current Password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                                >
                                    {showCurrentPassword ? "🙈" : "👁️"}
                                </button>
                            </div>

                            <div className="relative mb-3">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        checkPasswordStrength(e.target.value);
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                                >
                                    {showNewPassword ? "🙈" : "👁️"}
                                </button>
                            </div>

                            {passwordStrength && (
                                <p
                                    className={`text-sm font-semibold mb-3 ${passwordStrength === "Weak"
                                        ? "text-red-500"
                                        : passwordStrength === "Medium"
                                            ? "text-yellow-500"
                                            : "text-green-600"
                                        }`}
                                >
                                    Password strength: {passwordStrength}
                                </p>
                            )}

                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                                >
                                    {showConfirmPassword ? "🙈" : "👁️"}
                                </button>
                            </div>

                            {confirmPassword && (
                                <p
                                    className={`text-sm font-semibold mb-3 ${newPassword === confirmPassword
                                            ? "text-green-600"
                                            : "text-red-500"
                                        }`}
                                >
                                    {newPassword === confirmPassword
                                        ? "✓ Passwords match"
                                        : "✗ Passwords do not match"}
                                </p>
                            )}

                            <div className="flex gap-2 mt-4">

                                <button
                                    onClick={() => {
                                        setIsChangingPassword(false);
                                        setCurrentPassword("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                    }}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleChangePassword}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                                >
                                    Change
                                </button>

                            </div>

                        </div>

                    ) : !isEditing ? (

                        // 👤 Normal Menu
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
                                    onClick={() => {
                                        setIsChangingPassword(true);
                                        setIsEditing(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                                >
                                    🔐 Change Password
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

                        // ✏️ Edit Profile
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