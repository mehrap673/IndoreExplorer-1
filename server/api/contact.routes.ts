import { Router } from "express";
import { storage } from "../storage";
import { contactMessageValidation } from "@shared/mongodb-schemas";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const messages = await storage.getAllContactMessages();
    res.json(messages);
  } catch (error) {
    console.error("Contact messages fetch error:", error);
    res.status(500).json({ error: "Failed to fetch contact messages" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const message = await storage.getContactMessage(req.params.id);
    if (!message) {
      return res.status(404).json({ error: "Contact message not found" });
    }
    res.json(message);
  } catch (error) {
    console.error("Contact message fetch error:", error);
    res.status(500).json({ error: "Failed to fetch contact message" });
  }
});

router.post("/", async (req, res) => {
  try {
    const validatedData = contactMessageValidation.parse(req.body);
    const message = await storage.createContactMessage(validatedData);
    res
      .status(201)
      .json({ message: "Message sent successfully", id: message._id });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(400).json({ error: "Failed to send message" });
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    const updated = await storage.markMessageAsRead(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: "Contact message not found" });
    }
    res.json({ message: "Message marked as read" });
  } catch (error) {
    console.error("Contact message update error:", error);
    res.status(500).json({ error: "Failed to update message status" });
  }
});

router.patch("/:id/reply", async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) {
      return res.status(400).json({ error: "Reply content is required" });
    }

    const updated = await storage.replyToMessage(req.params.id, reply);
    if (!updated) {
      return res.status(404).json({ error: "Contact message not found" });
    }
    res.json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("Contact reply error:", error);
    res.status(500).json({ error: "Failed to send reply" });
  }
});

export default router;