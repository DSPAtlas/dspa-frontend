import * as d3 from 'd3';
import React, { useEffect, useMemo, useRef,memo} from 'react';

function wrapText(selection, maxWidth, maxCharsPerLine = 25, maxLines = 25) {
   
    selection.each(function () {
        const text = d3.select(this);
        const fullText = text.text();
        const words = fullText.match(new RegExp(`.{1,${maxCharsPerLine}}`, 'g')) || [];
        const y = text.attr("y") || 0;
        const x = text.attr("x") || 0;
        const dy = parseFloat(text.attr("dy")) || 0;
        const lineHeight = 1.2; // Line height in ems
        let lineNumber = 0;

        text.text(null); // Clear existing text

        words.slice(0, maxLines).forEach((line, i) => {
            const tspan = text.append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", `${lineNumber * lineHeight + dy}em`)
                .text(line);
            lineNumber++;
        });

        if (words.length > maxLines) {
            const tspan = text.append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", `${lineNumber * lineHeight + dy}em`)
                .text("...");
        }

        // Apply rotation for better readability
        text.attr("transform", `rotate(-45)`)
            .style("text-anchor", "end");
    });
}


const GOEnrichmentVisualization = memo(({ goEnrichmentData, chartRef }) => {
    let isMounted = useRef(true);

    const setup = useMemo(() => {
        if (!goEnrichmentData || goEnrichmentData.length === 0) {
            return null; 
        }
    
        const dynaprotColors = [
            "#be9fd2", "#d89853", "#b3c5da", "#d35eb6", "#71b6c8", "#d9ce74", "#99c2c5"
        ];

        const experimentIDs = Array.from(new Set(goEnrichmentData.map(d => d.dpx_comparison)));
        const groupedData = d3.groups(goEnrichmentData, d => d.go_term);
        const maxAdjPValLog = d3.max(goEnrichmentData, d => -Math.log10(d.adj_pval) || 0);
    
        const colorScale = d3.scaleOrdinal()
            .domain(experimentIDs)
            .range(dynaprotColors);
    
        return { experimentIDs, groupedData, maxAdjPValLog, colorScale };
    }, [goEnrichmentData]);
    

    const renderChart = (containerWidth) => {
        if (!setup || !isMounted.current) return;
        const { experimentIDs, groupedData, maxAdjPValLog, colorScale } = setup;
        const dynamicHeight = Math.max(400, maxAdjPValLog * 2 * groupedData.length);
        let maxLabelWidth = d3.max(experimentIDs, id => (id ? id.length * 12 : 0));
        let margin = { top: 50, right: maxLabelWidth + 40, bottom: 250, left: 100 };
        let width = containerWidth - margin.left - margin.right;
        let height = dynamicHeight - margin.top - margin.bottom;

        const svgContainer = d3.select(chartRef.current);
        svgContainer.selectAll("*").remove();

        const svg = svgContainer.append("svg")
            .attr("width", containerWidth)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

            const xScale = d3.scaleBand()
            .domain(groupedData.map(d => d[0]))
            .range([0, width])
            .padding(0.1);

        const xSubgroup = d3.scaleBand()
            .domain(experimentIDs)
            .range([0, xScale.bandwidth()])
            .padding(0.05);

        const yScale = d3.scaleLinear()
            .domain([0, maxAdjPValLog])
            .nice()
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll(".tick text")

            .style("text-anchor", "middle")
            .call(wrapText, xScale.bandwidth());;

        svg.append("g")
            .call(d3.axisLeft(yScale));

        const barGroups = svg.selectAll("g.bar")
            .data(groupedData)
            .enter().append("g")
            .attr("transform", d => `translate(${xScale(d[0])}, 0)`);
        
        barGroups.selectAll("rect")
            .data(d => d[1].map(data => ({
                ...data,
                experimentID: data.dpx_comparison // Fix: correctly extract experiment ID
            })))
            .enter().append("rect")
            .attr("x", d => xSubgroup(d.experimentID))  // Corrected to use experimentID
            .attr("y", d => yScale(-Math.log10(d.adj_pval)))
            .attr("width", xSubgroup.bandwidth())
            .attr("height", d => height - yScale(-Math.log10(d.adj_pval)))
            .attr("fill", d => colorScale(d.experimentID));
        
           // .on("click", d => onGoTermClick(d.term, d.accessions));

        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - 20}, 20)`);

        experimentIDs.forEach((id, index) => {
            legend.append("rect")
                .attr("x", 0)
                .attr("y", index * 20)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", colorScale(id));

            legend.append("text")
                .attr("x", 20)
                .attr("y", index * 20 + 10)
                .attr("dy", "0.35em")
                .text(id);
        });

        // Add title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .text("Grouped Bar Plot of GO Enrichment by Experiment");

        // Add y-axis label
        svg.append("text")
            .attr("class", "ylabel")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 20)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("-log10(Adj-pValue)");

       
    };

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === chartRef.current) {
                    renderChart(entry.contentRect.width);
                }
            }
        });
    
        if (chartRef.current) {
            resizeObserver.observe(chartRef.current);
        }
    
        return () => {
            if (chartRef.current) {
                resizeObserver.unobserve(chartRef.current);
            }
            if (isMounted.current) {
                d3.select(chartRef.current).selectAll("*").remove();
            }
        };
    }, [setup, chartRef, renderChart]);
    

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        <div ref={chartRef} className="go-enrichment-visualization">
        </div>
    ); 
});

export default GOEnrichmentVisualization;



