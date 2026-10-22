// 1. Keep your Part 1 initialization message
console.log("VisionVault Part 1 UI scaffold loaded successfully.");

// 2. Select DOM elements
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count"); // Part 2 Enhancement: Result count display

// 3. Listen for form submission
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Stop page from reloading

    const query = input.value.trim(); // Read user input[cite: 1]

    // Ignore empty or whitespace-only searches
    if (!query) return;

    // Clear previous results before fetching new ones
    results.innerHTML = "";
    if (resultCount) {
      resultCount.textContent = "Searching...";
    }

    // Build the Wikimedia Commons API request URL with encodeURIComponent[cite: 2]
    const url =
      "https://commons.wikimedia.org/w/api.php?action=query" +
      "&generator=search&gsrsearch=" + encodeURIComponent(query) + // Safely encode search terms[cite: 2]
      "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*";

    try {
      const response = await fetch(url); // Fetch data[cite: 2]

      // Check if the response was successful[cite: 2]
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);[cite: 2]
      }

      const data = await response.json(); // Parse JSON response[cite: 2]

      // Check if any results were returned
      if (!data.query || !data.query.pages) {
        if (resultCount) resultCount.textContent = `No results found for "${query}".`;
        return;
      }

      // Extract array of image items
      const items = Object.values(data.query.pages);

      // Part 2 Enhancement: Update result count text
      if (resultCount) {
        resultCount.textContent = `Showing ${items.length} results for "${query}"`;
      }

      // Render items to the DOM
      renderResults(items);
    } catch (error) {
      console.error("Error fetching images:", error);
      if (resultCount) {
        resultCount.textContent = "Failed to load results. Please try again.";
      }
    }
  });
}

// 4. Render Function: Creates cards and appends them to the results container
function renderResults(items) {
  items.forEach((item) => {
    // Skip items without image info
    if (!item.imageinfo || !item.imageinfo[0]) return;

    const imgData = item.imageinfo[0];

    // Create card container
    const card = document.createElement("article");
    card.className = "card";

    // Create clickable image wrapper link (opens high-res image in new tab)
    const link = document.createElement("a");
    link.href = imgData.descriptionurl || imgData.thumburl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    // Create image element
    const img = document.createElement("img");
    img.src = imgData.thumburl;
    img.alt = item.title.replace("File:", "");

    // Create caption element
    const caption = document.createElement("p");
    caption.textContent = item.title.replace("File:", "");

    // Assemble DOM elements
    link.appendChild(img);
    card.appendChild(link);
    card.appendChild(caption);

    // Add completed card into the results container
    results.appendChild(card);
  });
}