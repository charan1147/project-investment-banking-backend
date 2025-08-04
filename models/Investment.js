import mongoose from "mongoose";

const investmentSchema = mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  minAmount: { type: Number, required: true },
  returnRate: { type: Number, required: true },
});

const Investment=mongoose.model("Investment",investmentSchema);

export default Investment 
