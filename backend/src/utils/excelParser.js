import xlsx from "xlsx";
import Truck from "../models/Truck.js";
import Load from "../models/Load.js";

// Parse Excel and insert data into MongoDB
export const parseExcelAndInsert = async (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  // Delete previous data
  await Truck.deleteMany({});
  await Load.deleteMany({});

  const trucksMap = {};
  for (const row of data) {
    const { truckId, capacity, company, loadId, weight } = row;

    if (!trucksMap[truckId]) {
      const truck = await Truck.create({ truckId, capacity, company, loads: [] });
      trucksMap[truckId] = truck;
    }

    await Load.create({
      loadId,
      weight,
      assignedTruckId: null, // will be assigned later
    });
  }

  return { trucks: Object.values(trucksMap) };
};
