"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { DailyHistoryPoint } from "@/lib/types";

export function TemperatureTrendChart({ data }: { data: DailyHistoryPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} unit="°C" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="tempMax" name="Max Temp" stroke="#dc2626" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="tempMin" name="Min Temp" stroke="#2563eb" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RainfallTrendChart({ data }: { data: DailyHistoryPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} unit="mm" />
        <Tooltip />
        <Bar dataKey="precipitationSum" name="Rainfall" fill="#0f6b4f" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
