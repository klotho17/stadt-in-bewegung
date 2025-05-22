// maybe not necessay because it's not possible to get to a page otherwise and persons are already excluded
//import { extractTopics } from "../utils/extracttopics"; //... to filter the acctual topics without persons

import { getCustomObjects } from "../utils/customobjects";
import { extractTopics } from "../utils/extracttopics";
import { yearCorrection } from "../utils/yearcorrection";

export const baseURL = "https://api.memobase.ch/record/advancedSearch?q=isOrWasPartOf:mbrs:soz-016+AND+hasOrHadSubject.prefLabel:";
export const noTopicURL = "https://api.memobase.ch/record/advancedSearch?q=isOrWasPartOf:mbrs:soz-016+AND+NOT+_exists_:hasOrHadSubject&format=json&size=100";

export async function getRecordList(topic) {
    const url = `${baseURL}${topic}&format=json&size=100`;
    try {
        // Fetch records with hasOrHadSubject.prefLabel
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
        const data = await response.json();
        let records = data["hydra:member"] || [];

        // Fetch records without topic-tags
        const noTopicResponse = await fetch(noTopicURL);
        if (noTopicResponse.ok) {
            const noTopicData = await noTopicResponse.json();
            let noTopicRecords = noTopicData["hydra:member"] || [];
            // Add custom objects to the records
            noTopicRecords = [...noTopicRecords, ...getCustomObjects()];            // mark as "no topic" - maybe not necessary
            noTopicRecords.forEach(r => r.noTopic = true);
            records = records.concat(noTopicRecords);
        }
        const objects = records.map(item => ({
                    id: item["@id"] || item.id, // e.g. "mbr:soz-016-Sozarch_Vid_V_047" and "custon..."
                    title: item.title || "Titel fehlt", // If available
                    //abstract: item.abstract || "Beschreibung fehlt",
                    year: yearCorrection(item.created) || 0,
                    topic: extractTopics(item.hasOrHadSubject) || "keine Angabe",
                }));

        return objects;
    } catch (error) {
        console.error(`Error fetching data:`, error);
        return null;
    }
}
