import * as d3 from 'd3';

export function GOEnrichmentVisualization({ goEnrichmentData }) {
    // Set dimensions and margins
    const margin = { top: 50, right: 30, bottom: 70, left: 300 },
          width = 900 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    // Remove any existing SVG
    d3.select("#chart").selectAll("*").remove();

    // Create the SVG container
    const svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scale for x-axis
    const x = d3.scaleLinear()
        .domain([0, d3.max(goEnrichmentData, d => -Math.log10(d.p_fdr_bh))])
        .range([0, width]);

    // Scale for y-axis
    const y = d3.scaleBand()
        .domain(goEnrichmentData.map(d => d.goName))
        .range([0, height])
        .padding(0.1);

    // Color scale
    const color = d3.scaleSequential(d3.interpolateViridis)
        .domain([d3.max(goEnrichmentData, d => -Math.log10(d.p_fdr_bh)), 0]);

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(-height))
        .selectAll("text")
        .style("font-size", "16px");

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "16px");

    // Add bars
    svg.selectAll(".bar")
        .data(goEnrichmentData)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => y(d.goName))
        .attr("width", d => x(-Math.log10(d.p_fdr_bh)))
        .attr("height", y.bandwidth())
        .attr("fill", d => color(-Math.log10(d.p_fdr_bh)));

    // Add title
    svg.append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .text("GO Enrichment Analysis");

    // Add x-axis label
    svg.append("text")
        .attr("class", "xlabel")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 20)
        .attr("text-anchor", "middle")
        .text("-log10(Adj-pValue)");
}
