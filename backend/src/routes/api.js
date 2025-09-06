import express from "express";
import multer from "multer";
import { runCostCalculation, uploadExcel } from "../controllers/allocationController.js";
const upload = multer({ dest: 'uploads/' });
import truckRoutes from "../controllers/getTrucks.js";
import loadRoutes from "../controllers/getLoads.js";

const router = express.Router();

router.get("/trucks", truckRoutes);
router.get("/loads", loadRoutes);
router.post("/cost", runCostCalculation); 
router.post("/uploadExcel", upload.single("file"), uploadExcel); 


export default router;
