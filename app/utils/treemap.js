import * as d3 from "d3";

export function createTreemap(containerId, data, onTopicClick) {
    // Clear previous content
    const container = d3.select(`#${containerId}`);
    container.html('');
  
    // Set dimensions
    const width = container.node().clientWidth || 800;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  
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
      .attr('fill', d => {
        const color = d3.scaleLinear()
          .domain([0, root.value])
          .range(['#32a88d', '#9c32a8']); // ... will be replaced by pictures later anyway
        return color(d.value);
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
      .text(d => d.data.name)
      .style('font-size', '10px')
      .style('fill', '#333')
      .style('pointer-events', 'none'); // Make text non-clickable... hä?
  }