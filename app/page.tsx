"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CurrentWeather,
  HourlyPoint,
  ThresholdConfig,
  DEFAULT_THRESHOLDS,
  CAMPUS_LOCATION,
  weatherCodeToDescription,
  evaluateAlerts,
} from "@/lib/types";
import AlertBanner from "@/components/AlertBanner";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const THRESHOLD_KEY = "uniabuja-weather-thresholds";

const STATS: {
  key: keyof CurrentWeather;
  label: string;
  unit: string;
  format: (v: number) => string;
}[] = [
  { key: "humidity", label: "Humidity", unit: "%", format: (v) => v.toFixed(0) },
  { key: "precipitation", label: "Rain, last hr", unit: "mm", format: (v) => v.toFixed(1) },
  { key: "windSpeed", label: "Wind speed", unit: "km/h", format: (v) => v.toFixed(1) },
  { key: "pressure", label: "Pressure", unit: "hPa", format: (v) => v.toFixed(0) },
];

export default function DashboardPage() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [hourly, setHourly] = useState<HourlyPoint[]>([]);
  const [thresholds, setThresholds] = useState<ThresholdConfig>(DEFAULT_THRESHOLDS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(THRESHOLD_KEY);
    if (stored) {
      try {
        setThresholds(JSON.parse(stored));
      } catch {
        // ignore malformed local storage value
      }
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/weather");
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setCurrent(data.current);
      setHourly(data.hourly);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError("Could not load live weather data. Retrying shortly...");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 5 * 60 * 1000); // refresh every 5 minutes
    return () => clearInterval(interval);
  }, [load]);

  const alerts = current ? evaluateAlerts(current, thresholds) : [];

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {loading && !current ? (
        <div className="text-slate-400 text-sm">Loading weather data…</div>
      ) : current ? (
        <>
          {/* Hero */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl sm:text-5xl shrink-0" aria-hidden="true">
                🌦️
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-semibold text-slate-800 leading-none">
                  {current.temperature.toFixed(0)}
                  <span className="text-base font-normal text-slate-400">°C</span>
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {weatherCodeToDescription(current.weatherCode)}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-400 flex sm:flex-col items-center sm:items-end justify-between gap-2 sm:gap-1">
              <div>
                <p>{CAMPUS_LOCATION.name}</p>
                {lastUpdated && <p>Updated {lastUpdated}</p>}
              </div>
              <button
                onClick={load}
                className="px-3 py-1.5 rounded-md bg-campus-500 text-white text-xs font-medium hover:bg-campus-600 shrink-0"
              >
                Refresh
              </button>
            </div>
          </section>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <AlertBanner alerts={alerts} />

          {/* Stats: 2 columns on mobile, 4 on larger screens */}
          <section>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
              Current conditions
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {STATS.map((stat) => (
                <div
                  key={stat.key}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 sm:p-4 flex flex-col gap-1"
                >
                  <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                  <span className="text-lg sm:text-xl font-semibold text-slate-800">
                    {stat.format(current[stat.key] as number)}
                    <span className="text-xs font-normal text-slate-400 ml-1">
                      {stat.unit}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 sm:p-4">
            <h3 className="text-sm font-semibold text-slate-600 mb-3">Next 48 hours</h3>
            <div className="h-[220px] sm:h-[260px] -ml-2 sm:ml-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourly} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f0" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(t) => t.slice(11, 16)}
                    minTickGap={24}
                  />
                  <YAxis tick={{ fontSize: 11 }} unit="°C" width={36} />
                  <Tooltip labelFormatter={(t) => new Date(t as string).toLocaleString()} />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#0f6b4f"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
