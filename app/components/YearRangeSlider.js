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
    //console.log("Total years:", totalYears);
    const labelCount = Math.min(50, totalYears); // Limiting number of labels for bigger ranges 
    //console.log("Label count:", labelCount);
    const step = Math.max(1, Math.floor(totalYears / labelCount)); //setting step width for the labels
    //console.log("Step for year-labels:", step);

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

  //console.log("YearRangeSlider props:", { min, max, values });

return (
  <div className="year-range-slider">
    <Range
      values={values}
      step={step}
      min={min}
      max={max}
      onChange={onChange}
      renderTrack={({ props, children }) => {
        // Add key to the track container
          return (
            <div
              {...props}
              key="track"
              className="slider-track"
              style={{
                ...props.style,
                position: 'relative',
              }}
            >
              <div 
        className="year-labels"
        key="year-labels"  // Add key here
      >
                {renderYearLabels()}
              </div>
              {children}
            </div>
        );
      }}
      renderThumb={({ props, isDragged, index }) => {
          // Add key based on index for each thumb
          return (
            <div
              {...props}
              key={`thumb-${index}`}
              className={`slider-thumb ${isDragged ? 'dragged' : ''}`}
              style={{
                ...props.style,
              }}
            >
              <span className="thumb-value">
                {props['aria-valuenow']}
              </span>
            </div>
          );
        }}
      />
    </div>
  );
}