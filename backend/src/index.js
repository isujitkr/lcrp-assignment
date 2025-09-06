import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import apiRoutes from './routes/api.js';
import cors from "cors";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server started on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to connect DB", err);
  });

