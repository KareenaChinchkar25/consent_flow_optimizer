import UserSettings from "../models/UserSettings.js";

/**
 * GET /api/settings
 * Fetch user settings
 */
export const getSettings = async (req, res) => {
  try {
    // TEMP: hardcoded userId (replace with req.user.id after auth)
    const userId = req.user?.id || "demo-user";

    let settings = await UserSettings.findOne({ userId });

    // Create default settings if not found
    if (!settings) {
      settings = await UserSettings.create({ userId });
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

/**
 * POST /api/settings
 * Save/update user settings
 */
export const saveSettings = async (req, res) => {
  try {
    const userId = req.user?.id || "demo-user";
    const payload = req.body;

    const settings = await UserSettings.findOneAndUpdate(
      { userId },
      { ...payload, userId },
      { new: true, upsert: true }
    );

    res.status(200).json(settings);
  } catch (error) {
    console.error("Save settings error:", error);
    res.status(500).json({ message: "Failed to save settings" });
  }
};
