import { getCustomObjects } from "../utils/customobjects";
import { extractTopics } from "../utils/extracttopics";
import { yearCorrection } from "../utils/yearcorrection";

export const baseURL = "https://api.memobase.ch/record/advancedSearch?q=@id:"
// old url: "https://api.memobase.ch/record/soz-016-Sozarch_Vid_V_";
// new full url example: https://api.memobase.ch/record/advancedSearch?q=@id:mbr%3Asoz-016-Sozarch_Vid_V_001&format=json

// fetching data from the composed URLs
export async function getRecord(id) {
    // get custom objects if the ID does not start with "mbr"
    if (!id.startsWith("mbr")) {
        return getCustomObjects().find(obj => obj.id === id) || null;
    }
    // get data from the API for regular items
    const url = `${baseURL}${id}&format=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error fetching data from ${url}:`, error);
        }
        
        const data = await response.json();
        let record = data["hydra:member"] || [];
        
        console.log("Data from API", record);

        // old return of pure api data
        // return data["hydra:member"] 
        return { 
                id: record[0]["@id"], 
                title: record[0].title, 
                year: yearCorrection(record[0].created) || 0,
                topic: extractTopics(record[0].hasOrHadSubject) || "keine Angabe",
                abstract: record[0].abstract || "Beschreibung fehlt"
            }; 
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}