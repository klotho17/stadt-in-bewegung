// fuction to extract the several topics from the hasOrHadSubject field

export function extractTopics(hasOrHadSubject) {
    if (!hasOrHadSubject) return [];
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



/* export function extractTopics(hasOrHadSubject) {
    if (!Array.isArray(hasOrHadSubject)) return [];

    return hasOrHadSubject
        .filter(subject => subject.prefLabel) // Only prefLabel in hasOrHadSubject and ignore persons
        .map(subject => subject.prefLabel); // Return an array of topics
} */