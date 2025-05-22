// fuction to extract the several topics from the hasOrHadSubject field

export function extractTopics(hasOrHadSubject) {
    if (!hasOrHadSubject) return ["keine Themen"]; // include "no topic" somehow
    if (Array.isArray(hasOrHadSubject)) {
        return hasOrHadSubject
            .filter(subject => subject.prefLabel)
            .map(subject => subject.prefLabel);
    }
    if (hasOrHadSubject.prefLabel) {
        return [hasOrHadSubject.prefLabel];
    }
    return [];
}
