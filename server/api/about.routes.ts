import { Router } from "express";
import { storage } from "../storage";
import { aboutValidation } from "@shared/mongodb-schemas";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const isActive = req.query.active === "false" ? false : true;
    const about = await storage.getAllAbout(isActive);
    res.json(about);
  } catch (error) {
    console.error("About fetch error:", error);
    res.status(500).json({ error: "Failed to fetch about sections" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const about = await storage.getAbout(req.params.id);
    if (!about) {
      return res.status(404).json({ error: "About section not found" });
    }
    res.json(about);
  } catch (error) {
    console.error("About fetch error:", error);
    res.status(500).json({ error: "Failed to fetch about section" });
  }
});

router.post("/", async (req, res) => {
  try {
    const validatedData = aboutValidation.parse(req.body);
    const about = await storage.createAbout(validatedData);
    res.status(201).json(about);
  } catch (error) {
    console.error("About creation error:", error);
    res.status(400).json({ error: "Failed to create about section" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const validatedData = aboutValidation.partial().parse(req.body);
    const about = await storage.updateAbout(req.params.id, validatedData);
    if (!about) {
      return res.status(404).json({ error: "About section not found" });
    }
    res.json(about);
  } catch (error) {
    console.error("About update error:", error);
    res.status(400).json({ error: "Failed to update about section" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await storage.deleteAbout(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "About section not found" });
    }
    res.json({ message: "About section deleted successfully" });
  } catch (error) {
    console.error("About deletion error:", error);
    res.status(500).json({ error: "Failed to delete about section" });
  }
});

export default router;