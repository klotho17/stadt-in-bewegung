/* import { fetchAllTitles } from "./jsonscript";
import { createTreemap } from './utils/treemap';

export function prepareTreemapData(regularItems) {
    const topicFrequency = {};

    // Count the frequency of each topic
    items.forEach(regularItems => {
        if (regularItems.topic) {
            regularItems.topic.forEach(topic => {
                topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
            });
        }
    });

    // Convert the frequency object into an array of { name, value } objects
    return Object.entries(topicFrequency).map(([name, value]) => ({ name, value }));
} */