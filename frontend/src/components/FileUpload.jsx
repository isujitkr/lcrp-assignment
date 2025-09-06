import { useState, useRef } from "react";
import API from "../api/api";
import LoadAssignmentDashboard from "./LoadAssignmentDashboard";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [loads, setLoads] = useState([]);
  const [totalCost, setTotalCost] = useState("");
  const [companyCosts, setCompanyCosts] = useState({});
  const [showAllocation, setShowAllocation] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
    return alert("File Uploaded");
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", file);

    await API.post("/uploadExcel", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const trucksRes = await API.get("/trucks");
    const loadsRes = await API.get("/loads");

    setTrucks(trucksRes.data);
    setLoads(loadsRes.data);
    setShowAllocation(true);
  };

  const handleCalculateCost = async () => {
    if (!totalCost) return alert("Enter total cost first");

    try {
      const res = await API.post("/cost", { totalCost: Number(totalCost) });
      setCompanyCosts(res.data.companyCosts);

      if (
        !res.data.companyCosts ||
        Object.keys(res.data.companyCosts).length === 0
      ) {
        alert(res.data.message || "No cost data available");
      }
    } catch (error) {
      alert("Error calculating cost. Please try again.");
      console.error(error);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTrucks([]);
    setLoads([]);
    setTotalCost("");
    setCompanyCosts({});
    setShowAllocation(false);

    // reset the file input element
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExportJSON = () => {
    const exportData = trucks.map((truck) => {
      const assignedLoads = loads
        .filter(
          (l) =>
            String(l.assignedTruckId?._id || l.assignedTruckId) ===
            String(truck._id)
        )
        .map((l) => ({ loadId: l.loadId, weight: l.weight }));

      return {
        truckId: truck.truckId,
        company: truck.company,
        capacity: truck.capacity,
        assignedLoads,
        costShare: Number(companyCosts[truck.company] || 0).toFixed(2),
      };
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logistics_report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = [
      "Truck ID",
      "Company",
      "Capacity",
      "Assigned Loads",
      "Cost Share",
    ];
    const rows = trucks.map((truck) => {
      const assignedLoads = loads
        .filter(
          (l) =>
            String(l.assignedTruckId?._id || l.assignedTruckId) ===
            String(truck._id)
        )
        .map((l) => `${l.loadId} (${l.weight}kg)`)
        .join("; ");

      return [
        truck.truckId,
        truck.company,
        truck.capacity,
        assignedLoads,
        Number(companyCosts[truck.company] || 0).toFixed(2),
      ];
    });

    let csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    );
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logistics_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Logistics Platform</h1>

      <div className="mb-6 p-6 border rounded-2xl shadow bg-white">
        <h2 className="text-lg font-semibold mb-4">Upload Excel File</h2>

        <label className="block mb-4 cursor-pointer">
          <span className="sr-only cursor-pointer">Choose File</span>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-100 file:text-blue-700
              hover:file:bg-blue-200 cursor-pointer"
          />
          {file && (
            <p className="mt-2 text-gray-600 text-sm">
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </label>

        <div className="flex gap-2">
          <button
            onClick={handleUpload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow transition cursor-pointer"
          >
            Click to view status
          </button>

          <button
            onClick={handleReset}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded-lg shadow transition cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <input
          type="number"
          placeholder="Enter total logistics cost"
          value={totalCost}
          onChange={(e) => setTotalCost(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleCalculateCost}
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Calculate Cost Share
        </button>
      </div>

      {showAllocation && trucks.length > 0 && loads.length > 0 && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleExportJSON}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 cursor-pointer"
          >
            Export JSON
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer"
          >
            Export CSV
          </button>
        </div>
      )}

      {Object.keys(companyCosts).length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Company Cost Breakdown</h2>
          <table className="table-auto border-collapse border w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-3 py-2">Company</th>
                <th className="border px-3 py-2">Cost Share (₹)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(companyCosts).map(([company, cost]) => (
                <tr key={company}>
                  <td className="border px-3 py-2">{company}</td>
                  <td className="border px-3 py-2">
                    ₹{Number(cost).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAllocation && trucks.length > 0 && loads.length > 0 && (
        <LoadAssignmentDashboard
          trucks={trucks}
          loads={loads}
          companyCosts={companyCosts}
        />
      )}
    </div>
  );
}
