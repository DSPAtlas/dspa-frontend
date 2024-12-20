import * as d3 from 'd3';

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

    const margin = { top: 50, right: 70, bottom: 200, left: 70 },
          width = 1750 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

     // Flatten the data
    const flattenedData = goEnrichmentData
     .flatMap(experiment =>
         experiment.data.map(d => ({
             ...d,
             experimentID: experiment.experimentID,
             accessions: d.accessions ? d.accessions.split(";").map(a => a.trim()) : [] // Handle splitting here
         }))
         .filter(d => d.adj_pval < 1)
     );
 

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
        .domain(groupedData.map(d => d[0]))  // GO terms
        .range([0, width])
        .padding(0.2);

    const x1 = d3.scaleBand()
        .domain(experimentIDs)  // Experiments within each GO term
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain([0, d3.max(flattenedData, d => -Math.log10(d.adj_pval) || 0)])  // Ensure no NaN in y-domain
        .nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(experimentIDs)
        .range(d3.schemeTableau10);

    // Add x-axis
    // Add x-axis
    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0))
    .selectAll(".tick text")
    .style("font-size", "16px")
    .style("font-family", "Raleway")
    .style("text-anchor", "end") // Align end for better rotation
    .attr("transform", "rotate(-45)") // Rotate the text
    .each(function (d) {
        const self = d3.select(this);

        // Check if the label is longer than 20 characters
        if (d.length > 30) {
            const chunks = d.match(/.{1,30}/g); // Split into chunks of 20 characters
            self.text(""); // Clear existing text

            chunks.forEach((chunk, i) => {
                self.append("tspan")
                    .text(chunk)
                    .attr("x", 0) // Keep x position consistent
                    .attr("dy", i === 0 ? "0em" : "1em"); // Adjust vertical offset for each line
            });
        } else {
            self.text(d); // If not longer than 20 characters, show the label as is
        }
    });


    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "16px")
        .style("font-family", "Raleway");

    // Add bars with onClick functionality for each GO term
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
        .attr("fill", d => {
            const baseColor = color(d.experimentID);
            return d.term === selectedGoTerm ? d3.color(baseColor).darker(2) : baseColor; // Darken if selected
        })
        .on("click", function (event, d) {
            console.log("Clicked data:", d);
            const accessionsList = d.accessions || []; // Ensure accessions is not undefined
            console.log("Accessions list after processing:", accessionsList);
            if (onGoTermClick) {
                onGoTermClick(d.term, accessionsList);
            }
        });
        // .on("mouseover", function(event, d) {
        //     d3.select(this).style("opacity", 0.7);
        // })
        // .on("mouseout", function(event, d) {
        //     d3.select(this).style("opacity", 1);
        // });

    // Add legend for experiment colors
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
            .style("font-size", "16px")
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
}
