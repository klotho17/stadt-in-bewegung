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

    // Year filter state
  const [yearRange, setYearRange] = useState({
    min: 1977,
    max: 1994,
    from: 1977,
    to: 1994
    });

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch data from the JSON files with function in utils/jsonscript.js
        const data = await fetchMetadata(); //change name later to something more suitable!
        // Debug fetched data
        console.log("Fetched data:", data); 
        setTitles(data);
        
        // Calculate actual year range from data (precautionary)
        const years = data.regularItems
        .map(item => item.year ? parseInt(item.year) : null)
        .filter(year => year !== null);

        const dataMinYear = Math.min(...years);
        const dataMaxYear = Math.max(...years);

        setYearRange({
          min: dataMinYear,
          max: dataMaxYear,
          from: dataMinYear,
          to: dataMaxYear
        });

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

  // Update treemap when year range changes
  useEffect(() => {
    if (titles && yearRange) {
      const filteredData = prepareTreemapData(
        titles.regularItems, 
        { from: yearRange.from, to: yearRange.to }
      );
      setTreemapData(filteredData);
    }
  }, [titles, yearRange]);

  // Render treemap when data changes
  useEffect(() => {
    if (treemapData && treemapContainerRef.current) {
      createTreemap("treemap-container", treemapData, (topic) => {
        router.push(`/themen/${encodeURIComponent(topic)}`);
      });
    }
  }, [treemapData, router]);

  const handleYearChange = (type, value) => {
    setYearRange(prev => {
      const newValue = parseInt(value);
      const newRange = { ...prev, [type]: newValue };
      
      // Ensure "from" doesn't exceed "to" and vice versa
      if (type === 'from' && newValue > newRange.to) {
        newRange.to = newValue;
      } else if (type === 'to' && newValue < newRange.from) {
        newRange.from = newValue;
      }
      
      return newRange;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

// old: create treemap with function from utils/treemap.js
/*
  useEffect(() => {
    if (!loading && treemapData && treemapContainerRef.current) {
      createTreemap("treemap-container", treemapData, (topic) => {
        router.push(`/themen/${encodeURIComponent(topic)}`);
      });
    }
  }, [loading, treemapData, router]);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
*/
// ... add resizing function at some point

// Visual Website returns
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stadt in Bewegung - visualisierter Sammlungszugang</h1>
      {/* Year Range Filter */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Zeitfilter</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Von: {yearRange.from}
            </label>
            <input
              type="range"
              min={yearRange.min}
              max={yearRange.max}
              value={yearRange.from}
              onChange={(e) => handleYearChange('from', e.target.value)}
              className="w-full mt-1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bis: {yearRange.to}
            </label>
            <input
              type="range"
              min={yearRange.min}
              max={yearRange.max}
              value={yearRange.to}
              onChange={(e) => handleYearChange('to', e.target.value)}
              className="w-full mt-1"
            />
          </div>
        </div>

        <p>Zeitspanne</p>
        <div className="text-center mt-2 font-medium">
        {yearRange.from} – {yearRange.to}
        </div>
      </div>
      
      {/* Treemap */}
      <h2 className="text-lg font-semibold mb-4">Treemap</h2>
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