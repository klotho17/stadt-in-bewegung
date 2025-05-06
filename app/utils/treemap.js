import * as d3 from "d3";

export function createTreemap(containerId, data, onTopicClick) {
    // Clear previous content
    const container = d3.select(`#${containerId}`);
    container.html('');
  
    // Set dimensions
    const width = 1000;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  
    // Create SVG
    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', '#f8f8f8');
  
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
          .range(['#e0f7fa', '#006064']);
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
      .style('pointer-events', 'none'); // Make text non-clickable
  }

/*
export function createTreemap(containerId, data) {
    console.log("Creating treemap with data:", data); // Debug log
    // Check if container exists
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container element with ID "${containerId}" not found`);
      return;
    }
    // Clear previous content
    container.innerHTML = '';

    // Wrap data in a root object with a `children` property
    const root = d3.hierarchy({ children: data })
        .sum(d => d.value) // Use the frequency as the size
        .sort((a, b) => b.value - a.value); // Sort by frequency

    console.log("Hierarchical root:", root); // Debug log

    // Create a treemap layout
    const treemapLayout = d3.treemap()
        .size([1000, 500])
        .padding(2);

    treemapLayout(root);

    // Create an SVG container
    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", 1000)
        .attr("height", 500);

    // Add rectangles for each topic
    const nodes = svg.selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    console.log("Nodes created:", nodes); // Debug log

    nodes.append("rect")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", (d, i) => d3.schemeCategory10[i % 10]) // Use a color scheme
        .attr("stroke", "#fff");

    nodes.append("text")
        .attr("x", 5)
        .attr("y", 20)
        .text(d => d.data.name)
        .attr("font-size", "12px")
        .attr("fill", "#000");
}
        */