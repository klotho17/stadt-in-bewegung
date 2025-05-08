// app/your-page/page.js
'use client'; // Needed since we're using useEffect and client-side features

// functions
import { fetchMetadata } from './utils/jsonscript';
import { createTreemap } from './utils/treemap';
//import { createTreemap2 } from './utils/treemap2'; //test
import { prepareTreemapData } from './utils/treemapdata';
// imports from next & react
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
// React components
import YearRangeSlider from './components/YearRangeSlider';

export default function JsonDataPage() {
  const [titles, setTitles] = useState(null);
  const [year, setYear] = useState(null);
  const treemapContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [treemapData, setTreemapData] = useState(null);
  const router = useRouter();


  // Year filter state - now using array for range slider
  const [yearRange, setYearRange] = useState({
      min: 1977,
      max: 1994,
      values: [1977, 1994] // [from, to]
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
        
        if (years.length > 0) {
          const dataMinYear = Math.min(...years);
          const dataMaxYear = Math.max(...years);

          setYearRange({
            min: dataMinYear,
            max: dataMaxYear,
            values: [dataMinYear, dataMaxYear]
          });
        }

        //... later i want to use the data from the custom items as well
        // get the data for the treemap from function in utils/filtertopics.js
        // Initial treemap data with all years
        const initialData = prepareTreemapData(data.regularItems);
        setTreemapData(initialData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
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
        { from: yearRange.values[0], to: yearRange.values[1] }
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

  const handleYearChange = (values) => {
    setYearRange(prev => ({
      ...prev,
      values
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

// ... add resizing function at some point

// --------------------------  Visual Website Return ------------------------------- //
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stadt in Bewegung - visualisierter Sammlungszugang</h1>
      
      {/* Year Range Filter */}
      <div>
        <h2>Zeitfilter</h2>
        
        <YearRangeSlider
          min={yearRange.min}
          max={yearRange.max}
          values={yearRange.values}
          onChange={handleYearChange}
        />
      </div>

      {/* Treemap Container */}
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