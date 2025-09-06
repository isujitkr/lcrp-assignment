import Load from "../models/Load.js";

const getLoads = async (req, res) => {
  try {
    const loads = await Load.find().populate("assignedTruckId");
    res.json(loads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default getLoads;
