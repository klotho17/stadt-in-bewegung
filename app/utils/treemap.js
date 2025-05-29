import * as d3 from "d3";

// move to components?

// Helper function to wrap text into lines that fit the rectangle width
// based on smallest font size
function wrapText(text, maxWidth, fontSize = 10) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const testLine = line ? line + ' ' + words[i] : words[i];
    // Approximate width: fontSize * 0.6 * chars
    const testWidth = testLine.length * fontSize * 0.6;
    if (testWidth > maxWidth && line) {
      lines.push(line);
      line = words[i];
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function createTreemap(containerId, data, onTopicClick, topicImages = {}, absoluteData = null, maxTotalValue = null) {
  const container = d3.select(`#${containerId}`);
  container.html('');

  //console.log("Creating treemap with data:", data);

  // Use the provided maxTotalValue or calculate from absoluteData if not provided
  const calculatedMaxTotalValue = maxTotalValue !== null
    ? maxTotalValue
    : absoluteData
      ? absoluteData.reduce((sum, d) => sum + (Number(d.value) || 0), 0)
      : data.reduce((sum, d) => sum + (Number(d.value) || 0), 0) || 1;

  // For each render, calculate the current total value
  const totalValue = d3.sum(data, d => Number(d.value) || 0);
  console.log("totalValue", totalValue)
  console.log("maxTotalValue", maxTotalValue)

  // Set a base height for the full dataset
  const baseHeight = 1000;

  // Calculate height proportional to full data
  const height = Math.max(100, baseHeight * (totalValue / calculatedMaxTotalValue));
  // Set dimensions
  const width = container.node().clientWidth || 800;
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };

  // Create SVG
  const svg = container.append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', 'none')
  //.attr('viewBox', `0 0 ${width} ${height}`); //added

  // Create hierarchical data
  const root = d3.hierarchy({ children: data })
    .sum(d => Math.max(Number(d.value) || 1, 1))
    .sort((a, b) => b.value - a.value);

  // Create treemap layout
  const treemap = d3.treemap()
    .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
    .padding(1)
    .round(true);

  treemap(root);

  // Create cells
  const cells = svg.selectAll('g')
    .data(root.leaves())
    .enter().append('g')
    .attr('transform', d => `translate(${d.x0 + margin.left},${d.y0 + margin.top})`);

  /*    cells.data().forEach((d, i) => {
       console.log("rectangles", i, d.data.name, d.x0, d.y0, d.x1, d.y1);
   }); */

  // Add clickable rectangles
  cells.append('rect')
    .attr('width', d => Math.max(1, d.x1 - d.x0))
    .attr('height', d => Math.max(1, d.y1 - d.y0))
    .attr('fill', function (d, i) {
      const imgUrl = topicImages[d.data.name];
      //const imgUrl = "localhost:3000/file.svg" // temporary placeholder for image URL for less data traffic
      if (imgUrl) {
        // Define a unique pattern for each topic
        const patternId = `img-pattern-${i}`;
        d3.select(this.ownerSVGElement)
          .append("defs")
          .append("pattern")
          .attr("id", patternId)
          .attr("patternUnits", "objectBoundingBox")
          .attr("width", 1)
          .attr("height", 1)
          .append("image")
          .attr("xlink:href", imgUrl)
          .attr("width", d.x1 - d.x0)
          .attr("height", d.y1 - d.y0)
          .attr("preserveAspectRatio", "xMidYMid slice");
        return `url(#${patternId})`;
      }
      // fallback color
      return "#000000";
    })
    .attr('stroke', '#000000')
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      if (onTopicClick) {
        onTopicClick(d.data.name);
      }
    });

  // Add text labels
  cells.filter(d => (d.x1 - d.x0) > 30 && (d.y1 - d.y0) > 20)
    .append('text')
    .attr('x', 5)
    .attr('y', function (d) {
      const fontSize = Math.max(10, d.data.value);
      return fontSize + 10;
    })
    .each(function (d) {
      const fontSize = Math.max(10, d.data.value);
      const maxWidth = d.x1 - d.x0 - 10;
      const lines = wrapText(`${d.data.name} [${d.data.value}]`, maxWidth, fontSize);
      lines.forEach((line, i) => {
        d3.select(this)
          .append('tspan')
          .attr('x', 5)
          .attr('y', fontSize + i * (fontSize + 2))
          .text(line);
      });
    })
    .style('font-size', function (d) {
      return Math.max(10, d.data.value) + 'px';
    })
    .style('fill', '#ffffff')
    .style('font-weight', 'bold')
    .style('text-shadow', '3px 3px 7px #000000')
    .style('pointer-events', 'none'); // Make text non-clickable... hä?


  // mouse hover --- work in progress
  cells
    .on('mouseover', function (event, d) {
      // Bring group to front
      this.parentNode.appendChild(this);

      // Make text bigger and in front
      d3.select(this).select('text')
        .transition()
        .duration(150);
      //.style('font-size', '2.5rem')
      //.style('text-shadow', '10px 10px 7px #ff0000');
    })
    .on('mouseout', function (event, d) {
      // Restore rect fill
      /* d3.select(this).select('rect')
        .attr('fill', function(d, i) {
          // your original fill logic here
          // e.g. return "#000" or pattern
          return "#000";
        }); */

      // Restore text size
      d3.select(this).select('text')
        .transition()
        .duration(150)
        /* .style('font-size', d => {
          const px = Math.max(10, Math.min((d.x1 - d.x0) * 0.15, 32));
          return `${px}px`;
        }) */
        .style('text-shadow', '3px 3px 7px #000000');
    });



}

