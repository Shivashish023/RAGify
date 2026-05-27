import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

visitorSchema.index({ organizationId: 1, email: 1 }, { unique: true });

const Visitor = mongoose.model("Visitor", visitorSchema);

export default Visitor;
