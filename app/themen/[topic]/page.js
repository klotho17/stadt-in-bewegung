'use client';

import { fetchAllTitles } from '../../utils/jsonscript';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function TopicPage() {

  const params = useParams();
  const topic = decodeURIComponent(params.topic);

  const [titles, setTitles] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    async function loadData() {
      const data = await fetchAllTitles();
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
        {filteredItems.map((item, index) => (
          <li key={index} className="p-2 border rounded">
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-gray-600">
              Datei {item.fileNumber} | Jahr: {item.year || 'N/A'}
            </p>
            {item.topic && item.topic.length > 0 && (
              <div className="mt-1">
                <span className="text-xs text-gray-500">Weitere Themen: </span>
                {item.topic.filter(t => t !== topic).join(', ')}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}