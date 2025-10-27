// Step 1: Load quotes from localStorage or start with defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not take life too seriously. You will never get out of it alive.", category: "Humor" },
];

// Step 2: Display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    alert("No quotes available. Please add some!");
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const displayArea = document.getElementById("quoteDisplay");

  displayArea.innerHTML = `<p>"${quote.text}" — <strong>${quote.category}</strong></p>`;

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Step 3: Create a form to add new quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById("add-quote-form");
  formContainer.innerHTML = `
    <h3>Add a New Quote</h3>
    <input type="text" id="quote-text" placeholder="Quote text" /><br/><br/>
    <input type="text" id="quote-category" placeholder="Category" /><br/><br/>
    <button id="add-quote-button">Add Quote</button>
    <div id="quotes-list"></div>
  `;

  const addButton = document.getElementById("add-quote-button");
  const quotesList = document.getElementById("quotes-list");

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

    // Remove quote
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        quotes.splice(idx, 1);
        localStorage.setItem("quotes", JSON.stringify(quotes));
        updateQuotesList();
        populateCategories();
      });
    });
  }

  // Add new quote
  addButton.addEventListener("click", () => {
    const textInput = document.getElementById("quote-text").value.trim();
    const categoryInput = document.getElementById("quote-category").value.trim();

    if (textInput === "" || categoryInput === "") {
      alert("Please fill in both fields.");
      return;
    }

    quotes.push({ text: textInput, category: categoryInput });
    localStorage.setItem("quotes", JSON.stringify(quotes));
    document.getElementById("quote-text").value = "";
    document.getElementById("quote-category").value = "";

    updateQuotesList();
    populateCategories();
  });

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
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        localStorage.setItem("quotes", JSON.stringify(quotes));
        createAddQuoteForm();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch {
      alert("Error reading file.");
    }
  };
  reader.readAsText(file);
}

// Step 6: Populate categories in dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map((quote) => quote.category))];

  categoryFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categoryFilter.appendChild(allOption);

  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuote();
  }

  // Save category change
  categoryFilter.addEventListener("change", () => {
    localStorage.setItem("selectedCategory", categoryFilter.value);
    filterQuote();
  });
}

// Step 7: Filter and display quotes by selected category
function filterQuote() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  const displayArea = document.getElementById("quoteDisplay");

  if (selectedCategory === "all") {
    displayArea.innerHTML = quotes
      .map((q) => `<p>"${q.text}" — <strong>${q.category}</strong></p>`)
      .join("");
  } else {
    const filteredQuotes = quotes.filter(
      (q) => q.category === selectedCategory
    );
    if (filteredQuotes.length === 0) {
      displayArea.innerHTML = `<p>No quotes available for <strong>${selectedCategory}</strong>.</p>`;
    } else {
      displayArea.innerHTML = filteredQuotes
        .map((q) => `<p>"${q.text}" — <strong>${q.category}</strong></p>`)
        .join("");
    }
  }
}

// Step 8: Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm();
  populateCategories();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);
  document.getElementById("importQuotes").addEventListener("change", importFromJsonFile);

  // Restore last viewed quote
  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    const displayArea = document.getElementById("quoteDisplay");
    displayArea.innerHTML = `<p>"${quote.text}" — <strong>${quote.category}</strong></p>`;
  }
});
