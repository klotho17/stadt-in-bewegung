'use client';

import { fetchMetadata } from '../../utils/jsonscript';
import { getCachedData, setCachedData } from '../../utils/cache';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function TopicPage() {

  const params = useParams();
  const topic = decodeURIComponent(params.topic);

  const [objects, setObjects] = useState(null); //unused?
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Fetch data from the JSON files with function in utils/jsonscript.js or use cached data
      let data = getCachedData();
      if (!data) {
      console.log("Fetching data...");
      data = await fetchMetadata();
      setCachedData(data);
      } else {
      console.log("Using cached data...");
      }

      setObjects(data);
      
      // Filter items that include selected topic
      const itemsWithTopic = data.regularItems.filter(item => 
        Array.isArray(item.topic) && item.topic.includes(topic)
      );

      setFilteredItems(itemsWithTopic);
      setLoading(false);
    }
    
    loadData();
  }, [topic]);

  // --------------------------  Visual Website Return ------------------------------- //

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{filteredItems.length} Einträge zum Thema &quot;{topic}&quot; gefunden</h1>
      
      <ul>
        {filteredItems.map((item) => (
          <li key={item.id}>
          <a href={`/objekt/${item.id}`} className="block">
      {/* title of the object */}
      <h3 className="font-medium">{item.title}</h3>
      {/* fileNumber and Year of the object */}
      <p>
        Datei {item.fileNumber} | Jahr: {item.year || 'N/A'}
      </p>
      {/* other tobic tags the object has */}
        {item.topic && item.topic.length > 0 && (
          <div>
            <span>Weitere Themen: </span>
              {item.topic.filter(t => t !== topic).join(', ')}
          </div>
            )}
          </a>  {/* ... link goes around the whole li(?) element atm */}
          </li>
        ))}
      </ul>
    </div>
  );
}