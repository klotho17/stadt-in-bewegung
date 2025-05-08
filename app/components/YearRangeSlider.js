'use client';

import { useCallback } from 'react';
import { Range } from 'react-range';

export default function YearRangeSlider({ 
  min, 
  max, 
  values, 
  onChange,
  step = 1
}) {
  const renderYearLabels = useCallback(() => {
    if (min >= max) {
      console.warn("Invalid range: min should be less than max");
      return null; // Return nothing if the range is invalid
    }
  
    const totalYears = max - min; // Calculate total range of years
      console.log("Total years:", totalYears);
    const labelCount = Math.min(50, totalYears); // Limiting number of labels for bigger ranges 
      console.log("Label count:", labelCount);
    const step = Math.max(1, Math.floor(totalYears / labelCount)); //setting step width for the labels
      console.log("Step for labels:", step);

    return Array.from({ length: labelCount + 1 }).map((_, i) => {
      const year = min + (i * step);
      return (
        <span 
          key={`year-label-${year}`} // Ensure the key is unique
          className="year-label"
          style={{
            left: `${((year - min) / (max - min)) * 100}%`
          }}
        >
          {year}
        </span>
      );
    });
  }, [min, max]);

  console.log("YearRangeSlider props:", { min, max, values });

  return (
    <div className="year-range-slider">
      <div className="year-labels">
        {renderYearLabels()}
      </div>
      
    <Range
    values={values}
    step={step}
    min={min}
    max={max}
    onChange={onChange}
    renderTrack={({ props: { key, ...restProps }, children }) => (
    <div
      {...restProps}
      key={`track-${key}`}
      className="slider-track"
      style={{
        ...restProps.style,
      }}
    >
      {children}
    </div>
  )}
  renderThumb={({ props: { key, ...restProps }, isDragged }) => (
    <div
      {...restProps}
      key={`track-${key}`}
      className={`slider-thumb ${isDragged ? 'dragged' : ''}`}
      style={{
        ...restProps.style,
      }}
    >
      <span className="thumb-value">
        {restProps['aria-valuenow']}
      </span>
    </div>
  )}
/>
      
      <div className="current-range">
        <span>From: {values[0]}</span>
        <span>To: {values[1]}</span>
      </div>
    </div>
  );
}