import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

function ResetPassword({ token, onBackToLogin }) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordStrength, setPasswordStrength] = useState("");

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

                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                checkPasswordStrength(e.target.value);
                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowNewPassword(!showNewPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                        >
                            {showNewPassword ? "🙈" : "👁️"}
                        </button>
                    </div>

                    {passwordStrength && (
                        <p
                            className={`text-sm font-semibold ${passwordStrength === "Weak"
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
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className={`text-sm font-semibold ${newPassword === confirmPassword
                                    ? "text-green-600"
                                    : "text-red-500"
                                }`}
                        >
                            {newPassword === confirmPassword
                                ? "✓ Passwords match"
                                : "✗ Passwords do not match"}
                        </p>
                    )}

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