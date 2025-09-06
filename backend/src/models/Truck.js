import mongoose from "mongoose";
const { Schema } = mongoose;

const TruckSchema = new Schema(
  {
    truckId: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    company: { type: String, required: true },
    loads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Load" }],
  },
  { timestamps: true }
);

export default mongoose.model("Truck", TruckSchema);
