'use client'; // Needed since we're using useEffect and client-side features

import { fetchMetadata } from './utils/jsonscript';
import { createTreemap } from './utils/treemap';
import { prepareTreemapData } from './utils/treemapdata';
import { getCachedData, setCachedData } from './utils/cache';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import YearRangeSlider from './components/YearRangeSlider';

export default function StartPage() {
  const [objects, setObjects] = useState(null);
  const treemapContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [treemapData, setTreemapData] = useState(null);
  const router = useRouter();

  // Year filter state - array for range slider
  const [yearRange, setYearRange] = useState({
      min: 1977,
      max: 1994,
      values: [1977, 1994]
  });

  useEffect(() => {
    async function loadData() {
      try {
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
    if (objects && yearRange) {
      const filteredData = prepareTreemapData(
        objects.regularItems, 
        { from: yearRange.values[0], to: yearRange.values[1] }
      );
      setTreemapData(filteredData);
    }
  }, [objects, yearRange]);

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
    <div>
      <h1>Stadt in Bewegung - visualisierter Sammlungszugang</h1>
      
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
      
      <h2>----- List of Entries - temporary as overview helper for myself -----</h2>
      <h3>----- place some rights statement and introduction text here later -----</h3>
      <br />
      <ul>
        {/* list regular items */}
        {objects?.regularItems.map((item, index) => (
          
          <li key={index}>
            File {item.id}: {item.title} 
            {/* VideoURL {item.videoURL || "no video"} - this is not really needed as causes an issue*/}
            (ID: {item.id}) 
            (Created in year: {item.year || "N/A or unclear"}) 
            (Topics: {item.topic.length > 0 ? item.topic.join(", ") : "N/A or unclear"})
            </li>
        ))}
        {/* list irregular items */}
        {objects?.customItems.map((item, index) => (
          <li key={`custom-${index}`}>
            File {item.id}: {item.title} (Custom Title)
          </li>
        ))}
      </ul>
    </div>
  );
}