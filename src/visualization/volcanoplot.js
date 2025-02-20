import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

function VolcanoPlot({ differentialAbundanceDataList, chartRef, highlightedProtein }) {
    const chartsRef = useRef([])
    const isMounted = useRef(true);

    useEffect(() => {
        if (!differentialAbundanceDataList || !Array.isArray(differentialAbundanceDataList)) {
            console.error("Invalid data structure");
            return;
        }

        const svgContainer = d3.select(chartRef.current);
        svgContainer.selectAll("*").remove();

        // Create new SVG element
        const svg = svgContainer.append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        const allData = differentialAbundanceDataList.flatMap(exp => exp.data);
        const xExtent = d3.extent(allData, d => d.diff);
        const yMax = d3.max(allData, d => -Math.log10(d.adj_pval));

        const x = d3.scaleLinear()
            .domain(xExtent)
            .range([0, 800 - 60 - 50]); 

        const y = d3.scaleLinear()
            .domain([0, yMax])
            .range([400 - 50 - 100, 0]); 

        chartsRef.current = differentialAbundanceDataList.map((experiment, index) => {
            return createPlot(chartRef.current, experiment.data, index, highlightedProtein, x, y, experiment.experimentID);
        });

        if (chartsRef.current.length > 0) {
            addLegend(d3.select(chartRef.current).append("svg")
                .attr("width", 200)
                .attr("height", 100)
            );
        }
        return () => {
            if (isMounted.current){
                svgContainer.selectAll("*").remove();  
            }
                   
        };
    }, [differentialAbundanceDataList, highlightedProtein]);

    useEffect(() => {
        return () => {
            isMounted.current = false;  
        };
    }, []);

    function highlightOthers(pepKey, shouldHighlight) {
        chartsRef.current.forEach(chart => {
            const selection = chart.selectAll(`.pep-key-${pepKey.replace(/\s+/g, '-')}`);
            selection
                .attr('fill', shouldHighlight ? '#cc00cc' : d => d.pg_protein_accessions === highlightedProtein ? '#ffa500' : '#d9d9d9')
                .attr('r', shouldHighlight ? 4.5 : 3)
                .attr("stroke", shouldHighlight ? "#cc00cc" : "none") 
                .attr("stroke-width", shouldHighlight ? 1.5 : 0);
    
            if (shouldHighlight) {
                selection.raise(); 
            }
        });
    }

    function addLegend(svgContainer) {
        const legend = svgContainer.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(10,10)"); // Adjust position as needed
    
        const colors = [
            { color: "#ffa500", text: `Peptides in ${highlightedProtein}`, stroke: "black" },
            { color: "#cc00cc", text: "Selected Peptide", stroke: "#cc00cc" },
            { color: "#d9d9d9", text: "Other Peptides", stroke: "none" }
        ];
    
        legend.selectAll(null)
            .data(colors)
            .enter()
            .append("g")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`) // Space out legend entries
            .each(function(d) {
                const entry = d3.select(this);
                entry.append("circle")
                    .attr("cx", 9)
                    .attr("cy", 9)
                    .attr("r", 9)
                    .attr("fill", d.color)
                    .attr("stroke", d.stroke)
                    .attr("stroke-width", d.color === "#ffa500" ? 1.5 : 0); // Apply stroke width if orange
                entry.append("text")
                    .attr("x", 24)
                    .attr("y", 14)
                    .text(d.text);
            });
    }
    
    
    
    function createPlot(container, data, index, highlightedProtein, x,y, experimentID) {
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
        
        svg.append("text")
            .attr("x", width)  // Position text at the right side of the plot
            .attr("y", 0)      // Position text at the very top of the plot
            .attr("text-anchor", "end")  // Anchor text to the end (right side)
            .attr("fill", "#888")  // Grey color for the text
            .text(experimentID)  // Display the experiment ID
            .style("font-size", "12px"); 

        const tooltip = svg.append("g")
            .style("display", "none");

        tooltip.append("text")
            .attr("class", "pep-key-label")
            .attr("x", 10)
            .attr("y", 20)
            .attr("font-size", "12px");

        tooltip.append("text")
            .attr("class", "protein-name-label")
            .attr("x", 10)
            .attr("y", 35)
            .attr("font-size", "12px");

        const tooltipBackground = tooltip.insert("rect", "text")
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", "0.5px")
            .attr("x", -5)
            .attr("y", -5)
            .attr("width", 0)
            .attr("height", 0);

        const xAxis = svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));
        
        const yAxis = svg.append("g")
            .call(d3.axisLeft(y));

        xAxis.selectAll("path, line")
            .attr("stroke", "#d9d9d9"); 
        yAxis.selectAll("path, line")
            .attr("stroke", "#d9d9d9");

        const points = svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", d => x(d.diff))
            .attr("cy", d => y(-Math.log10(d.adj_pval)))
            .attr("r", 3)
            .attr("class", d => `pep-key-${d.pep_grouping_key.replace(/\s+/g, '-')}`)
            .style("fill", d => d.pg_protein_accessions === highlightedProtein ? "#ffa500" : "#d9d9d9")
            .classed("highlighted", d => d.pg_protein_accessions === highlightedProtein);

        svg.selectAll(".highlighted").raise();

        points.on("mouseover", function(event, d) {
            tooltipBackground
                .attr("width", 0)
                .attr("height", 0)
                .attr("fill", "white");

            d3.select(this)
                .attr("fill", "#cc00cc")
                .attr("r", 4.5)
                .attr("stroke", "#cc00cc") 
                .attr("stroke-width", 1.5) 
                .raise();

            highlightOthers(d.pep_grouping_key, true);

            svg.selectAll(".tooltip").raise();
            tooltip.select(".pep-key-label").text(`Pep Key: ${d.pep_grouping_key}`);
            tooltip.select(".protein-name-label").text(`Protein: ${d.pg_protein_accessions}`);


            tooltip.style("display", null)
                .attr("transform", `translate(${x(d.diff)},${y(-Math.log10(d.adj_pval)) - 50})`)
                .raise();

            let bbox = tooltip.node().getBBox();
            tooltipBackground
                .attr("x", bbox.x - 5)
                .attr("y", bbox.y - 5)
                .attr("width", bbox.width + 10)
                .attr("height", bbox.height + 10);
        });

        points.on("mouseout", function(event, d) {
            d3.select(this)
                .attr("fill", d.pg_protein_accessions === highlightedProtein ? "#ffa500" : "#d9d9d9")
                .attr("r", 3)
                .attr("stroke", "none");

            highlightOthers(d.pep_grouping_key, false);

            tooltip.style("display", "none");
            tooltipBackground
                .attr("width", 0)
                .attr("height", 0);
        });

        // Axis labels
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

        return svg;
    }
    
    return <div ref={chartRef} />;
}

export default VolcanoPlot;