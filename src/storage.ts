import { Journal } from "./journal";

// Load entries from localStorage
export function loadEntries(): Journal {
  const data = localStorage.getItem("journal");

  if (!data) {
    return [];
  }

  try {
    const parsed = JSON.parse(data) as Journal;
    return parsed;
  } catch (error) {
    console.error("Failed to parse journal data:", error);
    return [];
  }
}

// Save entries to localStorage
export function saveEntries(entries: Journal): void {
  localStorage.setItem("journal", JSON.stringify(entries));
}