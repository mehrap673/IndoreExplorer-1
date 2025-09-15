import { Router } from "express";
import authRouter from "./auth.routes";
import placesRouter from "./places.routes";
import foodRouter from "./food.routes";
import eventsRouter from "./events.routes";
import galleryRouter from "./gallery.routes";
import aboutRouter from "./about.routes";
import contactRouter from "./contact.routes";
import settingsRouter from "./settings.routes";
import { getWeatherData } from "../services/weather.service";
import { getNewsData } from "../services/news.service";
import { seedDatabase } from "../seed-data";

const router = Router();

// Mount individual routers
router.use("/auth", authRouter);
router.use("/places", placesRouter);
router.use("/food", foodRouter);
router.use("/events", eventsRouter);
router.use("/gallery", galleryRouter);
router.use("/about", aboutRouter);
router.use("/contact", contactRouter);
router.use("/settings", settingsRouter);

// Standalone routes
router.get("/weather", async (req, res) => {
  try {
    const weatherData = await getWeatherData();
    if (!weatherData) {
      return res.status(500).json({ error: "Failed to fetch weather data" });
    }
    res.json(weatherData);
  } catch (error) {
    console.error("Weather API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/news", async (req, res) => {
  try {
    const newsData = await getNewsData();
    res.json(newsData);
  } catch (error) {
    console.error("News API error:", error);
    res.status(500).json({ error: "Failed to fetch news data" });
  }
});

router.post("/seed-database", async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res
        .status(403)
        .json({ error: "Seeding not allowed in production" });
    }
    await seedDatabase();
    res.json({ message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).json({ error: "Failed to seed database" });
  }
});

export default router;