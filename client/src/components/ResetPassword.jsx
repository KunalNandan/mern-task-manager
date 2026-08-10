import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

function ResetPassword({ token, onBackToLogin }) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error("Please fill in both password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        newPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(
                    data.message || "Password reset failed"
                );
                return;
            }

            toast.success("Password reset successfully!");

            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                onBackToLogin();
            }, 1500);

        } catch (error) {
            console.error(error);
            toast.error("Unable to connect to server");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8">

                <div className="text-center mb-6">

                    <div className="text-5xl mb-3">
                        🔐
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Reset Password
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Create a new password for your account
                    </p>

                </div>

                <form
                    onSubmit={handleResetPassword}
                    className="space-y-4"
                >

                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                    >
                        🔑 Reset Password
                    </button>

                    <button
                        type="button"
                        onClick={onBackToLogin}
                        className="w-full text-gray-500 hover:text-blue-600 py-2"
                    >
                        ← Back to Login
                    </button>

                </form>

            </div>

            <ToastContainer
                position="top-right"
                autoClose={2000}
            />

        </div>
    );
}

export default ResetPassword;