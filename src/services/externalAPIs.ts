// Simulated Weather & Maps API Services

export interface WeatherData {
  zone: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  aqi: number;
  windSpeed: number;
  condition: string;
  forecast: { hour: string; temp: number; rain: number }[];
  alerts: { type: string; severity: string; message: string }[];
}

export interface MapZone {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number;
  activeWorkers: number;
  risk: 'low' | 'medium' | 'high';
  disruptions: number;
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// --- Weather API (OpenWeatherMap-like) ---

export const getWeatherForZone = async (zone: string): Promise<WeatherData> => {
  await delay(300);
  const zoneWeather: Record<string, Partial<WeatherData>> = {
    'Koramangala': { temperature: 28, humidity: 85, rainfall: 52, aqi: 120, windSpeed: 15, condition: 'Heavy Rain' },
    'HSR Layout': { temperature: 30, humidity: 70, rainfall: 5, aqi: 95, windSpeed: 8, condition: 'Partly Cloudy' },
    'Indiranagar': { temperature: 32, humidity: 65, rainfall: 0, aqi: 110, windSpeed: 10, condition: 'Clear' },
    'Whitefield': { temperature: 47, humidity: 25, rainfall: 0, aqi: 180, windSpeed: 5, condition: 'Extreme Heat' },
    'JP Nagar': { temperature: 29, humidity: 72, rainfall: 2, aqi: 85, windSpeed: 12, condition: 'Light Drizzle' },
    'Electronic City': { temperature: 31, humidity: 68, rainfall: 0, aqi: 310, windSpeed: 3, condition: 'Hazy' },
  };

  const base = zoneWeather[zone] || { temperature: 30, humidity: 60, rainfall: 0, aqi: 100, windSpeed: 10, condition: 'Clear' };

  const forecast = Array.from({ length: 12 }, (_, i) => ({
    hour: `${(new Date().getHours() + i) % 24}:00`,
    temp: (base.temperature || 30) + Math.round(Math.random() * 4 - 2),
    rain: Math.max(0, (base.rainfall || 0) + Math.round(Math.random() * 20 - 10)),
  }));

  const alerts: { type: string; severity: string; message: string }[] = [];
  if ((base.rainfall || 0) > 40) alerts.push({ type: 'FLOOD_WARNING', severity: 'high', message: `Rainfall ${base.rainfall}mm/hr exceeds 40mm/hr threshold` });
  if ((base.temperature || 0) > 45) alerts.push({ type: 'HEAT_WARNING', severity: 'critical', message: `Temperature ${base.temperature}°C exceeds 45°C threshold` });
  if ((base.aqi || 0) > 300) alerts.push({ type: 'AQI_WARNING', severity: 'high', message: `AQI ${base.aqi} exceeds 300 threshold` });

  return { zone, ...base, forecast, alerts } as WeatherData;
};

export const getAllZoneWeather = async (): Promise<WeatherData[]> => {
  const zones = ['Koramangala', 'HSR Layout', 'Indiranagar', 'Whitefield', 'JP Nagar', 'Electronic City'];
  return Promise.all(zones.map(z => getWeatherForZone(z)));
};

// --- Maps API (Google Maps-like) ---

export const getMapZones = async (): Promise<MapZone[]> => {
  await delay(200);
  return [
    { id: 'Z001', name: 'Koramangala', center: { lat: 12.9352, lng: 77.6245 }, radius: 2.5, activeWorkers: 156, risk: 'medium', disruptions: 2 },
    { id: 'Z002', name: 'HSR Layout', center: { lat: 12.9116, lng: 77.6389 }, radius: 2.0, activeWorkers: 128, risk: 'low', disruptions: 0 },
    { id: 'Z003', name: 'Indiranagar', center: { lat: 12.9784, lng: 77.6408 }, radius: 2.0, activeWorkers: 98, risk: 'high', disruptions: 3 },
    { id: 'Z004', name: 'Whitefield', center: { lat: 12.9698, lng: 77.7500 }, radius: 3.0, activeWorkers: 187, risk: 'medium', disruptions: 1 },
    { id: 'Z005', name: 'JP Nagar', center: { lat: 12.9063, lng: 77.5857 }, radius: 2.0, activeWorkers: 112, risk: 'low', disruptions: 0 },
    { id: 'Z006', name: 'Electronic City', center: { lat: 12.8399, lng: 77.6770 }, radius: 3.5, activeWorkers: 211, risk: 'high', disruptions: 4 },
  ];
};

// --- Platform Status API ---

export interface PlatformStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: number; // percentage
  lastIncident: string;
  responseTime: number; // ms
}

export const getPlatformStatus = async (): Promise<PlatformStatus[]> => {
  await delay(200);
  return [
    { name: 'Zepto', status: 'degraded', uptime: 97.2, lastIncident: '2h ago', responseTime: 850 },
    { name: 'Blinkit', status: 'operational', uptime: 99.8, lastIncident: '3d ago', responseTime: 120 },
    { name: 'Swiggy Instamart', status: 'operational', uptime: 99.5, lastIncident: '1d ago', responseTime: 200 },
    { name: 'Zomato', status: 'operational', uptime: 99.9, lastIncident: '7d ago', responseTime: 95 },
    { name: 'Dunzo', status: 'outage', uptime: 94.1, lastIncident: 'Now', responseTime: 0 },
  ];
};
