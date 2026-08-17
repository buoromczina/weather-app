import { CAMPUS_LOCATION, CurrentWeather, DailyHistoryPoint, HourlyPoint } from "./types";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";

export async function fetchCurrentAndHourly(): Promise<{
  current: CurrentWeather;
  hourly: HourlyPoint[];
}> {
  const params = new URLSearchParams({
    latitude: String(CAMPUS_LOCATION.latitude),
    longitude: String(CAMPUS_LOCATION.longitude),
    current:
      "temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code",
    hourly: "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
    forecast_days: "2",
    timezone: "Africa/Lagos",
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Open-Meteo request failed: ${res.status}`);
  }

  const data = await res.json();

  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    precipitation: data.current.precipitation,
    pressure: data.current.surface_pressure,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    weatherCode: data.current.weather_code,
    time: data.current.time,
  };

  const hourly: HourlyPoint[] = data.hourly.time.map((t: string, i: number) => ({
    time: t,
    temperature: data.hourly.temperature_2m[i],
    humidity: data.hourly.relative_humidity_2m[i],
    precipitation: data.hourly.precipitation[i],
    windSpeed: data.hourly.wind_speed_10m[i],
  }));

  return { current, hourly };
}

export async function fetchDailyHistory(days: number): Promise<DailyHistoryPoint[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const params = new URLSearchParams({
    latitude: String(CAMPUS_LOCATION.latitude),
    longitude: String(CAMPUS_LOCATION.longitude),
    start_date: fmt(start),
    end_date: fmt(end),
    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
    timezone: "Africa/Lagos",
  });

  const res = await fetch(`${ARCHIVE_URL}?${params.toString()}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Open-Meteo archive request failed: ${res.status}`);
  }

  const data = await res.json();

  const points: DailyHistoryPoint[] = data.daily.time.map((t: string, i: number) => ({
    date: t,
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    precipitationSum: data.daily.precipitation_sum[i],
  }));

  return points;
}
