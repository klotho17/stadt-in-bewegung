// Base URL for the JSON files
const baseURL = "https://api.memobase.ch/record/soz-016-Sozarch_Vid_V_";

// Predefined custom titles for missing files
const customTitles = {
    38: "Custom Title for File 38",
    83: "Custom Title for File 83"
};

// Function to fetch data from a single JSON file
async function fetchData(fileNumber) {
    const url = `${baseURL}${fileNumber}.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        const data = await response.json();
        return { id: data["@id"], title: data.title }; // Return both @id and title
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}

// Function to fetch all titles and display them
async function fetchAllTitles() {
    const titlesList = document.getElementById('titles-list'); // Get the container for titles

    // Array of file numbers to fetch, including anomalies like 28-1, 28-2, etc.
    const fileNumbers = [];
    for (let i = 1; i <= 82; i++) {
        if (i === 28) {
            // Add 28-1, 28-2, 28-3
            fileNumbers.push("028-1", "028-2", "028-3");
        } else if (i === 40) {
            // Add 40-1, 40-2
            fileNumbers.push("040-1", "040-2");
        } else if (i === 38 || i === 83) {
            // Skip 38 and 83, as they are missing (handled separately)
            continue;
        } else {
            // Add regular file numbers (padded with zeros)
            fileNumbers.push(i.toString().padStart(3, '0'));
        }
    }

    // Fetch data for all file numbers
    const promises = fileNumbers.map(fileNumber => fetchData(fileNumber));
    const results = await Promise.all(promises);

    // Display the titles in the HTML
    results.forEach((result, index) => {
        if (result) {
            const listItem = document.createElement('li');
            listItem.textContent = `File ${fileNumbers[index]}: ${result.title} (ID: ${result.id})`;
            titlesList.appendChild(listItem);
        }
    });

    // Add predefined custom titles for missing files (38 and 83)
    for (const [fileNumber, title] of Object.entries(customTitles)) {
        const listItem = document.createElement('li');
        listItem.textContent = `File ${fileNumber}: ${title} (Custom Title)`;
        titlesList.appendChild(listItem);
    }
}

// Call the function to fetch and display all titles
fetchAllTitles();