'use client';

import { fetchMetadata } from '../../utils/jsonscript';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
//import Link from 'next/link';

export default function TopicPage() {

  const params = useParams();
  const topic = decodeURIComponent(params.topic);

  const [titles, setTitles] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Fetch data from the JSON files with function in utils/jsonscript.js
      const data = await fetchMetadata();
      setTitles(data);
      
      // Filter items that include this topic
      const itemsWithTopic = data.regularItems.filter(item => 
        Array.isArray(item.topic) && item.topic.includes(topic)
      );

      setFilteredItems(itemsWithTopic);
      setLoading(false);
    }
    
    loadData();
  }, [topic]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Einträge zum Thema: {topic}</h1>
      
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredItems.length} Einträge gefunden
        </p>
      </div>
      
      <ul className="space-y-2">
        {filteredItems.map((item) => (
          <li key={item.id} className="p-2 border rounded hover:bg-gray-50">
          <a href={`/objekt/${item.id}`} className="block">
      <h3 className="font-medium">{item.title}</h3>
      <p className="text-sm text-gray-600">
        Datei {item.fileNumber} | Jahr: {item.year || 'N/A'}
      </p>
      {/* i don't know what this does anymore */}
            {item.topic && item.topic.length > 0 && (
              <div className="mt-1">
                <span className="text-xs text-gray-500">Weitere Themen: </span>
                {item.topic.filter(t => t !== topic).join(', ')}
              </div>
            )}
          </a>  
          </li>
        ))}
      </ul>
    </div>
  );
}