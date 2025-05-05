// fuction to extract the several topics from the hasOrHadSubject field
export function extractTopics(hasOrHadSubject) {
    if (!Array.isArray(hasOrHadSubject)) return [];

    return hasOrHadSubject
        .filter(subject => subject.prefLabel) // Only prefLabel in hasOrHadSubject and ignore persons
        .map(subject => subject.prefLabel); // Return an array of topics
}

// yet unused - maping the topics to generate structured map or list
/* const topicMap = {};
titles.regularItems.forEach(item => {
    if (item.topic) {
        item.topic.forEach(topic => {
            if (!topicMap[topic]) {
                topicMap[topic] = [];
            }
            topicMap[topic].push(item);
        });
    }
}); */