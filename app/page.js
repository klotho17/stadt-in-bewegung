// app/your-page/page.js
'use client'; // Needed since we're using useEffect and client-side features

import { fetchMetadata } from './utils/jsonscript';
import { createTreemap } from './utils/treemap';
//import { createTreemap2 } from './utils/treemap2'; //test
import { prepareTreemapData } from './utils/filtertopics';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function JsonDataPage() {
  const [titles, setTitles] = useState(null);
  const [year, setYear] = useState(null);
  const treemapContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [treemapData, setTreemapData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch data from the JSON files with function in utils/jsonscript.js
        const data = await fetchMetadata(); //change name later to something more suitable!
        // Debug fetched data
        console.log("Fetched data:", data); 
        setTitles(data);
        
        // get the data for the treemap from function in utils/filtertopics.js
        //... later i want to use the data from the custom items as well
        const treemapData = prepareTreemapData(data.regularItems);
        setTreemapData(treemapData);
          // check the structure of the treemap data
          console.log("treemap data - treemapData:", treemapData);
          console.log("TreemapData:", setTreemapData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

// create treemap with function from utils/treemap.js
  useEffect(() => {
    if (!loading && treemapData && treemapContainerRef.current) {
      createTreemap("treemap-container", treemapData, (topic) => {
        router.push(`/themen/${encodeURIComponent(topic)}`);
      });
    }
  }, [loading, treemapData, router]);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

// ... add resizing function at some point

// Visual Website returns
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Treemap</h1>
      <div className="treemap-wrapper">
      <div id="treemap-container" ref={treemapContainerRef}></div>
      </div>
      <h2>List of Entries</h2>
      <ul className="space-y-2">
        {/* list regular items */}
        {titles?.regularItems.map((item, index) => (
          
          <li key={index} className="p-2 border rounded">
            File {item.id}: {item.title} 
            (ID: {item.id}) 
            (Created in year: {item.year || "N/A or unclear"}) 
            (Topics: {item.topic.length > 0 ? item.topic.join(", ") : "N/A or unclear"})
            </li>
        ))}
        {/* list irregular items */}
        {titles?.customItems.map((item, index) => (
          <li key={`custom-${index}`} className="p-2 border rounded bg-yellow-50">
            File {item.id}: {item.title} (Custom Title)
          </li>
        ))}
      </ul>
    </div>
  );
}