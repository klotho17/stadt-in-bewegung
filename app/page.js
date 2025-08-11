'use client';

import { getAllObjects } from './api/get-record-all'; // API-call for all objects
import { prepareTreemapData } from './utils/treemapdata'; // prepare data from API and custom files for visualisation
import { getTreemapImages } from './utils/treemapimages'; // get object images from URL
import { createTreemap } from './utils/treemap'; // create the treemap visualisation
import YearRangeSlider from './components/YearRangeSlider' // slider for year range with range setting

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from './loading';

export default function StartPage() {
  const [objects, setObjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const treemapContainerRef = useRef(null);
  const [treemapData, setTreemapData] = useState(null);
  const [topicImages, setTopicImages] = useState({});
  const [initialData, setInitialData] = useState(null);
  const [maxTotalValue, setMaxTotalValue] = useState(null);


  const router = useRouter();
  const searchParams = useSearchParams();
  const from = parseInt(searchParams.get('von'), 10);
  const to = parseInt(searchParams.get('bis'), 10);

  // Year filter state - array for range slider
  const [yearRange, setYearRange] = useState({
    min: 1977,
    max: 1994,
    values: [
      !isNaN(from) ? from : 1977,
      !isNaN(to) ? to : 1994
    ]
  });

  useEffect(() => {
    async function loadData() {
      console.log("Loading data");
      try {
        const objects = await getAllObjects();
        setObjects(objects);
        console.log("Get Objects from API and Custom items with Function", objects)

        // Calculate actual year range from given data
        const years = objects
          .flatMap(item => Array.isArray(item.year) ? item.year : [item.year])
          .filter(year => typeof year === "number" && !isNaN(year) && year > 0); // custom files currenty have value 0

        console.log("All Elements in Year Array of Objects", years);

        if (years.length > 0) {
          const dataMinYear = Math.min(...years);
          const dataMaxYear = Math.max(...years);

          setYearRange({
            min: dataMinYear,
            max: dataMaxYear,
            values: [
              !isNaN(from) ? from : dataMinYear,
              !isNaN(to) ? to : dataMaxYear
            ]
          });
        }

        // treemap data with all years and topics
        const initialData = prepareTreemapData(objects, null);
        setInitialData(initialData);

        // Calculate and set the maxTotalValue once
        const calculatedMax = initialData.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
        setMaxTotalValue(calculatedMax);

        console.log("Objects used for Treemap", objects);
        console.log("Initial Treemap Data with Topic Frequency", initialData);
        console.log("Max Total Value for Treemap", calculatedMax);
        setLoading(false);
      } catch (err) {
        console.log("Error loading data:", err);
        setError(err.message);
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // update treemap data on yearRange change
  useEffect(() => {
    if (!objects || !yearRange) return;
    const filteredData = prepareTreemapData(
      objects,
      { from: yearRange.values[0], to: yearRange.values[1] }
    );
    setTreemapData(filteredData);
  }, [objects, yearRange]);

  // fetch images once on initial load
  useEffect(() => {
    if (!objects || !initialData) return;
    //setTopicImages({}); // clear previous images
    getTreemapImages(
      objects,
      initialData.map(d => d.name),
      yearRange.min,
      yearRange.max,
      (topic, image) => {
        setTopicImages(prev => ({ ...prev, [topic]: image }));
      }
    );
  }, [objects, initialData]);

  // Create treemap with images, container width and save year range in URL
  useEffect(() => {
    if (treemapData && treemapContainerRef.current && maxTotalValue !== null) {
      createTreemap(
        "treemap-container",
        treemapData,
        (topic) => {
          router.push(`/themen/${encodeURIComponent(topic)}?von=${yearRange.values[0]}&bis=${yearRange.values[1]}`);
        },
        topicImages,
        initialData,  // Pass the initialData as absoluteData
        maxTotalValue // Pass the pre-calculated max value
      );
    }
  }, [treemapData, router, topicImages, containerWidth, yearRange.values, initialData, maxTotalValue]);

  // Update container width on resize
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

  // Handle year range changes from the slider
  const handleYearChange = (values) => {
    setYearRange(prev => ({
      ...prev,
      values
    }));
  };

  // Update year range when from/to query parameters change
  useEffect(() => {
    if (!isNaN(from) && !isNaN(to)) {
      setYearRange(prev => ({
        ...prev,
        values: [from, to]
      }));
    }
  }, [from, to]);

  // --------------------------  Visual Website Return ------------------------------- //
  
  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="start-page">
      <h1>Audiovisuelles Kulturerbe der Städte in Bewegung 1977-1994</h1>

      {/* Year Range Filter */}
      <div>
        <YearRangeSlider
          min={yearRange.min}
          max={yearRange.max}
          values={yearRange.values}
          onChange={handleYearChange}
        />
      </div>

      {/* Treemap Container */}
      <div className="treemap-wrapper">
        <div id="treemap-container" ref={treemapContainerRef} style={{ width: "100%" }} />
      </div>
    </div>
  );
}