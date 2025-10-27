// Step 1: Initial array of quotes
let quotes = [
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
  `;

  document.body.appendChild(formContainer);

  const addButton = document.getElementById("add-quote-button");
  const quotesList = document.getElementById("quotes-list");

  // Function to update the displayed quotes list
  function updateQuotesList() {
    quotesList.innerHTML = ""; // Clear current list
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
    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        quotes.splice(idx, 1); // Remove from array
        updateQuotesList(); // Refresh display
      });
    });
  }

  // Add new quote on button click
  addButton.addEventListener("click", () => {
    const textInput = document.getElementById("quote-text").value.trim();
    const categoryInput = document.getElementById("quote-category").value.trim();

    if (textInput === "" || categoryInput === "") {
      alert("Please fill in both fields.");
      return;
    }

    // Add new quote to the array
    quotes.push({ text: textInput, category: categoryInput });

    // Clear input fields
    document.getElementById("quote-text").value = "";
    document.getElementById("quote-category").value = "";

    // Update the displayed list
    updateQuotesList();
  });

  // Initialize displayed list
  updateQuotesList();
}

// ✅ Single DOMContentLoaded — correct version
document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm();

  // Create the "Show New Quote" button
  const newQuoteButton = document.createElement("button");
  newQuoteButton.id = "newQuote";
  newQuoteButton.textContent = "Show New Quote";
  document.body.appendChild(newQuoteButton);

  // Add event listener
  newQuoteButton.addEventListener("click", showRandomQuote);
});
