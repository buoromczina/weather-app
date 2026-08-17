# Smart Weather Monitoring & Environmental Alert System — University of Abuja

A Next.js prototype implementing the system described in the dissertation
*"Design and Implementation of a Smart Weather Monitoring and Environmental
Alert System for the University of Abuja."*

## Features

- **Live Dashboard** — real-time temperature, humidity, rainfall, pressure,
  and wind data for the University of Abuja campus, sourced from the
  [Open-Meteo](https://open-meteo.com) API (no API key required).
- **Automated Alerts** — compares live readings against configurable
  thresholds and displays low/moderate/high severity alerts.
- **Historical Trends** — 7/14/30-day temperature range and rainfall charts
  pulled from Open-Meteo's historical archive.
- **Admin Panel** — lets an administrator adjust alert thresholds
  (temperature, rainfall, wind speed, humidity).

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx           Dashboard (live conditions + alerts)
  history/page.tsx    Historical trend charts
  admin/page.tsx       Threshold configuration
  api/weather/route.ts Server route: current + 48hr forecast
  api/history/route.ts Server route: daily historical records
components/            Reusable UI (cards, alert banner, charts, nav)
lib/types.ts            Shared types, alert-evaluation logic, thresholds
lib/openMeteo.ts        Open-Meteo API integration
```

## Notes & Next Steps

This prototype uses the Open-Meteo weather API rather than physical
sensors, matching the "external data source" option discussed in Chapter 2
of the dissertation. To extend it toward the full system design:

- Replace the in-memory/localStorage threshold storage with a real
  database (e.g. PostgreSQL/MySQL) as described in Chapter 3.
- Add authenticated admin accounts and role-based access control.
- Ingest readings from physical IoT sensors (temperature, humidity, rain,
  wind) alongside the API data, as outlined in the system's scope.
- Add email/SMS notification delivery for alerts instead of dashboard-only
  display.
- Persist historical alerts and readings for reporting.

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Recharts for data visualization
- Open-Meteo REST API (forecast + historical archive)
