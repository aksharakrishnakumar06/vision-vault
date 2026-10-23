console.log("VisionVault Part 1 UI scaffold loaded successfully.");

// DOM Elements
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-btn");
const resultsContainer = document.getElementById("results");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const categoryChips = document.querySelectorAll(".chip");

// Catch Form Submit Event
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevents page reload
    const query = input.value.trim();

    // Task 4: Ignore empty or whitespace-only searches
    if (!query) return;

    fetchAndRender(query);
  });
}

// Task 2: Fetch & Render Function
async function fetchAndRender(query) {
  // Clear old results before fetching new search
  resultsContainer.innerHTML = "";
  if (emptyState) emptyState.style.display = "none";
  if (resultCount) resultCount.textContent = `Searching for "${query}"...`;

  // Build Wikimedia Commons API Endpoint URL using encodeURIComponent
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query" +
    "&generator=search&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*";

  try {
    const response = await fetch(url);

    // Check response status
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    // Check if any results were found
    if (!data.query || !data.query.pages) {
      if (resultCount) resultCount.textContent = `No results found for "${query}".`;
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    const items = Object.values(data.query.pages);

    // Enhancement: Display result count
    if (resultCount) {
      resultCount.textContent = `Showing ${items.length} results for "${query}"`;
    }

    // Task 3: Render results into DOM
    renderResults(items);
  } catch (error) {
    console.error("Error fetching images:", error);
    if (resultCount) {
      resultCount.textContent = "Unable to fetch results. Please try again.";
    }
  }
}

// Task 3: Render function (createElement & appendChild)
function renderResults(items) {
  items.forEach((item) => {
    if (!item.imageinfo || !item.imageinfo[0]) return;

    const imgData = item.imageinfo[0];

    const card = document.createElement("article");
    card.className = "card";

    // Enhancement: Clickable link opening full image in a new tab
    const link = document.createElement("a");
    link.href = imgData.descriptionurl || imgData.thumburl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const img = document.createElement("img");
    img.src = imgData.thumburl;
    img.alt = item.title.replace("File:", "");

    const caption = document.createElement("p");
    caption.textContent = item.title.replace("File:", "");

    link.appendChild(img);
    card.appendChild(link);
    card.appendChild(caption);

    resultsContainer.appendChild(card);
  });
}

// Clear Button Event Handler
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    input.value = "";
    resultsContainer.innerHTML = "";
    if (resultCount) resultCount.textContent = "Search for images to see results.";
    if (emptyState) emptyState.style.display = "block";
  });
}

// Enhancement: Quick Topic Chips Event Handlers
categoryChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const topic = chip.textContent.trim();
    input.value = topic;
    fetchAndRender(topic);
  });
});