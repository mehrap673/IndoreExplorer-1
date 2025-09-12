import { WeatherData, NewsArticle } from './types';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY || 'demo_key';
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || process.env.NEWS_API_KEY || 'demo_key';

export async function getWeatherData(): Promise<WeatherData | null> {
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

export async function getNewsData(): Promise<NewsArticle[]> {
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

export async function getWikipediaData(query: string): Promise<any> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch Wikipedia data:', error);
    return null;
  }
}
