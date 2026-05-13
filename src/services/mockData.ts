// src/services/mockData.ts
import type { StreamPayload, LogEntry, LogSeverity } from '../models/telemetry';

// Helper: Generates a realistic fluctuating number (Random Walk)
const generateNextValue = (lastValue: number, min: number, max: number, volatility: number): number => {
  const change = (Math.random() - 0.5) * volatility;
  let newValue = lastValue + change;
  
  // Keep it within bounds
  if (newValue > max) newValue = max - (Math.random() * (volatility / 2));
  if (newValue < min) newValue = min + (Math.random() * (volatility / 2));
  
  return Number(newValue.toFixed(2));
};

// Helper: Generates realistic system logs
const generateRandomLog = (): LogEntry => {
  const severities: LogSeverity[] = ['info', 'info', 'success', 'warning', 'critical'];
  const sources = ['AuthServer', 'DB-Cluster-01', 'PaymentGateway', 'CDN-Edge', 'Firewall'];
  const messages = [
    'User authenticated successfully',
    'Database latency spike detected',
    'Cache cleared',
    'Invalid API token rejected',
    'Memory usage exceeded threshold',
    'New node joined the cluster'
  ];

  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    severity: severities[Math.floor(Math.random() * severities.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
  };
};

// Keep track of previous values to make the data curve naturally
let lastCpu = 45;
let lastMemory = 60;
let lastNetwork = 100;

export const generateTick = (): StreamPayload => {
  const now = Date.now();

  lastCpu = generateNextValue(lastCpu, 5, 98, 8);      // High volatility
  lastMemory = generateNextValue(lastMemory, 20, 90, 3); // Slow changing
  lastNetwork = generateNextValue(lastNetwork, 10, 500, 50); // Very jumpy

  // Only generate a log 15% of the time to simulate realistic traffic
  const shouldGenerateLog = Math.random() < 0.15;

  return {
    cpu: { timestamp: now, value: lastCpu },
    memory: { timestamp: now, value: lastMemory },
    network: { timestamp: now, value: lastNetwork },
    newLog: shouldGenerateLog ? generateRandomLog() : undefined
  };
};