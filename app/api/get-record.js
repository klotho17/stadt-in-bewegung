import { getCustomObjects } from "../utils/customobjects";
import { extractTopics } from "../utils/extracttopics";
import { yearCorrection } from "../utils/yearcorrection";

export const baseURL = "https://api.memobase.ch/record/advancedSearch?q=@id:"
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

        // Extract creators/contributors with their roles
        let creators = [];
        const main = record[0] || {};
        const rels = main.recordResourceOrInstantiationIsSourceOfCreationRelation;
        if (rels) {
            (Array.isArray(rels) ? rels : [rels]).forEach(rel => {
                if (rel["@type"] === "rico:CreationRelation" && rel.creationRelationHasTarget) {
                    const personName = rel.creationRelationHasTarget.name;
                    const role = rel.type === "creator" ? "Creator" : rel.name ? rel.name : "Contributor";
                    if (personName) {
                        creators.push(`${personName} (${role})`);
                    }
                }
            });
        }
        console.log("Creators", creators);

        // Extract archive link from isOrWasPartOf
        //const archive = main.isOrWasPartOf?.[0]?.hasPart?.[0]?.sameAs || null;
        const archive = main.sameAs || null;

        console.log("Archive URL:", archive);

        return {
            id: record[0]["@id"],
            title: record[0].title,
            year: yearCorrection(record[0].created) || 0,
            topic: extractTopics(record[0].hasOrHadSubject) || "keine Angabe",
            abstract: record[0].abstract || "Beschreibung fehlt",
            creators: creators.length > 0 ? creators : ["keine Angabe"],
            archive: archive || "keine Angabe",
        };
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}