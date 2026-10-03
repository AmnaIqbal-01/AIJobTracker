import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const LOGGED_OUT_KEY = "ai-job-tracker-logged-out";

export default function AppLayout() {
    if (sessionStorage.getItem(LOGGED_OUT_KEY) === "true") {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar onLogout={() => sessionStorage.setItem(LOGGED_OUT_KEY, "true")} />
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}