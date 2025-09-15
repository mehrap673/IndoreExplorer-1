import { type WeatherData } from "@shared/schema";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "demo_key";

export async function getWeatherData(): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Indore,IN&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      console.error("Weather API error:", response.status);
      return null;
    }

    const data = await response.json();

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
      windSpeed: Math.round(data.wind.speed * 3.6),
      visibility: Math.round(data.visibility / 1000),
      feelsLike: Math.round(data.main.feels_like),
      forecast:
        forecastData?.list
          ?.slice(0, 7)
          .map((item: any, index: number) => ({
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