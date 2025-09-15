import { Router } from "express";
import { storage } from "../storage";
import { galleryValidation } from "@shared/mongodb-schemas";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const isActive = req.query.active === "false" ? false : true;
    const gallery = await storage.getAllGallery(isActive);
    res.json(gallery);
  } catch (error) {
    console.error("Gallery fetch error:", error);
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await storage.getGalleryItem(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Gallery item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error("Gallery fetch error:", error);
    res.status(500).json({ error: "Failed to fetch gallery item" });
  }
});

router.post("/", async (req, res) => {
  try {
    const validatedData = galleryValidation.parse(req.body);
    const item = await storage.createGalleryItem(validatedData);
    res.status(201).json(item);
  } catch (error) {
    console.error("Gallery creation error:", error);
    res.status(400).json({ error: "Failed to create gallery item" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const validatedData = galleryValidation.partial().parse(req.body);
    const item = await storage.updateGalleryItem(
      req.params.id,
      validatedData
    );
    if (!item) {
      return res.status(404).json({ error: "Gallery item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error("Gallery update error:", error);
    res.status(400).json({ error: "Failed to update gallery item" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await storage.deleteGalleryItem(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Gallery item not found" });
    }
    res.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    console.error("Gallery deletion error:", error);
    res.status(500).json({ error: "Failed to delete gallery item" });
  }
});

export default router;