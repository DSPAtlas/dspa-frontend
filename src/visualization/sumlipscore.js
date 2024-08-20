import * as d3 from 'd3';

export function SumLipScoreVisualization({ data }) {
    // data  const data = {"LIP000004": 95.91674263379335,  "LIP000002": 12.856172023786394};
    // Convert the data into an array of objects
    const formattedData = Object.entries(data).map(([key, value]) => ({ experiment: key, score: value }));

    // Set the dimensions of the canvas
    const margin = { top: 50, right: 30, bottom: 70, left: 300 },
        width = 900 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // Remove any existing SVG
    d3.select("#sumlipscorebarplot").selectAll("*").remove();

    // Create the SVG container
    const svg = d3.select("#sumlipscorebarplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create a tooltip div that is hidden by default
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("pointer-events", "auto");

    // X scale
    const x = d3.scaleBand()
        .domain(formattedData.map(d => d.experiment))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(formattedData, d => d.score)])
        .nice()
        .range([height, 0]);

    const color = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(formattedData, d => d.score)])
        .range(["#FEB562","#FF4169"]);


    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(-height))
        .selectAll("text")
        .style("font-size", "16px")
        .style("font-family", "Raleway");

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "16px")
        .style("font-family", "Raleway");

    // Add bars
    svg.selectAll(".bar")
        .data(formattedData)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.experiment))
        .attr("y", d => y(d.score))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.score))
        .attr("fill", d => color(d.score))
        .on("mouseover", function(event, d) {
            tooltip.html(`<strong>${d.experiment}</strong><br>Score: ${d.score}`)
                   .style("visibility", "visible");
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });

    // Add title
    svg.append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-family", "Raleway")
        .text("Sum Lipid Score Visualization");

    // Add x-axis label
    svg.append("text")
        .attr("class", "xlabel")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 20)
        .attr("text-anchor", "middle")
        .style("font-family", "Raleway")
        .text("Experiment");

    // Add y-axis label
    svg.append("text")
        .attr("class", "ylabel")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .style("font-family", "Raleway")
        .text("Score");

    tooltip.on("mouseover", function() {
        tooltip.style("visibility", "visible");
    }).on("mouseout", function() {
        tooltip.style("visibility", "hidden");
    });

}