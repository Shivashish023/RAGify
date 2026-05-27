import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    visitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visitor",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
