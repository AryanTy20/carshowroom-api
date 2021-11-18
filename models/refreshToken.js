import mongoose from "mongoose";

const RefreshSchema = new mongoose.Schema(
  {
    token: { type: String, unique: true },
  },
  { timestamps: false }
);

export default mongoose.model("RefreshToken", RefreshSchema, "refreshtokens");
