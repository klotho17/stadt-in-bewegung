export const baseURL = "https://api.memobase.ch/record/soz-016-Sozarch_Vid_V_";

import { extractTopics } from "./extracttopics";
import { yearCorrection } from "./yearcorrection";

// custom titles for missing files to includ them in the visualisation
export const customTitles = {
    34: "Missing File 34",
    38: "Missing File 38",
    83: "Missing File 83"
};

// fetching data from the composed URLs
export async function fetchData(fileNumber) {
    const url = `${baseURL}${fileNumber}.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        const data = await response.json();

        // call function from file extracttopics.js in utils to create array of topics
        const topics = extractTopics(data.hasOrHadSubject);

        return { 
                id: fileNumber,
                apiId: data["@id"], 
                title: data.title, 
                year: data.created.normalizedDateValue, 
                topic: topics 
            };
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}

// fetching data from the JSON files
export async function fetchMetadata() {
    const fileNumbers = [];
    
    //.... add better exception handling for missing files
    // including missing files and sub-indices
    for (let i = 1; i <= 82; i++) {
        if (i === 28) {
            fileNumbers.push("028-1", "028-2", "028-3");
        } else if (i === 40) {
            fileNumbers.push("040-1", "040-2");
        } else if (i == 34 || i === 38 || i === 83) {
            continue;
        } else {
            fileNumbers.push(i.toString().padStart(3, '0'));
        }
    }

    const promises = fileNumbers.map(fileNumber => fetchData(fileNumber));
    const results = await Promise.all(promises);
    // call function from file yearcorrection.js in utils
    yearCorrection(results);

    console.log("Results structure:", results); // Log the structure of results

    // Return data instead of manipulating DOM directly
    return {
        regularItems: results.map((result, index) => ({
            fileNumber: fileNumbers[index],
            ...(result || { 
                title: "Not available", 
                id: fileNumbers[index],
                year: "Not available", 
                topic: "Not available" 
            }),
        })),
        customItems: Object.entries(customTitles).map(([fileNumber, title]) => ({
            fileNumber,
            title,
            id: fileNumber, // Use fileNumber as ID for consistency
            isCustom: true,
            year: "Not available",
            topic: "Not available"
        }))
    };
}