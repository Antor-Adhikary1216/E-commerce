import { Schema, model } from "mongoose";
const schema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    verifiedAt: { type: Date, required: true },
  },
  { timestamps: true }
);
export const EmailVerificationModel = model("EmailVerification", schema);
