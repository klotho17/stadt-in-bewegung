// utils/jsonDataFetcher.js (or place in your page directory)
export const baseURL = "https://api.memobase.ch/record/soz-016-Sozarch_Vid_V_";

export const customTitles = {
    38: "Custom Title for File 38",
    83: "Custom Title for File 83"
};

export async function fetchData(fileNumber) {
    const url = `${baseURL}${fileNumber}.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        const data = await response.json();
        return { id: data["@id"], title: data.title };
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}

export async function fetchAllTitles() {
    const fileNumbers = [];
    
    for (let i = 1; i <= 82; i++) {
        if (i === 28) {
            fileNumbers.push("028-1", "028-2", "028-3");
        } else if (i === 40) {
            fileNumbers.push("040-1", "040-2");
        } else if (i === 38 || i === 83) {
            continue;
        } else {
            fileNumbers.push(i.toString().padStart(3, '0'));
        }
    }

    const promises = fileNumbers.map(fileNumber => fetchData(fileNumber));
    const results = await Promise.all(promises);
    
    // Return data instead of manipulating DOM directly
    return {
        regularItems: results.map((result, index) => ({
            fileNumber: fileNumbers[index],
            ...(result || { title: "Not available", id: "N/A" })
        })),
        customItems: Object.entries(customTitles).map(([fileNumber, title]) => ({
            fileNumber,
            title,
            id: "Custom",
            isCustom: true
        }))
    };
}