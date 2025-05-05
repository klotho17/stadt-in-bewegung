// app/your-page/page.js
'use client'; // Needed since we're using useEffect and client-side features

import { fetchAllTitles } from './utils/jsonscript';
import { createTreemap } from './utils/treemap';
import { createTreemap2 } from './utils/treemap2'; //test
import { prepareTreemapData } from './utils/filtertopics';
import { useEffect, useState } from 'react';
import * as d3 from "d3";

export default function JsonDataPage() {
  const [titles, setTitles] = useState(null);
  const [year, setYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAllTitles();
        console.log("Fetched data:", data); // Debug fetched data
        setTitles(data);
        
                //tmp test data
                const testData = [
                  { name: "Jugendbewegung", value: 37 },
                  { name: "Umweltschutz", value: 25 },
                  { name: "Kultur", value: 15 }
                ];
                
                createTreemap2("test-treemap-container", testData); 
                console.log("treemap testdata:", testData);

/*                 // Prepare data for the treemap
                const topicFrequency = {};
                data.regularItems.forEach(item => {
                  if (Array.isArray(item.topic) && item.topic.length > 0) { // Check if topics is a valid array
                    item.topic.forEach(topic => {
                      topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
                    });
                  }
                });
        
                const treemapData = Object.entries(topicFrequency).map(([name, value]) => ({ name, value }));
                // check the structure of the treemap data
                console.log("treemap data:", treemapData);

                // Create the treemap
                createTreemap("treemap-container", treemapData); */


      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">JSON Data Viewer</h1>
      <div id="test-treemap-container"></div>
      <h2>Hallo</h2>
      <ul className="space-y-2">
        {/* list regular items */}
        {titles?.regularItems.map((item, index) => (
          
          <li key={index} className="p-2 border rounded">
            File {item.fileNumber}: {item.title} 
            (ID: {item.id}) 
            (Created in year: {item.year || "N/A or unclear"}) 
            (Topics: {item.topic.length > 0 ? item.topic.join(", ") : "N/A or unclear"})
            </li>
        ))}
        {/* list irregular items */}
        {titles?.customItems.map((item, index) => (
          <li key={`custom-${index}`} className="p-2 border rounded bg-yellow-50">
            File {item.fileNumber}: {item.title} (Custom Title)
          </li>
        ))}
      </ul>
    </div>
  );
}