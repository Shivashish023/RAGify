import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    publicChatbotKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    chatbotStatus: {
      type: String,
      enum: ["active", "paused"],
      default: "active",
    },
  },
  { timestamps: true },
);

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
