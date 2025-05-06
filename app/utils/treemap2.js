// second version of treemap function - not used atm

import * as d3 from 'd3';

export function createTreemap2(containerId, data) {
  // Clear container and add debug message
  const container = d3.select(`#${containerId}`);
  container.html('');
  
  // Debug: Log input data
  console.log('Treemap input data:', data);
  
  // Validate data
  if (!data || data.length === 0) {
    container.append('p').text('No data available for treemap');
    return;
  }

  // Set dimensions with minimum height guarantee
  const width = 800;
  const height = 600;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

  // Create SVG
  const svg = container.append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', '#f8f8f8');

  // Create hierarchical data structure
  const root = d3.hierarchy({ children: data })
    .sum(d => {
      // Ensure all values are numbers and > 0
      const val = Number(d.value) || 1;
      return Math.max(val, 1); // Minimum value of 1
    })
    .sort((a, b) => b.value - a.value);

  // Debug: Log hierarchy
  console.log('Processed hierarchy:', root);

  // Create treemap layout
  const treemap = d3.treemap()
    .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
    .padding(1)
    .round(true);

  // Calculate layout
  treemap(root);

  // Debug: Log layout results
  console.log('Layout results:', root.leaves());

  // Create cells
  const cells = svg.selectAll('g')
    .data(root.leaves())
    .enter().append('g')
    .attr('transform', d => `translate(${d.x0 + margin.left},${d.y0 + margin.top})`);

  // Add rectangles - ensure minimum dimensions
  cells.append('rect')
    .attr('width', d => Math.max(1, d.x1 - d.x0)) // Minimum width of 1
    .attr('height', d => Math.max(1, d.y1 - d.y0)) // Minimum height of 1
    .attr('fill', d => {
      const color = d3.scaleLinear()
        .domain([0, root.value])
        .range(['#e0f7fa', '#006064']);
      return color(d.value);
    })
    .attr('stroke', '#fff');

  // Add text labels only if there's enough space
  cells.filter(d => (d.x1 - d.x0) > 30 && (d.y1 - d.y0) > 20)
    .append('text')
    .attr('x', 5)
    .attr('y', 15)
    .text(d => d.data.name)
    .style('font-size', '10px')
    .style('fill', '#333');
}