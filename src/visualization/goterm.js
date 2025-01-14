import * as d3 from 'd3';

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




export function GOEnrichmentVisualization({ goEnrichmentData, chartRef, onGoTermClick, selectedGoTerm }) {
    if (!goEnrichmentData || !Array.isArray(goEnrichmentData)) {
        console.error("Invalid goEnrichmentData structure");
        return;
    }

    const chartElement = d3.select(chartRef.current);
    if (chartElement.empty()) {
        console.error("Chart element is not found.");
        return;
    }

    const dynaprot_colors = [
        "#be9fd2",
        "#d89853",
        "#b3c5da",
        "#d35eb6",
        "#71b6c8",
        "#d9ce74",
        "#99c2c5"
    ];
    

    // Get container dimensions
    const containerWidth = chartRef.current.offsetWidth || 800; // Default fallback
    const containerHeight = chartRef.current.offsetHeight || 400;

    const margin = { top: 50, right: 70, bottom: 200, left: 70 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Flatten the data
    const flattenedData = goEnrichmentData
        .flatMap(experiment =>
            experiment.data.map(d => ({
                ...d,
                experimentID: experiment.experimentID,
                accessions: d.accessions ? d.accessions.split(";").map(a => a.trim()) : [] // Handle splitting here
            }))
        )
        .filter(d => d.adj_pval < 1);

    // Group by goName
    const groupedData = d3.groups(flattenedData, d => d.term);
    const experimentIDs = Array.from(new Set(flattenedData.map(d => d.experimentID)));

    // Remove any existing SVG
    chartElement.selectAll("*").remove();

    // Create the SVG container
    const svg = chartElement.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x0 = d3.scaleBand()
        .domain(groupedData.map(d => d[0])) // GO terms
        .range([0, width])
        .padding(0.2);

    const x1 = d3.scaleBand()
        .domain(experimentIDs) // Experiments within each GO term
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain([0, d3.max(flattenedData, d => -Math.log10(d.adj_pval) || 0)]) // Ensure no NaN in y-domain
        .nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(experimentIDs)
        .range(dynaprot_colors.length >= experimentIDs.length
            ? dynaprot_colors.slice(0, experimentIDs.length) // Use only the required number of colors
            : d3.schemeTableau10); 

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0))
        .selectAll(".tick text")
        .style("font-size", "14px")
        .style("font-family", "Raleway")
        .style("text-anchor", "middle")
       // .attr("transform", "rotate(-45)")
        .call(wrapText, x0.bandwidth());

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "14px")
        .style("font-family", "Raleway");

    // Add bars
    svg.selectAll("g.goTermGroup")
        .data(groupedData)
        .enter().append("g")
        .attr("class", "goTermGroup")
        .attr("transform", d => `translate(${x0(d[0])}, 0)`)
        .selectAll("rect")
        .data(d => d[1])
        .enter().append("rect")
        .attr("x", d => x1(d.lipexperiment_id))
        .attr("y", d => y(-Math.log10(d.adj_pval)))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(-Math.log10(d.adj_pval)))
        .attr("fill", d => d.term === selectedGoTerm ? d3.color(color(d.experimentID)).darker(2) : color(d.experimentID))
        .on("click", (event, d) => {
            const accessionsList = d.accessions || [];
            if (onGoTermClick) {
                onGoTermClick(d.term, accessionsList);
            }
        });

    // Add legend dynamically
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 20}, 0)`);

    experimentIDs.forEach((id, index) => {
        legend.append("rect")
            .attr("x", 0)
            .attr("y", index * 20)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(id));

        legend.append("text")
            .attr("x", 20)
            .attr("y", index * 20 + 10)
            .attr("dy", "0.35em")
            .style("font-family", "Raleway")
            .style("font-size", "12px")
            .text(id);
    });

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-family", "Raleway")
        .text("Grouped Bar Plot of GO Enrichment by Experiment");

    // Add y-axis label
    svg.append("text")
        .attr("class", "ylabel")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .style("font-family", "Raleway")
        .text("-log10(Adj-pValue)");

    // Resize event listener for dynamic scaling
    window.addEventListener("resize", () => {
        chartElement.selectAll("*").remove();
        GOEnrichmentVisualization({ goEnrichmentData, chartRef, onGoTermClick, selectedGoTerm });
    });
}
