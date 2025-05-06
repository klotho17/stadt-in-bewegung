//import { fetchAllTitles } from "./jsonscript";
//import { createTreemap } from './utils/treemap';

// funcion to extract frequency of topics for the treemap from data
export function prepareTreemapData(items) {
    const topicFrequency = {};

    // Count the frequency of each topic
    items.forEach(item => {
        if (Array.isArray(item.topic) && item.topic.length > 0) { // Check if topics is a valid array
          item.topic.forEach(topic => {
            topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
          });
        }
      });

    // Convert the frequency object into an array of { name, value } objects
    return Object.entries(topicFrequency).map(([name, value]) => ({ name, value }));
} 