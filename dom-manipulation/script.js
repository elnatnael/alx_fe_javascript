// Step 1: Initialize quotes (load from localStorage if available)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not take life too seriously. You will never get out of it alive.", category: "Humor" },
];

// Step 2: Function to display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    alert("No quotes available. Please add some!");
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Save last viewed quote to sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));

  let displayArea = document.getElementById("random-quote-display");
  if (!displayArea) {
    displayArea = document.createElement("div");
    displayArea.id = "random-quote-display";
    document.body.appendChild(displayArea);
  }

  displayArea.innerHTML = `<p>"${quote.text}" — <strong>${quote.category}</strong></p>`;
}

// Step 3: Function to create a form to add new quotes dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.id = "add-quote-form";

  formContainer.innerHTML = `
    <h3>Add a New Quote</h3>
    <input type="text" id="quote-text" placeholder="Quote text" /><br/><br/>
    <input type="text" id="quote-category" placeholder="Category" /><br/><br/>
    <button id="add-quote-button">Add Quote</button>
    <div id="quotes-list"></div>
    <br/>
    <button id="exportButton">Export Quotes</button>
    <input type="file" id="importFile" accept=".json" />
  `;

  document.body.appendChild(formContainer);

  const addButton = document.getElementById("add-quote-button");
  const quotesList = document.getElementById("quotes-list");

  // Update quotes list
  function updateQuotesList() {
    quotesList.innerHTML = "";
    quotes.forEach((q, index) => {
      const quoteDiv = document.createElement("div");
      quoteDiv.classList.add("quote-item");
      quoteDiv.innerHTML = `
        "${q.text}" — <strong>${q.category}</strong>
        <button data-index="${index}" class="remove-btn">Remove</button>
      `;
      quotesList.appendChild(quoteDiv);
    });

    // Add remove functionality
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        quotes.splice(idx, 1);
        localStorage.setItem("quotes", JSON.stringify(quotes)); // ✅ Save to localStorage
        updateQuotesList();
      });
    });
  }

  // Add new quote
  addButton.addEventListener("click", () => {
    const text = document.getElementById("quote-text").value.trim();
    const category = document.getElementById("quote-category").value.trim();

    if (text === "" || category === "") {
      alert("Please fill in both fields.");
      return;
    }

    quotes.push({ text, category });
    localStorage.setItem("quotes", JSON.stringify(quotes)); // ✅ Save quotes to localStorage

    document.getElementById("quote-text").value = "";
    document.getElementById("quote-category").value = "";

    updateQuotesList();
  });

  // Initialize displayed list
  updateQuotesList();
}

// Step 4: Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Step 5: Import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        localStorage.setItem("quotes", JSON.stringify(quotes)); // ✅ Save imported quotes
        alert("Quotes imported successfully!");
        location.reload(); // Refresh to update UI
      } else {
        alert("Invalid file format.");
      }
    } catch {
      alert("Error reading file.");
    }
  };
  reader.readAsText(file);
}

// ✅ Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm();

  // Create the "Show New Quote" button
  const newQuoteButton = document.createElement("button");
  newQuoteButton.id = "newQuote";
  newQuoteButton.textContent = "Show New Quote";
  document.body.appendChild(newQuoteButton);

  // Add event listener
  newQuoteButton.addEventListener("click", showRandomQuote);

  // Hook up export/import functionality
  document.getElementById("exportButton").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
});
