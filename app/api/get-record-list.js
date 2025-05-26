import { getCustomObjects } from "../utils/customobjects";
import { extractTopics } from "../utils/extracttopics";
import { yearCorrection } from "../utils/yearcorrection";

// API URLs for records in collection "soz-016" with and certain topic
export const baseURL = "https://api.memobase.ch/record/advancedSearch?q=isOrWasPartOf:mbrs:soz-016+AND+hasOrHadSubject.prefLabel:";
// API URL for records in collection without topic-tags
export const noTopicURL = "https://api.memobase.ch/record/advancedSearch?q=isOrWasPartOf:mbrs:soz-016+AND+NOT+_exists_:hasOrHadSubject&format=json&size=100";

export async function getRecordList(topic) {
    try {
        let records = [];

        if (topic === "keine Themen") {
            // Fetch records without topic-tags
            const noTopicResponse = await fetch(noTopicURL);
            if (!noTopicResponse.ok) {
                throw new Error(`Failed to fetch data from ${noTopicURL}`);
            }

            const noTopicData = await noTopicResponse.json();
            records = noTopicData["hydra:member"] || [];
            // Add custom objects to the records-list "keine Themen"
            records = [...records, ...getCustomObjects()];
            records.forEach(r => r.noTopic = true);

        } else {
            const url = `${baseURL}${topic}&format=json&size=100`;
            // Fetch records with hasOrHadSubject.prefLabel
            const topicResponse = await fetch(url);
            if (!topicResponse.ok) {
                throw new Error(`Failed to fetch data from ${url}`);
            }

            const topicData = await topicResponse.json();
            records = topicData["hydra:member"] || [];
        }

        const objects = records.map(item => ({
            id: item["@id"] || item.id,
            title: item.title || "Titel fehlt",
            year: yearCorrection(item.created) || 0,
            topic: extractTopics(item.hasOrHadSubject) || "keine Angabe",
        }));

        return objects;
    } catch (error) {
        console.error(`Error fetching data:`, error);
        return null;
    }
}