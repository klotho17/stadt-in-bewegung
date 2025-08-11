import * as d3 from "d3";

// Helper function to wrap text into lines that fit the rectangle width
// based on smallest font size
function wrapText(text, maxWidth, fontSize = 12) {
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
  console.log("Input data:", JSON.stringify(data, null, 2));

  // Set a base height for the full dataset
  const baseHeight = 1000;

  // Calculate height proportional to full data
  const height = Math.max(100, baseHeight * (totalValue / calculatedMaxTotalValue));
  // Set dimensions
  console.log("Calculated height:", height);
  const width = container.node().clientWidth || 5000;
  const margin = { top: 0, right: 1, bottom: 0, left: 0 };

  // Create SVG
  const svg = container.append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', 'none')

  const root = d3.hierarchy({
    name: "root",
    children: data.map(d => ({ ...d })) // clone objects
  })
    .sum(d => d.value || 0)
    .sort((a, b) => a.value - b.value); // reversed: from smallest to biggest

  // Create treemap layout
  const treemap = d3.treemap()
    .tile(d3.treemapResquarify) // custom ratio .ratio(2)
    .size([
      width - margin.left - margin.right, 
      height - margin.top - margin.bottom])
    .padding(1)
    //.round(true);

  treemap(root);

  // Create cells
  const cells = svg.selectAll('g')
    .data(root.leaves())
    .enter().append('g')
    .attr('transform', d => `translate(${d.x0 + margin.left},${d.y0 + margin.top})`);

  // Add clickable rectangles
  cells.append('rect')
    .attr('width', d => Math.max(1, d.x1 - d.x0))
    .attr('height', d => Math.max(1, d.y1 - d.y0))
    .attr('fill', function (d, i) {
      const imgUrl = topicImages[d.data.name];
      if (imgUrl) {
        // use a topic img as background
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
      const fontSize = Math.max(12, d.data.value);
      return fontSize + 10;
    })
    .each(function (d) {
      const fontSize = Math.max(10, d.data.value);
      const maxWidth = d.x1 - d.x0 - 10;
      //const lines = wrapText(`${d.data.name}`, maxWidth, fontSize);
      //d.data.value not correct...
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
      return Math.max(12, d.data.value) + 'px';
    })
    .style('text-align', 'right')
    .style('fill', '#ffffff')
    .style('font-weight', 'bold')
    .style('text-shadow', '1px 1px 4px #000000')
    .style('pointer-events', 'none')

// Mouse hover functionality
cells
  .on('mouseover', function(event, d) {
    // Bring group to front
    this.parentNode.appendChild(this);
    
    // Get the text element and its bounding box
    const textElem = d3.select(this).select('text').node();
    let textBoxWidth = d.x1 - d.x0; // fallback to rect width
    if (textElem) {
      const bbox = textElem.getBBox();
      textBoxWidth = Math.max(bbox.width + 20, d.x1 - d.x0); // ensure at least rect width
    }

    // Create overlay that covers entire tile (including borders)
    d3.select(this).insert('rect', 'text')
      .attr('class', 'hover-overlay')
      .attr('x', -10)
      .attr('y', -10)
      .attr('width', textBoxWidth + 20)
      .attr('height', d.y1 - d.y0 + 20)
      .attr('fill', 'rgba(0, 0, 0, 0.85)')
      .attr('pointer-events', 'none') // Allow clicks to pass through

    // Enhance text
    d3.select(this).select('text')
      .transition()
      .duration(200)
      .style('font-size', `${Math.max(14, d.data.value * 1.2)}px`)
  })
  .on('mouseout', function(event, d) {
    // Remove overlay
    d3.select(this).select('.hover-overlay').remove();
    
    // Restore text - stays in front until neighboring tiles overwrite
    d3.select(this).select('text')
      .transition()
      .duration(200)
      .style('font-size', `${Math.max(12, d.data.value)}px`)
      .style('filter', 'none');
  });
}
