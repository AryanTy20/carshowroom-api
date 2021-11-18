import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, max: 30 },
    type: { type: String, required: true, max: 30 },
    model: { type: String, required: true, max: 30 },
    engine: { type: String, required: true, max: 30 },
    seats: { type: Number, required: true, max: 10 },
    gear: { type: String, required: true, enum: ["automatic", "manual"] },
    fuel: {
      type: String,
      required: true,
      enum: ["petrol", "desile", "electric"],
    },
    price: { type: Number, required: true, max: 1000000000 },
    colors: { type: Array, required: true, max: 10 },
    images: { type: Array, required: true, max: 10, null: false },
  },
  { timestamps: true }
);

export default mongoose.model("Products", ProductSchema, "products");
