import { Schema, model } from "mongoose";
const schema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export const EmailOtpModel = model("EmailOtp", schema);
