// funcion to extract frequency of topics for the treemap from data
export function prepareTreemapData(items, yearRange = null) {
    const topicFrequency = {};

    // Count the frequency of each topic with year filtering
    items.forEach(item => {
        // Check if item is within year range (if range is provided)
        let yearValid = true;
        if (yearRange && item.year) {
            if (Array.isArray(item.year)) {
                yearValid = item.year.some(y => y >= yearRange.from && y <= yearRange.to);
            } else {
                yearValid = item.year >= yearRange.from && item.year <= yearRange.to;
            }
        }

        if (yearValid && Array.isArray(item.topic) && item.topic.length > 0) {
            item.topic.forEach(topic => {
                topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
            });
        }
    });
    //console.log("Topic Frequency Data", topicFrequency);
    return Object.entries(topicFrequency).map(([name, value]) => ({ name, value }));
}