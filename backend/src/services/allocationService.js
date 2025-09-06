import Load from "../models/Load.js";
import Truck from "../models/Truck.js";

const allocateAndOptimize = async () => {
  const trucks = await Truck.find();
  const loads = await Load.find();

  for (const truck of trucks) {
    truck.loads = [];
    await truck.save();
  }
  for (const load of loads) {
    load.assignedTruckId = null;
    await load.save();
  }

  const sortedLoads = [...loads].sort((a, b) => b.weight - a.weight);

  const remainingCapacity = {};
  trucks.forEach((t) => (remainingCapacity[t._id] = t.capacity));

  for (const load of sortedLoads) {
    for (const truck of trucks) {
      if (remainingCapacity[truck._id] >= load.weight) {
        truck.loads.push(load._id);
        await truck.save();

        load.assignedTruckId = truck._id;
        await load.save();

        remainingCapacity[truck._id] -= load.weight;
        break;
      }
    }
  }

  return { trucks, loads };
};

const calculateCostShare = async (totalCost) => {

  const loads = await Load.find().populate("assignedTruckId");
  const totalWeight = loads.reduce((sum, l) => sum + l.weight, 0);

  const companyCosts = {};
  for (const load of loads) {
    if (load.assignedTruckId) {
      const company = load.assignedTruckId.company;
      const share = (load.weight / totalWeight) * totalCost;
      companyCosts[company] = (companyCosts[company] || 0) + share;
    }
  }

  return companyCosts;
};

export { allocateAndOptimize, calculateCostShare };
