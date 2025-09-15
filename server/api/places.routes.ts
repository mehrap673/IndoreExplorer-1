import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import { storage } from "../storage";
import { placeValidation } from "@shared/mongodb-schemas";
import { authenticateAdmin } from "../auth";
import { PlaceFromDB } from "../types/place";
import { fetchAndParseWikipediaData } from "../services/wikipedia.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const isActive = req.query.active === "false" ? false : true;
    const places = await storage.getAllPlaces(isActive);
    res.json(places);
  } catch (error) {
    console.error("Places fetch error:", error);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  const place = (await storage.getPlace(id)) as PlaceFromDB | null;
  if (!place) {
    return res.status(404).json({ error: "Place not found" });
  }

  const wikipediaData = await fetchAndParseWikipediaData(place.name);

  const mergedPlace = {
    ...place,
    wikipedia: wikipediaData || {
      title: place.name,
      summary: place.description,
      wikiUrl: null,
      imageUrl: place.imageUrl || null,
    },
  };

  res.json(mergedPlace);
});

router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const validatedData = placeValidation.parse(req.body);
    const place = await storage.createPlace(validatedData);
    res.status(201).json(place);
  } catch (error) {
    console.error("Place creation error:", error);
    res.status(400).json({ error: "Failed to create place" });
  }
});

router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const validatedData = placeValidation.partial().parse(req.body);
    const place = await storage.updatePlace(req.params.id, validatedData);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json(place);
  } catch (error) {
    console.error("Place update error:", error);
    res.status(400).json({ error: "Failed to update place" });
  }
});

router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const deleted = await storage.deletePlace(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    console.error("Place deletion error:", error);
    res.status(500).json({ error: "Failed to delete place" });
  }
});

export default router;