import { fetchImage } from "./imageurl";

// Helper to shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Helper to get all items for a topic in the year range
function getAllItems(items, topic, from, to) {
  return items.filter(item =>
    Array.isArray(item.topic) && item.topic.includes(topic) &&
    item.year && item.year.some(y => y >= from && y <= to)
  );
}

// Main function: tries to fetch as many different images as possible
export function getTreemapImages(items, topics, from, to, onImageLoaded) {
  topics.forEach(async (topic) => {
    const candidates = shuffle(getAllItems(items, topic, from, to));
    let image = null;
    for (const candidate of candidates) {
      image = await fetchImage(candidate.id);
      if (image && image !== "MISSING") break;
    }
    onImageLoaded(topic, image);
  });
}

// Helper to get a random item for a topic in the year range
/* function getRandomItem(items, topic, from, to) {
  const filtered = items.filter(item =>
    Array.isArray(item.topic) && item.topic.includes(topic) &&
    item.year && item.year.some(y => y >= from && y <= to)
  );
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
} */


/* export function getTreemapImages(items, topics, from, to, onImageLoaded) {
  topics.forEach(async (topic) => {
    const randomItem = getRandomItem(items, topic, from, to);
    let image = null;
    if (randomItem) {
      image = await fetchImage(randomItem.id);
    }
    onImageLoaded(topic, image);
  });
} */