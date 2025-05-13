export default function MissingVideoImage({ width, height}) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Missing Image"
      >
        {/* Grey background */}
        <rect width="100%" height="100%" fill="#cccccc" />
  
        {/* Black diagonal lines */}
        <line x1="0" y1="0" x2={width} y2={height} stroke="black" strokeWidth="2" />
        <line x1={width} y1="0" x2="0" y2={height} stroke="black" strokeWidth="2" />
      </svg>
    );
  }