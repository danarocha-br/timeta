import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines the provided CSS class values and merges them using Tailwind CSS utility classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils.ts
export const timeStringToSeconds = (timeString: string): number => {
  if (timeString.includes(':')) {
    // Handle "00:05" format
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
  } else {
    // Handle "0005" format
    const minutes = parseInt(timeString.slice(0, 2), 10);
    const seconds = parseInt(timeString.slice(2), 10);
    return minutes * 60 + seconds;
  }
};

export const secondsToTimeString = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const formatTimeForDisplay = (timeString: string): string => {
  if (timeString.includes(':')) return timeString;
  return `${timeString.slice(0, 2)}:${timeString.slice(2)}`;
};