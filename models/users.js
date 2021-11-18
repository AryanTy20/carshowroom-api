import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, max: 20 },
    email: { type: String, required: true, unique: true, max: 30 },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    gender: { type: String, enum: ["male", "female", "other"] },
    age: { type: Number, max: 100 },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema, "users");
