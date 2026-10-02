import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: "Dashboard", icon: "🏠", path: "/dashboard" },
        { label: "Jobs", icon: "▤", path: "/jobs" },
        { label: "Add Job", icon: "＋", path: "/add-job" },
        { label: "Exit", icon: "⇥", path: "/login" },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 flex flex-col justify-between shrink-0">
            <div>
                <h1 className="text-xl font-bold mb-10 text-black">
                    AI Job Tracker
                </h1>

                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                                    isActive
                                        ? "bg-gray-100 text-black font-semibold"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-black"
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}