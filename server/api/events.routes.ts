import { Router } from "express";
import { storage } from "../storage";
import { eventValidation } from "@shared/mongodb-schemas";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const isActive = req.query.active === "false" ? false : true;
    const events = await storage.getAllEvents(isActive);
    res.json(events);
  } catch (error) {
    console.error("Events fetch error:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await storage.getEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Event fetch error:", error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

router.post("/", async (req, res) => {
  try {
    const validatedData = eventValidation.parse(req.body);
    const eventData = {
      ...validatedData,
      date:
        typeof validatedData.date === "string"
          ? new Date(validatedData.date)
          : validatedData.date,
      endDate: validatedData.endDate
        ? typeof validatedData.endDate === "string"
          ? new Date(validatedData.endDate)
          : validatedData.endDate
        : undefined,
    };
    const event = await storage.createEvent(eventData);
    res.status(201).json(event);
  } catch (error) {
    console.error("Event creation error:", error);
    res.status(400).json({ error: "Failed to create event" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const validatedData = eventValidation.partial().parse(req.body);
    const eventData: any = { ...validatedData };
    if (validatedData.date) {
      eventData.date =
        typeof validatedData.date === "string"
          ? new Date(validatedData.date)
          : validatedData.date;
    }
    if (validatedData.endDate) {
      eventData.endDate =
        typeof validatedData.endDate === "string"
          ? new Date(validatedData.endDate)
          : validatedData.endDate;
    }
    const event = await storage.updateEvent(req.params.id, eventData);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Event update error:", error);
    res.status(400).json({ error: "Failed to update event" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await storage.deleteEvent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Event deletion error:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;