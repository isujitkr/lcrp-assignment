export default function LoadAssignmentDashboard({ trucks, loads, companyCosts }) {
  const getBarColor = (percent) => {
    if (percent <= 70) return "bg-green-500";
    if (percent <= 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Trucks & Loads Dashboard</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {trucks.map((truck) => {
          const assignedLoads = loads.filter(
            (l) => String(l.assignedTruckId?._id || l.assignedTruckId) === String(truck._id)
          );
          const totalLoad = assignedLoads.reduce((sum, l) => sum + l.weight, 0);
          const utilizationPercent = Math.min((totalLoad / truck.capacity) * 100, 100);
          const unutilized = Math.max(truck.capacity - totalLoad, 0);

          return (
            <div
              key={truck._id}
              className="p-4 border rounded-xl shadow bg-white hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-semibold">{truck.truckId}</h3>
                  <p className="text-sm text-gray-500">{truck.company}</p>
                </div>
                <div className="text-sm font-medium">
                  {totalLoad} / {truck.capacity} kg
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-5 mb-2">
                <div
                  className={`${getBarColor(utilizationPercent)} h-5 rounded-full`}
                  style={{ width: `${utilizationPercent}%` }}
                ></div>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Unutilized Space: <span className="font-medium">{unutilized} kg</span>
              </p>

              <p className="text-sm text-gray-600 mb-2">
                Cost Share: <span className="font-medium">₹{Number(companyCosts[truck.company] || 0).toFixed(2)}</span>
              </p>

              <div className="text-sm text-gray-700 border-t pt-2 mt-2 max-h-40 overflow-y-auto">
                {assignedLoads.length > 0 ? (
                  assignedLoads.map((l) => (
                    <div key={l._id} className="flex justify-between border-b py-1">
                      <span>{l.loadId}</span>
                      <span>{l.weight} kg</span>
                    </div>
                  ))
                ) : (
                  <div>— No loads assigned —</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

