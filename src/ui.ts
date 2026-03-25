import { Journal, JournalEntry, Mood } from "./journal.js";
import { addEntry, filterEntriesByMood } from "./journal.js";
import { loadEntries } from "./storage.js";
import { deleteEntry } from "./journal.js";


const form = document.getElementById("journal-form") as HTMLFormElement;
const titleInput = document.getElementById("title") as HTMLInputElement;
const contentInput = document.getElementById("content") as HTMLTextAreaElement;
const moodSelect = document.getElementById("mood") as HTMLSelectElement;
const entriesContainer = document.getElementById("entries") as HTMLDivElement;
const filterSelect = document.getElementById("filter-mood") as HTMLSelectElement;


// populating select dropdown dynamically
function populateMoodOptions(): void {
  Object.values(Mood).forEach((mood) => {
    const option = document.createElement("option");

    option.value = mood;
    option.textContent = mood;

    moodSelect.appendChild(option);

   
    filterSelect.appendChild(option.cloneNode(true));
  });
}

populateMoodOptions();

// Render Entries
export function renderEntries(entries: Journal): void {
  entriesContainer.innerHTML = "";

  entries.forEach((entry) => {
    const div = document.createElement("div");
    div.className = "entry-card";

    div.innerHTML = `
    <div class="entry-header">
        <h3>${entry.title}</h3>
        <button class="delete-btn" data-id="${entry.id}">✕</button>
    </div>
    <p>${entry.content}</p>
    <div class="entry-footer">
        <span data-mood="${entry.mood}">${entry.mood}</span>
        <small>${new Date(entry.timestamp).toLocaleString()}</small>
    </div>
`;

    entriesContainer.appendChild(div);
  });

  attachDeleteHandlers();
}


function attachDeleteHandlers(): void {
  const buttons = document.querySelectorAll(".delete-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = (btn as HTMLButtonElement).dataset.id;

      if (!id) return;

      deleteEntry(id);
      renderEntries(loadEntries());
    });
  });
}

// Handle Form Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newEntry = addEntry({
    title: titleInput.value,
    content: contentInput.value,
    mood: moodSelect.value as Mood,
  });

  renderEntries(loadEntries());

  form.reset();
});

// Filter Entries
filterSelect.addEventListener("change", () => {
  const value = filterSelect.value;

  if (!value) {
    renderEntries(loadEntries());
    return;
  }

  const mood = value as Mood;
  const filtered = filterEntriesByMood(mood);

  renderEntries(filtered);
});

// Initial Load
renderEntries(loadEntries());