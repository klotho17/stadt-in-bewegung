export default function NavImage({ width = 300, height = 100 }) {
  const gap = width * 0.03; // consistent horizontal and vertical spacing

  // Top Row Heights
  const topRowHeight = height * 0.55;
  const bottomRowHeight = height - topRowHeight - gap;

  // Widths based on visual impression
  const topLeftWidth = width * 0.55;
  const topRightWidth = width - topLeftWidth - 3 * gap;

  const bottomLeftWidth = width * 0.38;
  const bottomMiddleWidth = width * 0.34;
  const bottomRightWidth = width - bottomLeftWidth - bottomMiddleWidth - 4 * gap;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Drawing-based layout with rectangles"
    >
      {/* Top Left */}
      <rect 
        x={gap}
        y={gap}
        width={topLeftWidth}
        height={topRowHeight}
        fill="white"
        fillOpacity="1"
      />

      {/* Top Right */}
      <rect 
        x={gap * 2 + topLeftWidth}
        y={gap}
        width={topRightWidth}
        height={topRowHeight}
        fill="white"
        fillOpacity="0.6"
      />

      {/* Bottom Left */}
      <rect 
        x={gap}
        y={topRowHeight + 2 * gap}
        width={bottomLeftWidth}
        height={bottomRowHeight}
        fill="white"
        fillOpacity="0.4"
      />

      {/* Bottom Middle */}
      <rect 
        x={gap * 2 + bottomLeftWidth}
        y={topRowHeight + 2 * gap}
        width={bottomMiddleWidth}
        height={bottomRowHeight}
        fill="white"
        fillOpacity="0.8"
      />

      {/* Bottom Right */}
      <rect 
        x={gap * 3 + bottomLeftWidth + bottomMiddleWidth}
        y={topRowHeight + 2 * gap}
        width={bottomRightWidth}
        height={bottomRowHeight}
        fill="white"
        fillOpacity="0.3"
      />
    </svg>
  );
}
