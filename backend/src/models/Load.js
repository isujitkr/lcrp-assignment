import mongoose from "mongoose";
const { Schema } = mongoose;

const LoadSchema = new Schema(
  {
    loadId: { type: String, required: true, unique: true },
    weight: { type: Number, required: true },
    assignedTruckId: { type: mongoose.Schema.Types.ObjectId, ref: "Truck" },
  },
  { timestamps: true }
);

export default mongoose.model("Load", LoadSchema);
