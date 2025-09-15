import { Router } from "express";
import { storage } from "../storage";
import { foodValidation } from "@shared/mongodb-schemas";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const isActive = req.query.active === "false" ? false : true;
    const food = await storage.getAllFood(isActive);
    res.json(food);
  } catch (error) {
    console.error("Food fetch error:", error);
    res.status(500).json({ error: "Failed to fetch food items" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const food = await storage.getFood(req.params.id);
    if (!food) {
      return res.status(404).json({ error: "Food item not found" });
    }
    res.json(food);
  } catch (error) {
    console.error("Food fetch error:", error);
    res.status(500).json({ error: "Failed to fetch food item" });
  }
});

router.post("/", async (req, res) => {
  try {
    const validatedData = foodValidation.parse(req.body);
    const food = await storage.createFood(validatedData);
    res.status(201).json(food);
  } catch (error) {
    console.error("Food creation error:", error);
    res.status(400).json({ error: "Failed to create food item" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const validatedData = foodValidation.partial().parse(req.body);
    const food = await storage.updateFood(req.params.id, validatedData);
    if (!food) {
      return res.status(404).json({ error: "Food item not found" });
    }
    res.json(food);
  } catch (error) {
    console.error("Food update error:", error);
    res.status(400).json({ error: "Failed to update food item" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await storage.deleteFood(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Food item not found" });
    }
    res.json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error("Food deletion error:", error);
    res.status(500).json({ error: "Failed to delete food item" });
  }
});

export default router;