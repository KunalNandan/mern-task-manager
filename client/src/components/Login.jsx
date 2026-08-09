import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

function Login({ onLogin, onShowRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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

                </form>

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