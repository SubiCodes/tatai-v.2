import mongoose from "mongoose";

const guideSchema = new mongoose.Schema(
  {
    posterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    category: {
      type: String,
      enum: ["repair", "diy", "tool"],
      default: "repair",
    },
    title: {
      type: String,
      required: true,
    },
    coverImage: {
      type: [
        {
          publicId: String,
          url: String,
        },
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tools: {
      type: [String],
      required: false,
    },
    materials: {
      type: String,
      required: false,
    },
    stepTitles: {
      type: [String],
      required: true,
    },
    stepDescriptions: {
      type: [String],
      required: true,
    },
    stepMedias: {
      type: [
        {
          publicId: String,
          url: String,
        },
      ],
      required: true,
    },
    closingMessage: {
      type: String,
      requried: true,
    },
    links: {
      type: String,
      required: false,
    },
  },
  {
    collection: "guides",
    timestamps: true,
  }
);

const Guides = mongoose.model("guides", guideSchema);

export default Guides;
