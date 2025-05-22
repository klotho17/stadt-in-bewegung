import { fetchImage } from "./imageurl";

// Helper to get a random item for a topic in the year range
function getRandomItem(items, topic, from, to) {
  const filtered = items.filter(item =>
    Array.isArray(item.topic) && item.topic.includes(topic) &&
    item.year && item.year.some(y => y >= from && y <= to)
  );
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// Main function: returns { topicName: imageUrl, ... }
export async function getTreemapImages(items, topics, from, to) {
  const topicImages = {};
  for (const topic of topics) {
    const randomItem = getRandomItem(items, topic, from, to);
    if (randomItem) {
      topicImages[topic] = await fetchImage(randomItem.id);
    } else {
      topicImages[topic] = null;
    }
  }
  return topicImages;
}