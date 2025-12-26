import mongoose from "mongoose";

const UserSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },

    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system"
    },

    language: {
      type: String,
      default: "en"
    },

    blockHighRisk: {
      type: Boolean,
      default: true
    },

    notifications: {
      highRisk: { type: Boolean, default: true },
      newPermission: { type: Boolean, default: true },
      reminders: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

export default mongoose.model("UserSettings", UserSettingsSchema);
