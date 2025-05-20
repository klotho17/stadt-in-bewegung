import { extractTopics } from "../utils/extracttopics";
import { yearCorrection } from "../utils/yearcorrection"; //TBD

export const baseURL = "https://api.memobase.ch/record/advancedSearch?q=@id:"
// old url: "https://api.memobase.ch/record/soz-016-Sozarch_Vid_V_";
// new url: https://api.memobase.ch/record/advancedSearch?q=@id:mbr%3Asoz-016-Sozarch_Vid_V_001&format=json

// fetching data from the composed URLs
export async function getRecord(fileNumber) {
    const url = `${baseURL}${fileNumber}&format=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        const data = await response.json();

        // call function from file extracttopics.js in utils to create array of topics
        const topics = extractTopics(data.hasOrHadSubject);
        //const year = yearCorrection(data["hydra:member"][0].created.normalizedDateValue);

        //return data["hydra:member"]
        return { 
                id: fileNumber,
                apiId: data["@id"], 
                title: data["hydra:member"][0].title, 
                year: data["hydra:member"][0].created.normalizedDateValue,
                topic: topics
            };
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}