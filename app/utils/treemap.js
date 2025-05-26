import * as d3 from "d3";

// move to components?

export function createTreemap(containerId, data, onTopicClick, topicImages = {}) {
    const container = d3.select(`#${containerId}`);
    container.html('');
  
    // Set dimensions
    const width = container.node().clientWidth || 800;
    const height = 1000;
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  
    // Create SVG
    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', '#706f6f');
  
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
  
    // Add clickable rectangles
    cells.append('rect')
    .attr('width', d => Math.max(1, d.x1 - d.x0))
    .attr('height', d => Math.max(1, d.y1 - d.y0))
    .attr('fill', function(d, i) {
      const imgUrl = topicImages[d.data.name];
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
      return "#ccc";
    })
    .attr('stroke', '#fff')
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
      .attr('y', 15)
      .text(d => `${d.data.name} [${d.data.value}]`)
      .style('font-size', '20px')
      .style('fill', '#333')
      .style('font-weight', 'bold')
      .style('font-shadow', '5px 1px 2px #fff')
      .style('pointer-events', 'none'); // Make text non-clickable... hä?
  }