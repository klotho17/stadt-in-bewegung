import { extractTopics } from "../utils/extracttopics"; //... to filter the acctual topics without persons

export const baseURL = "https://api.memobase.ch/record/advancedSearch?q=isOrWasPartOf:mbrs:soz-016+AND+hasOrHadSubject.prefLabel:";

// fetching data from the composed URLs
export async function getRecordList(topic) {
    const url = `${baseURL}${topic}&format=json&size=100`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        const data = await response.json();

        return data["hydra:member"]
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}