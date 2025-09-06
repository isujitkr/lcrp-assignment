
import Truck from "../models/Truck.js";

const getTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find().populate("loads");
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default getTrucks;
