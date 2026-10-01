import { useNavigate } from "react-router-dom";
export default function Dashboard() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">
                        AI Job Tracker
                    </h1>

                    <button className="text-gray-600 hover:text-black">
                        Logout
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-6xl mx-auto px-6 py-10">

                <h2 className="text-3xl font-bold mb-2">
                    Dashboard
                </h2>

                <p className="text-gray-600 mb-8">
                    Track and manage your job applications.
                </p>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Add Job */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">
                            Add Job
                        </h3>

                        <p className="text-gray-600 mb-5">
                            Upload a screenshot of a job posting and let AI
                            extract the job information.
                        </p>

                        <button 
                        onClick={() => navigate("/add-job")}
                        className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700">
                            Add Job
                        </button>
                    </div>

                    {/* View Jobs */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">
                            View Applications
                        </h3>

                        <p className="text-gray-600 mb-5">
                            View all your saved job applications.
                        </p>

                        <button 
                        className="bg-gray-800 text-white px-5 py-3 rounded-md hover:bg-gray-900"
                        onClick={() => navigate("/jobs")}
                        >
                            View Jobs
                        </button>
                    </div>

                </div>

            </main>
        </div>
    );
}