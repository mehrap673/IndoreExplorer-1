import { Router } from "express";
import { storage } from "../storage";
import { settingsValidation } from "@shared/mongodb-schemas";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const settings = await storage.getAllSettings();
    res.json(settings);
  } catch (error) {
    console.error("Settings fetch error:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.get("/:key", async (req, res) => {
  try {
    const setting = await storage.getSetting(req.params.key);
    if (!setting) {
      return res.status(404).json({ error: "Setting not found" });
    }
    res.json(setting);
  } catch (error) {
    console.error("Setting fetch error:", error);
    res.status(500).json({ error: "Failed to fetch setting" });
  }
});

router.post("/", async (req, res) => {
  try {
    const validatedData = settingsValidation.parse(req.body);
    const setting = await storage.createSetting(validatedData);
    res.status(201).json(setting);
  } catch (error) {
    console.error("Setting creation error:", error);
    res.status(400).json({ error: "Failed to create setting" });
  }
});

router.put("/:key", async (req, res) => {
  try {
    const { value } = req.body;
    if (value === undefined) {
      return res.status(400).json({ error: "Setting value is required" });
    }
    const setting = await storage.updateSetting(req.params.key, value);
    if (!setting) {
      return res.status(404).json({ error: "Setting not found" });
    }
    res.json(setting);
  } catch (error) {
    console.error("Setting update error:", error);
    res.status(500).json({ error: "Failed to update setting" });
  }
});

router.delete("/:key", async (req, res) => {
  try {
    const deleted = await storage.deleteSetting(req.params.key);
    if (!deleted) {
      return res.status(404).json({ error: "Setting not found" });
    }
    res.json({ message: "Setting deleted successfully" });
  } catch (error) {
    console.error("Setting deletion error:", error);
    res.status(500).json({ error: "Failed to delete setting" });
  }
});

export default router;