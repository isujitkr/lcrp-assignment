import {
  allocateAndOptimize,
  calculateCostShare,
} from "../services/allocationService.js";
import { parseExcelAndInsert } from "../utils/excelParser.js";

export const runCostCalculation = async (req, res) => {
  try {
    const { totalCost } = req.body;
    if (!totalCost)
      return res.status(400).json({ error: "totalCost required" });

    const companyCosts = await calculateCostShare(totalCost);

    if (!companyCosts || Object.keys(companyCosts).length === 0) {
      return res.json({ message: "No cost data available", companyCosts });
    }
    return res.status(200).json({ message: "Cost calculation complete", companyCosts });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    await parseExcelAndInsert(filePath);

    await allocateAndOptimize(); 

    return res.status(200).json({ message: "Excel processed and allocation done" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
