import { Schema, model } from "mongoose";

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const conversationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  admin: { type: Schema.Types.ObjectId, ref: "User" },
  subject: { type: String, default: "Support Request" },
  status: { type: String, enum: ["open", "waiting", "closed"], default: "open", index: true },
  priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
  messages: [messageSchema],
  lastMessageAt: { type: Date, default: Date.now },
}, { timestamps: true });

conversationSchema.index({ user: 1, status: 1 });
conversationSchema.index({ admin: 1, status: 1 });

export const ConversationModel = model("Conversation", conversationSchema);