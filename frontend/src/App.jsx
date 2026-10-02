import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import Jobs from "./pages/Jobs";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/add-job" element={<AddJob />} />
                    <Route path="/jobs" element={<Jobs />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;