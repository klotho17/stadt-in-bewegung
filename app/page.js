'use client'; // Needed since we're using useEffect and client-side features

import { prepareTreemapData } from './utils/treemapdata';
import { createTreemap } from './utils/treemap';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllObjects } from './api/get-record-all';
import { getTreemapImages } from './utils/treemapimages';

import YearRangeSlider from './components/YearRangeSlider'

export default function StartPage() {
  const [objects, setObjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const treemapContainerRef = useRef(null);
  const [treemapData, setTreemapData] = useState(null);
  const [topicImages, setTopicImages] = useState({});
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
        const objects = await getAllObjects();
        setObjects(objects);
        console.log("Get Objects from API with function", objects)

        // Calculate actual year range from data
        const years = objects
          .flatMap(item => Array.isArray(item.year) ? item.year : [item.year])
          .filter(year => typeof year === "number" && !isNaN(year) && year > 0); // 0 custom files are 0
        
        console.log("Years from objects", years);

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
        const initialData = prepareTreemapData(objects);
        setTreemapData(initialData);
        console.log("objects for Treemap", objects);
        console.log("Initial Treemap Data", initialData);
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
        objects, 
        { from: yearRange.values[0], to: yearRange.values[1] }
      );
      setTreemapData(filteredData);
    }
  }, [objects, yearRange]);

  // Render treemap when data changes
  useEffect(() => {
    if (treemapData && treemapContainerRef.current) {
      createTreemap("treemap-container", treemapData, (topic) => {
        //router.push(`/themen/${encodeURIComponent(topic)}`);
        router.push(`/themen/${encodeURIComponent(topic)}?von=${yearRange.values[0]}&bis=${yearRange.values[1]}`);
      });
    }
  }, [treemapData, router]);

  useEffect(() => {
  async function updateTreemapAndImages() {
    if (objects && yearRange) {
      const filteredData = prepareTreemapData(
        objects, 
        { from: yearRange.values[0], to: yearRange.values[1] }
      );
      setTreemapData(filteredData);

      // Get all topics from filteredData
      const topics = filteredData.map(d => d.name);
      // Fetch images for each topic
      const images = await getTreemapImages(objects, topics, yearRange.values[0], yearRange.values[1]);
      setTopicImages(images);
    }
  }
  updateTreemapAndImages();
  }, [objects, yearRange]);

  useEffect(() => {
  if (treemapData && treemapContainerRef.current) {
    createTreemap(
      "treemap-container",
      treemapData,
      (topic) => {
        router.push(`/themen/${encodeURIComponent(topic)}?von=${yearRange.values[0]}&bis=${yearRange.values[1]}`);
      },
      topicImages, // pass images as an extra argument
      containerWidth // pass container width
    );
  }
  }, [treemapData, router, topicImages, containerWidth]);

  useEffect(() => {
  function updateWidth() {
    if (treemapContainerRef.current) {
      setContainerWidth(treemapContainerRef.current.clientWidth);
    }
  }
  updateWidth();
  window.addEventListener('resize', updateWidth);
  return () => window.removeEventListener('resize', updateWidth);
  }, []);

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
      <div id="treemap-container" ref={treemapContainerRef} style={{ width: "100%" }} />      </div>
      
      <h2>----- List of Entries - temporary as overview helper for myself -----</h2>
      <h3>----- place some rights statement and introduction text here later -----</h3>
      <br />
      <ul>
        {objects?.map((item, index) => (
          <li key={index}>
           {item.title} {item.id} {Array.isArray(item.year) ? item.year.join(", ") : item.year}<br />
           {Array.isArray(item.topic) ? item.topic.join(", ") : item.topic || "no topic?"}<br />
           <br/> 
          </li>
      ))}
      </ul>
      
    </div>
  );
}