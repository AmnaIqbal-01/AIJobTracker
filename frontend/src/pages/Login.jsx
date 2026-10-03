import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Local API URL for development; replace it with the deployed backend URL when publishing.
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.message || "Invalid email or password.");
                return;
            }

            sessionStorage.removeItem("ai-job-tracker-logged-out");
            navigate("/dashboard", { replace: true });
        } catch {
            setError("Could not connect to the server. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                
                <h1 className="text-3xl font-bold text-center mb-6">
                    AI Job Tracker
                </h1>

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-md p-3"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-md p-3"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {error && (
                        <p role="alert" className="mt-4 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                </form>
            </div>
        </div>
    );
}