import { extractTopics } from "../utils/extracttopics"; //... to filter the acctual topics without persons
import { yearCorrection } from "../utils/yearcorrection";
import { getCustomObjects } from "../utils/customobjects";

export const baseURL = "https://api.memobase.ch/record/advancedSearch?q=isOrWasPartOf:mbrs:soz-016";

// fetching data from the composed URLs
export async function getAllObjects() {
    const url = `${baseURL}&format=json&size=100`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        const data = await response.json();
        console.log("Original Data from API", data["hydra:member"]);

        // Map over hydra:member and extract relevant fields
        const objects = data["hydra:member"].map(item => ({
            id: item["@id"], // e.g. "mbr:soz-016-Sozarch_Vid_V_047"
            title: item.title || "Titel fehlt", // If available
            abstract: item.abstract || "Beschreibung fehlt",
            year: yearCorrection(item.created) || 0,
            topic: extractTopics(item.hasOrHadSubject) || "keine Angabe",
        }));

        // Add cencored objects to the result
        const allObjects = [...objects, ...getCustomObjects()];

        console.log("Adjusted and supplemented Data from API", allObjects);

        return allObjects;

    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}