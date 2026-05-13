// src/models/telemetry.ts

export type LogSeverity = 'info' | 'success' | 'warning' | 'critical';

// Used for Line/Area/Bar charts (e.g., CPU, Memory, Stock Price)
export interface MetricPoint {
  timestamp: number; // Unix timestamp for precise charting
  value: number;
}

// Used for the Real-Time Activity Feed/Table
export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  severity: LogSeverity;
  source: string;
}

// The overall payload we expect from our "WebSocket"
export interface StreamPayload {
  cpu: MetricPoint;
  memory: MetricPoint;
  network: MetricPoint;
  newLog?: LogEntry; // Logs don't happen every tick, so this is optional
}