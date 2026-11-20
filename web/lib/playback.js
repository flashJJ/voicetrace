export const RATES = [0.7, 0.9, 1];
export const DEFAULT_RATE = 0.9;
export const RATE_KEY = "voicetrace:speech-rate";

export function normalizeRate(value) {
  return RATES.includes(value) ? value : DEFAULT_RATE;
}
