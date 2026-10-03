
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const formatSkills = (skills) => {
    if (Array.isArray(skills)) {
        return skills.filter(Boolean).join(", ") || "Not found";
    }

    if (typeof skills === "string" && skills.trim()) {
        return skills;
    }

    return "Not found";
};

function AddJob() {
    const navigate = useNavigate();

    const [jobData, setJobData] = useState(null);
    const [screenshot, setScreenshot] = useState(null);
    const [message, setMessage] = useState("");
    const [extractedText, setExtractedText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setScreenshot(file);
            setMessage("");
            setJobData(null);
            setExtractedText("");
        }
    };

    const handleUpload = async () => {
        if (!screenshot) {
            setMessage("Please select a screenshot first.");
            return;
        }

        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("screenshot", screenshot);
      // Local API URL for development; replace it with the deployed backend URL when publishing.

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/upload-job",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error("Something went wrong.");
            }

            setMessage("Job processed successfully!");
            setExtractedText(data.text);
            setJobData(data.job_data);

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Main */}
            <main className="max-w-4xl mx-auto px-6 py-10">

                <h2 className="text-3xl font-bold mb-2">
                    Add Job Application
                </h2>

                <p className="text-gray-600 mb-8">
                    Upload a screenshot of a job posting and let AI extract
                    the information.
                </p>

                {/* Upload Card */}
                <div className="bg-white rounded-lg shadow-md p-8">

                    <h3 className="text-xl font-semibold mb-4">
                        Upload Screenshot
                    </h3>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 rounded-md p-3"
                    />

                    {screenshot && (
                        <p className="text-sm text-gray-600 mt-3">
                            Selected file: {screenshot.name}
                        </p>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? "Processing..." : "Process Screenshot"}
                    </button>

                    {message && (
                        <p className="mt-4 font-medium">
                            {message}
                        </p>
                    )}

                </div>

                {/* Job Data */}
                {jobData && (
                    <div className="bg-white rounded-lg shadow-md p-8 mt-8">

                        <h3 className="text-xl font-bold mb-6">
                            Extracted Job Data
                        </h3>

                        <div className="space-y-4">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Company
                                </p>
                                <p className="font-medium">
                                    {jobData.company || "Not found"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Position
                                </p>
                                <p className="font-medium">
                                    {jobData.position || "Not found"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Location
                                </p>
                                <p className="font-medium">
                                    {jobData.location || "Not found"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Job Type
                                </p>
                                <p className="font-medium">
                                    {jobData.job_type || "Not found"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Salary
                                </p>
                                <p className="font-medium">
                                    {jobData.salary || "Not found"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Skills
                                </p>
                                <p className="font-medium">
                                    {formatSkills(jobData.skills)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Status
                                </p>

                                <span className="inline-block mt-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                    Applied
                                </span>
                            </div>

                        </div>

                        <button
                            onClick={() => navigate("/jobs")}
                            className="mt-8 bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-900"
                        >
                            View All Jobs
                        </button>

                    </div>
                )}

                {/* OCR Text */}
                {extractedText && (
                    <div className="bg-white rounded-lg shadow-md p-8 mt-8">

                        <h3 className="text-xl font-bold mb-4">
                            Extracted OCR Text
                        </h3>

                        <div className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap text-sm">
                            {extractedText}
                        </div>

                    </div>
                )}

            </main>
        </div>
    );
}

export default AddJob;

