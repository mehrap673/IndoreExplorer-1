import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { WeatherData } from '@shared/schema';
import Layout from '@/components/Layout';

export default function WeatherPage() {
  const { data: weatherData, isLoading, error } = useQuery<WeatherData>({
    queryKey: ['/api/weather'],
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const getWeatherIcon = (condition: string) => {
    const icons: Record<string, string> = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '🌨️',
      'Mist': '🌫️',
      'Sunny': '☀️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Light Rain': '🌦️',
      'Overcast': '☁️',
      'Hot': '🌡️'
    };
    return icons[condition] || '🌤️';
  };

  if (isLoading) {
    return (
      <Layout title="Weather in Indore">
        <div className="py-20 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading weather data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Weather in Indore">
        <div className="py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Weather in Indore</h1>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-destructive">Unable to load weather data. Please try again later.</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Weather in Indore - Current Conditions & Forecast"
      description="Stay updated with current weather conditions and forecast in Indore. Plan your visit with accurate weather information and temperature updates."
    >
      <div className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">Weather in Indore</h1>
            <p className="text-xl text-muted-foreground">
              Current conditions and forecast to help you plan your visit
            </p>
          </motion.div>

          {weatherData && (
            <>
              {/* Current Weather */}
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8 text-center">
                  <div className="flex items-center justify-center mb-6">
                    <span className="text-6xl mr-4">{getWeatherIcon(weatherData.condition)}</span>
                    <div>
                      <div className="text-5xl font-bold" data-testid="text-temperature">
                        {weatherData.temperature}°C
                      </div>
                      <div className="text-xl text-muted-foreground capitalize" data-testid="text-condition">
                        {weatherData.condition}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary" data-testid="text-feels-like">
                        {weatherData.feelsLike}°C
                      </div>
                      <div className="text-sm text-muted-foreground">Feels Like</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary" data-testid="text-humidity">
                        {weatherData.humidity}%
                      </div>
                      <div className="text-sm text-muted-foreground">Humidity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary" data-testid="text-wind-speed">
                        {weatherData.windSpeed} km/h
                      </div>
                      <div className="text-sm text-muted-foreground">Wind Speed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary" data-testid="text-visibility">
                        {weatherData.visibility} km
                      </div>
                      <div className="text-sm text-muted-foreground">Visibility</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 7-Day Forecast */}
              {weatherData.forecast && weatherData.forecast.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <h2 className="text-3xl font-bold text-center mb-12">7-Day Forecast</h2>
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    {weatherData.forecast.slice(0, 7).map((day, index) => (
                      <motion.div
                        key={index}
                        className="bg-card border border-border rounded-lg p-4 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                        data-testid={`forecast-day-${index}`}
                      >
                        <div className="font-semibold mb-2 text-sm" data-testid={`forecast-day-name-${index}`}>
                          {day.day}
                        </div>
                        <div className="text-2xl mb-2">{getWeatherIcon(day.condition)}</div>
                        <div className="text-sm text-muted-foreground mb-2" data-testid={`forecast-condition-${index}`}>
                          {day.condition}
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold" data-testid={`forecast-high-${index}`}>
                            {day.high}°
                          </div>
                          <div className="text-muted-foreground text-sm" data-testid={`forecast-low-${index}`}>
                            {day.low}°
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Weather Tips */}
              <motion.div
                className="mt-16 bg-secondary p-8 rounded-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-center">Weather Tips for Indore</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl mb-3">🌡️</div>
                    <h3 className="font-semibold mb-2">Summer (April-June)</h3>
                    <p className="text-sm text-muted-foreground">
                      Hot and dry. Carry water, sunscreen, and light cotton clothing.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">🌧️</div>
                    <h3 className="font-semibold mb-2">Monsoon (July-September)</h3>
                    <p className="text-sm text-muted-foreground">
                      Heavy rainfall. Carry umbrella and waterproof clothing.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">🍃</div>
                    <h3 className="font-semibold mb-2">Winter (October-March)</h3>
                    <p className="text-sm text-muted-foreground">
                      Pleasant and cool. Perfect for sightseeing and outdoor activities.
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}