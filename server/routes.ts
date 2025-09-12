import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, type WeatherData, type NewsArticle } from "@shared/schema";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'demo_key';
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'demo_key';

async function getWeatherData(): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Indore,IN&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      console.error('Weather API error:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    // Get forecast data
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=Indore,IN&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    const forecastData = forecastResponse.ok ? await forecastResponse.json() : null;
    
    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      visibility: Math.round(data.visibility / 1000), // Convert m to km
      feelsLike: Math.round(data.main.feels_like),
      forecast: forecastData?.list?.slice(0, 7).map((item: any, index: number) => ({
        day: index === 0 ? 'Today' : new Date(item.dt * 1000).toLocaleDateString('en', { weekday: 'short' }),
        icon: item.weather[0].icon,
        condition: item.weather[0].main,
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
      })) || []
    };
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    return null;
  }
}

async function getNewsData(): Promise<NewsArticle[]> {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=Indore&apiKey=${NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=10`
    );
    
    if (!response.ok) {
      console.error('News API error:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    return data.articles?.map((article: any) => ({
      id: article.url,
      title: article.title,
      description: article.description,
      content: article.content,
      author: article.author || 'Unknown',
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage,
      category: 'general',
      url: article.url,
    })) || [];
  } catch (error) {
    console.error('Failed to fetch news data:', error);
    return [];
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Weather API
  app.get('/api/weather', async (req, res) => {
    try {
      const weatherData = await getWeatherData();
      
      if (!weatherData) {
        return res.status(500).json({ error: 'Failed to fetch weather data' });
      }
      
      res.json(weatherData);
    } catch (error) {
      console.error('Weather API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // News API
  app.get('/api/news', async (req, res) => {
    try {
      const newsData = await getNewsData();
      res.json(newsData);
    } catch (error) {
      console.error('News API error:', error);
      res.status(500).json({ error: 'Failed to fetch news data' });
    }
  });

  // Contact form API
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(validatedData.email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      
      // Store in database (if using database) or handle the contact message
      // await storage.insertContactMessage(validatedData);
      
      // For now, just log the contact form submission
      console.log('Contact form submission:', {
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        timestamp: new Date().toISOString()
      });
      
      res.json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
