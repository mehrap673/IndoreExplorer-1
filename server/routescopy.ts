import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  placeValidation,
  foodValidation,
  eventValidation,
  galleryValidation,
  aboutValidation,
  contactMessageValidation,
  settingsValidation,
  adminUserValidation,
} from "@shared/mongodb-schemas";
import { type WeatherData, type NewsArticle } from "@shared/schema";
import {
  authenticateAdmin,
  requireSuperAdmin,
  loginAdmin,
  registerFirstAdmin,
  type AuthRequest,
} from "./auth";
import { seedDatabase } from "./seed-data";
import { PlaceFromDB, MergedPlace, WikipediaSummary } from "./types/place";
import { Types } from "mongoose";
import * as cheerio from "cheerio"; // 1. Import cheerio

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "demo_key";
const NEWS_API_KEY = process.env.NEWS_API_KEY || "demo_key";

async function getWeatherData(): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Indore,IN&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      console.error("Weather API error:", response.status);
      return null;
    }

    const data = await response.json();

    // Get forecast data
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=Indore,IN&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    const forecastData = forecastResponse.ok
      ? await forecastResponse.json()
      : null;

    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      visibility: Math.round(data.visibility / 1000), // Convert m to km
      feelsLike: Math.round(data.main.feels_like),
      forecast:
        forecastData?.list?.slice(0, 7).map((item: any, index: number) => ({
          day:
            index === 0
              ? "Today"
              : new Date(item.dt * 1000).toLocaleDateString("en", {
                  weekday: "short",
                }),
          icon: item.weather[0].icon,
          condition: item.weather[0].main,
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
        })) || [],
    };
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return null;
  }
}

async function getNewsData(): Promise<NewsArticle[]> {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=Indore&apiKey=${NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=10`
    );

    if (!response.ok) {
      console.error("News API error:", response.status);
      return [];
    }

    const data = await response.json();

    return (
      data.articles?.map((article: any) => ({
        id: article.url,
        title: article.title,
        description: article.description,
        content: article.content,
        author: article.author || "Unknown",
        publishedAt: article.publishedAt,
        urlToImage: article.urlToImage,
        category: "general",
        url: article.url,
      })) || []
    );
  } catch (error) {
    console.error("Failed to fetch news data:", error);
    return [];
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ==== AUTHENTICATION ROUTES ====
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      const result = await loginAdmin(username, password);
      res.json(result);
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/register-first-admin", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: "Username, email, and password are required" });
      }

      const result = await registerFirstAdmin({ username, email, password });
      res.json(result);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({
        error: error instanceof Error ? error.message : "Registration failed",
      });
    }
  });

  app.get("/api/auth/verify", authenticateAdmin, (req: AuthRequest, res) => {
    res.json({ user: req.adminUser });
  });

  app.post("/api/auth/logout", authenticateAdmin, (req, res) => {
    // With JWT, logout is handled client-side by removing the token
    res.json({ message: "Logged out successfully" });
  });

  // Seed database endpoint (development only)
  app.post("/api/seed-database", async (req, res) => {
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

  // Weather API
  app.get("/api/weather", async (req, res) => {
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

  // News API
  app.get("/api/news", async (req, res) => {
    try {
      const newsData = await getNewsData();
      res.json(newsData);
    } catch (error) {
      console.error("News API error:", error);
      res.status(500).json({ error: "Failed to fetch news data" });
    }
  });

  // ==== PLACES API ENDPOINTS ====
  // Public endpoint for fetching active places
  app.get("/api/places", async (req, res) => {
    try {
      const isActive = req.query.active === "false" ? false : true;
      const places = await storage.getAllPlaces(isActive);
      res.json(places);
    } catch (error) {
      console.error("Places fetch error:", error);
      res.status(500).json({ error: "Failed to fetch places" });
    }
  });

  // Define the interface for the detailed Wikipedia Parse API response
  interface WikipediaParseResponse {
    parse?: {
      title?: string;
      text?: {
        "*"?: string; // This property contains the full page HTML
      };
    };
  }

  interface WikipediaQueryResponse {
    query: {
      pages: {
        [pageId: string]: {
          pageid?: number;
          title: string;
          extract?: string;
          thumbnail?: {
            source: string;
            width: number;
            height: number;
          };
        };
      };
    };
  }
  // Your other interfaces (PlaceFromDB, MergedPlace, etc.)

  // --- Helper function to convert strings to camelCase ---
  const toCamelCase = (str: string): string => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, "");
  };

  // --- The main extraction logic ---
  const extractWikipediaData = (html: string, title: string) => {
    const $ = cheerio.load(html);

    // 1. Extract Summary and Aliases from the first paragraph
    const firstParagraph = $(".mw-parser-output > p").first();
    const summary = firstParagraph
      .text()
      .replace(/\s*\[\d+\]\s*/g, "")
      .trim();
    const aliases = firstParagraph
      .find("b")
      .slice(1)
      .map((i, el) => $(el).text())
      .get();

    // 2. Extract Infobox Data
    const infobox: { [key: string]: any } = {};
    $(".infobox.vcard tr").each((_, element) => {
      const labelEl = $(element).find("th");
      const dataEl = $(element).find("td");
      if (labelEl.length && dataEl.length) {
        const label = labelEl.text().trim();
        const value = dataEl
          .text()
          .replace(/\s*\[\d+\]\s*/g, "")
          .trim();
        infobox[toCamelCase(label)] = value;
      }
    });

    // 3. Extract Main Image URL from Infobox
    let imageUrl: string | null = null;
    const imageSrc = $(".infobox.vcard .infobox-image img").attr("src");
    if (imageSrc) {
      // Convert thumbnail URL to full-size URL
      imageUrl =
        "https:" +
        imageSrc
          .replace(/\/thumb\//, "/")
          .split("/")
          .slice(0, -1)
          .join("/");
    }

    // 4. Extract Gallery Images
    const gallery: { caption: string; imageUrl: string }[] = [];
    $("ul.gallery li.gallerybox").each((_, element) => {
      const caption = $(element).find(".gallerytext").text().trim();
      const imgSrc = $(element).find("img").attr("src");
      if (imgSrc) {
        const fullUrl =
          "https:" +
          imgSrc
            .replace(/\/thumb\//, "/")
            .split("/")
            .slice(0, -1)
            .join("/");
        gallery.push({ caption, imageUrl: fullUrl });
      }
    });

    // Construct the final JSON object
    return {
      title,
      aliases,
      summary,
      imageUrl,
      infobox: Object.keys(infobox).length > 0 ? infobox : null,
      gallery: gallery.length > 0 ? gallery : null,
    };
  };

  // --- The API Route ---
  app.get("/api/places/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const place = (await storage.getPlace(id)) as PlaceFromDB | null;
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    let wikipediaData: any = null; // To hold our extracted data

    try {
      const wikiTitle = encodeURIComponent(place.name);
      // Use action=parse to get the full HTML content
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${wikiTitle}&prop=text&origin=*&redirects=1`;

      const response = await fetch(wikiUrl);
      if (response.ok) {
        const wikiApiResponse = await response.json();
        if (wikiApiResponse.parse?.text?.["*"]) {
          const rawHtml = wikiApiResponse.parse.text["*"];
          const pageTitle = wikiApiResponse.parse.title;
          const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
            pageTitle
          )}`;

          // Use our new function to parse the HTML and get structured data
          const extractedData = extractWikipediaData(rawHtml, pageTitle);

          wikipediaData = {
            ...extractedData,
            wikiUrl: pageUrl,
          };
        }
      }
    } catch (err) {
      console.warn(
        "Wikipedia fetch and parse failed for place:",
        place.name,
        err
      );
    }

    // Merge database info with the newly scraped Wikipedia data
    const mergedPlace = {
      ...place, // Your original place data from the DB
      wikipedia: wikipediaData || {
        // Fallback if scraping fails
        title: place.name,
        extract: place.description,
        wikiUrl: null,
        wikiImage: place.imageUrl || null,
      },
    };

    res.json(mergedPlace);
  });

  // Admin endpoint for creating places
  app.post("/api/places", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = placeValidation.parse(req.body);
      const place = await storage.createPlace(validatedData);
      res.status(201).json(place);
    } catch (error) {
      console.error("Place creation error:", error);
      res.status(400).json({ error: "Failed to create place" });
    }
  });

  // Admin endpoint for updating places
  app.put("/api/places/:id", authenticateAdmin, async (req, res) => {
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

  // Admin endpoint for deleting places
  app.delete("/api/places/:id", authenticateAdmin, async (req, res) => {
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

  // ==== FOOD API ENDPOINTS ====
  app.get("/api/food", async (req, res) => {
    try {
      const isActive = req.query.active === "false" ? false : true;
      const food = await storage.getAllFood(isActive);
      res.json(food);
    } catch (error) {
      console.error("Food fetch error:", error);
      res.status(500).json({ error: "Failed to fetch food items" });
    }
  });

  app.get("/api/food/:id", async (req, res) => {
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

  app.post("/api/food", async (req, res) => {
    try {
      const validatedData = foodValidation.parse(req.body);
      const food = await storage.createFood(validatedData);
      res.status(201).json(food);
    } catch (error) {
      console.error("Food creation error:", error);
      res.status(400).json({ error: "Failed to create food item" });
    }
  });

  app.put("/api/food/:id", async (req, res) => {
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

  app.delete("/api/food/:id", async (req, res) => {
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

  // ==== EVENTS API ENDPOINTS ====
  app.get("/api/events", async (req, res) => {
    try {
      const isActive = req.query.active === "false" ? false : true;
      const events = await storage.getAllEvents(isActive);
      res.json(events);
    } catch (error) {
      console.error("Events fetch error:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
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

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = eventValidation.parse(req.body);
      // Convert date strings to Date objects for MongoDB
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

  app.put("/api/events/:id", async (req, res) => {
    try {
      const validatedData = eventValidation.partial().parse(req.body);
      // Convert date strings to Date objects for MongoDB
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

  app.delete("/api/events/:id", async (req, res) => {
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

  // ==== GALLERY API ENDPOINTS ====
  app.get("/api/gallery", async (req, res) => {
    try {
      const isActive = req.query.active === "false" ? false : true;
      const gallery = await storage.getAllGallery(isActive);
      res.json(gallery);
    } catch (error) {
      console.error("Gallery fetch error:", error);
      res.status(500).json({ error: "Failed to fetch gallery" });
    }
  });

  app.get("/api/gallery/:id", async (req, res) => {
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

  app.post("/api/gallery", async (req, res) => {
    try {
      const validatedData = galleryValidation.parse(req.body);
      const item = await storage.createGalleryItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      console.error("Gallery creation error:", error);
      res.status(400).json({ error: "Failed to create gallery item" });
    }
  });

  app.put("/api/gallery/:id", async (req, res) => {
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

  app.delete("/api/gallery/:id", async (req, res) => {
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

  // ==== ABOUT API ENDPOINTS ====
  app.get("/api/about", async (req, res) => {
    try {
      const isActive = req.query.active === "false" ? false : true;
      const about = await storage.getAllAbout(isActive);
      res.json(about);
    } catch (error) {
      console.error("About fetch error:", error);
      res.status(500).json({ error: "Failed to fetch about sections" });
    }
  });

  app.get("/api/about/:id", async (req, res) => {
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

  app.post("/api/about", async (req, res) => {
    try {
      const validatedData = aboutValidation.parse(req.body);
      const about = await storage.createAbout(validatedData);
      res.status(201).json(about);
    } catch (error) {
      console.error("About creation error:", error);
      res.status(400).json({ error: "Failed to create about section" });
    }
  });

  app.put("/api/about/:id", async (req, res) => {
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

  app.delete("/api/about/:id", async (req, res) => {
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

  // ==== CONTACT MESSAGES API ENDPOINTS ====
  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Contact messages fetch error:", error);
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });

  app.get("/api/contact/:id", async (req, res) => {
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

  app.post("/api/contact", async (req, res) => {
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

  app.patch("/api/contact/:id/read", async (req, res) => {
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

  app.patch("/api/contact/:id/reply", async (req, res) => {
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

  // ==== SETTINGS API ENDPOINTS ====
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      console.error("Settings fetch error:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
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

  app.post("/api/settings", async (req, res) => {
    try {
      const validatedData = settingsValidation.parse(req.body);
      const setting = await storage.createSetting(validatedData);
      res.status(201).json(setting);
    } catch (error) {
      console.error("Setting creation error:", error);
      res.status(400).json({ error: "Failed to create setting" });
    }
  });

  app.put("/api/settings/:key", async (req, res) => {
    try {
      const { value } = req.body;
      if (!value) {
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

  app.delete("/api/settings/:key", async (req, res) => {
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

  const httpServer = createServer(app);

  return httpServer;
}
