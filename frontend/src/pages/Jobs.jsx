import { useEffect, useState } from "react";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Status badge styling helper
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "In Progress":
      case "Applied":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Interview":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Offer":
      case "Concluded":
        return "bg-green-100 text-green-700 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/jobs")
      .then((response) => response.json())
      .then((data) => {
        setJobs(data.jobs);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);

  // Handle status update
  const handleStatusChange = async (jobId, newStatus) => {
    // 1. Update local state immediately (Optimistic UI update)
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job[0] === jobId) {
          const updatedJob = [...job];
          updatedJob[6] = newStatus; // Assuming index 6 holds the status value
          return updatedJob;
        }
        return job;
      })
    );

    // 2. Persist update to Backend API
    try {
      await fetch(`http://127.0.0.1:8000/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Status tab filtering logic
  const filteredJobs = jobs.filter((job) => {
    const company = job[1] || "";
    const position = job[2] || "";
    const location = job[3] || "";
    const status = job[6] || "Applied";

    const searchText = search.toLowerCase();

    const matchesSearch =
      company.toLowerCase().includes(searchText) ||
      position.toLowerCase().includes(searchText) ||
      location.toLowerCase().includes(searchText);

    const matchesFilter = filter === "All" || status === filter;

    return matchesSearch && matchesFilter;
  });

  // Calculate stats dynamically
  const totalJobs = jobs.length;
  const inProgressCount = jobs.filter(
    (j) => (j[6] || "Applied") === "In Progress" || (j[6] || "Applied") === "Applied"
  ).length;
  const rejectedCount = jobs.filter((j) => j[6] === "Rejected").length;
  const concludedCount = jobs.filter((j) => j[6] === "Concluded").length;

  return (
      <main className="min-h-screen bg-gray-50 p-8">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-8">List of All Jobs</h1>

        {/* Dynamic Statistics */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <p className="text-gray-500">Total</p>
            <h2 className="text-3xl font-bold mt-2">{totalJobs}</h2>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <p className="text-gray-500">Rejected</p>
            <h2 className="text-3xl font-bold mt-2">{rejectedCount}</h2>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <p className="text-gray-500">In Progress</p>
            <h2 className="text-3xl font-bold mt-2">{inProgressCount}</h2>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <p className="text-gray-500">Concluded</p>
            <h2 className="text-3xl font-bold mt-2">{concludedCount}</h2>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-3 border rounded-lg bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-6 border-b mb-6">
          {["All", "In Progress", "Rejected", "Concluded"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-3 font-medium transition-colors ${
                filter === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {tab === "All" ? "All Jobs" : tab}
            </button>
          ))}
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-5 py-4">Job Title</th>
                <th className="text-left px-5 py-4">Company</th>
                <th className="text-left px-5 py-4">Location</th>
                <th className="text-left px-5 py-4">Job Type</th>
                <th className="text-left px-5 py-4">Salary</th>
                <th className="text-left px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredJobs.map((job) => {
                const currentStatus = job[6] || "Applied";

                return (
                  <tr key={job[0]} className="border-b hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium">{job[2]}</td>
                    <td className="px-5 py-4">{job[1]}</td>
                    <td className="px-5 py-4">{job[3]}</td>
                    <td className="px-5 py-4">{job[4]}</td>
                    <td className="px-5 py-4">Rs. {job[5]}</td>
                    <td className="px-5 py-4">
                      {/* Interactive Status Dropdown Menu */}
                      <select
                        value={currentStatus}
                        onChange={(e) =>
                          handleStatusChange(job[0], e.target.value)
                        }
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border cursor-pointer outline-none transition-colors ${getStatusBadgeClass(
                          currentStatus
                        )}`}
                      >
                        <option value="Applied">Applied</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Concluded">Concluded</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredJobs.length === 0 && (
            <div className="p-10 text-center text-gray-500">No jobs found.</div>
          )}
        </div>
      </main>
  );
}

export default Jobs;