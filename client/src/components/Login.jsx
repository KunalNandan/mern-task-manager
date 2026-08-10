import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ResetPassword from "./ResetPassword";

function Login({ onLogin, onShowRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetToken, setResetToken] = useState("");
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please enter email and password");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            toast.success("Login successful!");

            onLogin(data.user);
        } catch (error) {
            console.error(error);
            toast.error("Unable to connect to server");
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Unable to process request");
                return;
            }

            toast.success("Reset token generated!");

            console.log("Reset Token:", data.resetToken);

            setResetToken(data.resetToken);

        } catch (error) {
            console.error(error);
            toast.error("Unable to connect to server");
        }
    };

    if (resetToken) {
        return (
            <ResetPassword
                token={resetToken}
                onBackToLogin={() => {
                    setResetToken("");
                    setShowForgotPassword(false);
                    setPassword("");
                }}
            />
        );
    }

    return (


        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8">

                <div className="text-center mb-6">

                    <div className="text-5xl mb-3">
                        📋
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Task Manager
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Login to continue
                    </p>

                </div>
                {showForgotPassword ? (
                    <form onSubmit={handleForgotPassword} className="space-y-4">

                        <h2 className="text-2xl font-bold text-gray-900 text-center">
                            🔑 Forgot Password?
                        </h2>

                        <p className="text-sm text-gray-500 text-center">
                            Enter your email to reset your password.
                        </p>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                        >
                            📧 Send Reset Link
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(false)}
                            className="w-full text-gray-500 hover:text-blue-600 py-2"
                        >
                            ← Back to Login
                        </button>

                    </form>
                ) : (

                    <form onSubmit={handleLogin} className="space-y-4">

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                        >
                            🔐 Login
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="w-full text-sm text-blue-600 hover:text-blue-700 font-semibold mt-2"
                        >
                            Forgot Password?
                        </button>

                    </form>

                )}

                <p className="text-center text-gray-500 mt-6">
                    Don't have an account?
                </p>

                <button
                    onClick={onShowRegister}
                    className="w-full mt-2 border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-lg font-semibold"
                >
                    Create Account
                </button>

            </div>

            <ToastContainer position="top-right" autoClose={2000} />

        </div>
    );
}

export default Login;