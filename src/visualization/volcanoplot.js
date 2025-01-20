import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
//differentialAbundanceDataList 
function VolcanoPlot({ differentialAbundanceDataList, chartRef }) {
    
    useEffect(() => {
        if (!differentialAbundanceDataList || !Array.isArray(differentialAbundanceDataList)) {
            console.error("Invalid data structure");
            return;
        }
    
        // Clear the existing content
        d3.select(chartRef.current).selectAll("*").remove();
    
        // Process each experiment's data
        differentialAbundanceDataList.forEach((experiment, index) => {
            createPlot(chartRef.current, experiment.data, index);
        });
    }, [differentialAbundanceDataList]); // Correctly omit chartRef here
    

    function createPlot(container, data, index) {
        const svgWidth = 800;
        const svgHeight = 400;
        const margin = { top: 50, right: 50, bottom: 100, left: 60 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;
    
        const svg = d3.select(container).append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .attr("id", `volcano-plot-${index}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const tooltip = svg.append("g")
            .style("display", "none"); // Initially hidden
        
        // Add text first without specifying the background size
        tooltip.append("text")
            .attr("class", "pep-key-label")
            .attr("x", 10) // Padding from the left edge
            .attr("y", 20) // Positioning from the top edge
            .attr("font-size", "12px");
        
        tooltip.append("text")
            .attr("class", "protein-name-label")
            .attr("x", 10) // Padding from the left edge
            .attr("y", 35) // Position below the first text element
            .attr("font-size", "12px");
        
        // Append the background rectangle and send it to the back
        const tooltipBackground = tooltip.insert("rect", "text")
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", "0.5px")
            .attr("x", -5) // Set initial dimensions, slightly larger than the text
            .attr("y", -5)
            .attr("width", 0) // Start with no width and height, update on mouseover
            .attr("height", 0);
        
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.diff))
            .range([0, width]);
    
        const y = d3.scaleLinear()
            .domain([0, 10]) // Ensure y domain is correct for your data
            .range([height, 0]);
    
        svg.append("g")
            .call(d3.axisLeft(y));
    
        // Data binding for points
        const points = svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", d => x(d.diff))
            .attr("cy", d => y(-Math.log10(d.adj_pval)))
            .attr("r", 3)
            .attr("class", d => `pep-key-${d.pep_grouping_key.replace(/\s+/g, '-')}`) // Replace spaces if any
            .style("fill", "#808080");
    
            points.on("mouseover", function(event, d) {
                // Reset tooltip background to be recalculated
                tooltipBackground
                    .attr("width", 0)
                    .attr("height", 0)
                    .attr("fill", "white");
        
                // Set text
                tooltip.select(".pep-key-label").text(`Pep Key: ${d.pep_grouping_key}`);
                tooltip.select(".protein-name-label").text(`Protein: ${d.pg_protein_accessions}`);
        
                // Update tooltip position
                tooltip.style("display", null) // Make the tooltip visible
                    .attr("transform", `translate(${x(d.diff)},${y(-Math.log10(d.adj_pval)) - 50})`)
                    .raise();
        
                // Measure text and adjust background size
                let bbox = tooltip.node().getBBox();
                tooltipBackground
                    .attr("x", bbox.x - 5) // Padding around text
                    .attr("y", bbox.y - 5)
                    .attr("width", bbox.width + 10) // Padding
                    .attr("height", bbox.height + 10);
        
                // Highlight point
                d3.selectAll(`.pep-key-${d.pep_grouping_key.replace(/\s+/g, '-')}`)
                    .classed("highlighted", true)
                    .attr("r", 4.5)
                    .raise();
            });
        
            points.on("mouseout", function(event, d) {
                d3.selectAll(`.pep-key-${d.pep_grouping_key.replace(/\s+/g, '-')}`)
                    .classed("highlighted", false)
                    .attr("r", 3);
        
                tooltip.style("display", "none"); // Hide tooltip
                // Reset the tooltip dimensions to avoid residual effects
                tooltipBackground
                    .attr("width", 0)
                    .attr("height", 0)
                    .attr("fill", "white");
            });




    
        // Labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 15)
            .style("text-anchor", "middle")
            .text("Log2 Fold Change");
    
        svg.append("text")
            .attr("x", -(height / 2))
            .attr("y", -40)
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .text("-Log10(Adjusted p-Value)");
    }
    
    return <div ref={chartRef} />;
    }
    
export default VolcanoPlot;
