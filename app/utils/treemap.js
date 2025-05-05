import * as d3 from "d3";

export function createTreemap(containerId, data) {
    console.log("Creating treemap with data:", data); // Debug log

    // Wrap data in a root object with a `children` property
    const root = d3.hierarchy({ children: data })
        .sum(d => d.value) // Use the frequency as the size
        .sort((a, b) => b.value - a.value); // Sort by frequency

    console.log("Hierarchical root:", root); // Debug log

    // Create a treemap layout
    const treemapLayout = d3.treemap()
        .size([800, 600])
        .padding(2);

    treemapLayout(root);

    // Create an SVG container
    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", 800)
        .attr("height", 600);

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