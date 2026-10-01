import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import Jobs from "./pages/Jobs";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-job" element={<AddJob />} />
                <Route path="/jobs" element={<Jobs />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;