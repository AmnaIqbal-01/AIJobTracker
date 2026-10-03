import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen bg-gray-100 p-10">
                <h2 className="text-3xl font-bold mb-2">Dashboard</h2>

                <p className="text-gray-600 mb-8">
                    Track and manage your job applications.
                </p>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Add Job */}
                    <div className="flex h-full flex-col bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <h3 className="text-xl font-semibold mb-2">Add Job</h3>
                        <p className="text-gray-600 mb-5">
                            Upload a screenshot of a job posting and let AI extract the job information.
                        </p>
                        <button
                            onClick={() => navigate("/add-job")}
                            className="mt-auto self-start bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Add Job
                        </button>
                    </div>

                    {/* View Jobs */}
                    <div className="flex h-full flex-col bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <h3 className="text-xl font-semibold mb-2">View Applications</h3>
                        <p className="text-gray-600 mb-5">
                            View all your saved job applications.
                        </p>
                        <button
                            className="mt-auto self-start bg-gray-800 text-white px-5 py-3 rounded-md hover:bg-gray-900 transition-colors"
                            onClick={() => navigate("/jobs")}
                        >
                            View Jobs
                        </button>
                    </div>
                </div>
        </main>
    );
}