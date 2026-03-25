import { loadEntries, saveEntries } from "./storage.js";

export enum Mood {
  HAPPY = "happy",
  SAD = "sad",
  MOTIVATED = "motivated",
  STRESSED = "stressed",
  CALM = "calm",
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  timestamp: number;
}

export type Journal = JournalEntry[];

// Add Entry
export function addEntry(input: Omit<JournalEntry, "id" | "timestamp">): JournalEntry {
  const newEntry: JournalEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...input,
  };

  const entries = loadEntries();
  entries.push(newEntry);
  saveEntries(entries);

  return newEntry;
}

// generic find function
export function findByProperty<T>(
  list: T[],
  key: keyof T,
  value: T[keyof T]
): T | undefined {
  return list.find((item) => item[key] === value);
}


// Edit Entry
export function editEntry(
  id: string,
  updates: Partial<Omit<JournalEntry, "id" | "timestamp">>
): JournalEntry | null {
  const entries = loadEntries();

  const updatedEntries = entries.map((entry) =>
    entry.id === id ? { ...entry, ...updates } : entry
  );

  const updatedEntry = updatedEntries.find((entry) => entry.id === id) || null;

  saveEntries(updatedEntries);

  return updatedEntry;
}

// Delete Entry
export function deleteEntry(id: string): boolean {
  const entries = loadEntries();
  const filteredEntries = entries.filter((entry) => entry.id !== id);

  const wasDeleted = filteredEntries.length < entries.length;

  if (wasDeleted) {
    saveEntries(filteredEntries);
  }

  return wasDeleted;
}

// Filter by Mood
export function filterEntriesByMood(mood: Mood): Journal {
  const entries = loadEntries();
  return entries.filter((entry) => entry.mood === mood);
}