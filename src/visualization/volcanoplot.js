import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';


const VolcanoPlot = ({ differentialAbundanceDataList, highlightedProtein}) => {
  const svgRef = useRef();
  const [page, setPage] = useState(0);

  function cssSafeKey(key) {
    return key.replace(/[^\w-]/g, '_'); 
  }
  
  function highlightOthers(pepKey, shouldHighlight) {
    const className = `.pep-key-${cssSafeKey(pepKey)}`;
    const container = d3.select(svgRef.current);
  
    container.selectAll(className)
      .attr('fill', function(d) {
        return shouldHighlight ? '#cc00cc' : (d.pg_protein_accessions === highlightedProtein ? '#ffa500' : '#d9d9d9');
      })
      .attr('r', shouldHighlight ? 4.5 : 3)
      .attr('stroke', shouldHighlight ? '#cc00cc' : 'none')
      .attr('stroke-width', shouldHighlight ? 1.5 : 0)
      .each(function() {
        if (shouldHighlight) {
          d3.select(this).raise();
        }
      });
  }
  

  useEffect(() => {
    if (!Array.isArray(differentialAbundanceDataList) || differentialAbundanceDataList.length === 0) return;

    const container = d3.select(svgRef.current);
    container.selectAll('*').remove(); 
    const containerNode = svgRef.current;
    const containerRect = containerNode.getBoundingClientRect();



    const sortedDataList = [...differentialAbundanceDataList].sort((a, b) => {
      const aStats = getAxisRange(a.data);
      const bStats = getAxisRange(b.data);
      return (bStats.xRange + bStats.yRange) - (aStats.xRange + aStats.yRange);
    });

    const allData = sortedDataList.flatMap(exp => exp.data);
    const xExtent = d3.extent(allData, d => d.diff);
    const yMax = d3.max(allData, d => -Math.log10(d.adj_pval));
    
    const plotsPerPage = 2;
    const start = page * plotsPerPage;
    const end = start + plotsPerPage;

    const margin = { top: 30, right: 30, bottom: 30, left: 30 };


    const fullWidth =  250;
    const fullHeight = 250;

    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;


    const visibleData = sortedDataList.slice(start, end);

    visibleData.forEach(exp => {
      const data = exp.data;
      const key = exp.experimentID;

      const wrapper = container.append("div")
        .attr("class", "plot-wrapper");

      const svg = wrapper.append("svg")
        .attr("viewBox", `0 0 ${fullWidth} ${fullHeight}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "100%");
      
      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear().domain(xExtent).range([0, width]);
      const y = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

      const tooltip = g.append("g")
          .style("display", "none");

      tooltip.append("text")
          .attr("class", "pep-key-label")
          .attr("x", 10)
          .attr("y", 20)

      tooltip.append("text")
          .attr("class", "protein-name-label")
          .attr("x", 10)
          .attr("y", 35)

      const tooltipBackground = tooltip.insert("rect", "text")
          .attr("fill", "white")
          .attr("stroke", "black")
          .attr("stroke-width", "0.5px")
          .attr("x", -5)
          .attr("y", -5)
          .attr("width", 0)
          .attr("height", 0);

      g.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x).ticks(5));
         
      g.append("g").call(d3.axisLeft(y));

      g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.diff))
        .attr("cy", d => y(-Math.log10(d.adj_pval)))
        .attr("r", 3)
        .attr("class", d => `pep-key-${d.pep_grouping_key.replace(/\s+/g, '-')}`)
        .style("fill", d => d.pg_protein_accessions === highlightedProtein ? "#ffa500" : "#d9d9d9")
        .each(function(d) {
          if (d.pg_protein_accessions === highlightedProtein) {
            d3.select(this).raise(); 
          }
        })
        .on("mouseover", function (event, d) {
          tooltipBackground.attr("width", 0).attr("height", 0);
          d3.select(this)
            .attr("fill", "#cc00cc")
            .attr("r", 4.5)
            .attr("stroke", "#cc00cc")
            .attr("stroke-width", 1.5);

          highlightOthers(d.pep_grouping_key, true);

          const tooltip = d3.select("#html-tooltip");
          tooltip
            .style("display", "block")
            .html(`
              <strong>Pep Key:</strong> ${d.pep_grouping_key}<br/>
              <strong>Protein:</strong> ${d.pg_protein_accessions}
            `)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 40}px`);
        

          svg.selectAll(".tooltip").raise();
        })
        .on("mouseout", function (event, d) {
          d3.select(this)
            .attr("fill", d.pg_protein_accessions === highlightedProtein ? "#ffa500" : "#d9d9d9")
            .attr("r", 3)
            .attr("stroke", "none");

          highlightOthers(d.pep_grouping_key, false);
          d3.select("#html-tooltip").style("display", "none");

        });

      g.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("font-size", "17px")
        .attr("font-family", "Raleway, Arial, sans-serif")
        .text(key);
    });
  }, [differentialAbundanceDataList, highlightedProtein, page]);

  const totalPages = Math.ceil((differentialAbundanceDataList?.length || 0) / 2);

  return (
    <div>
      {/* Centered Legend and Buttons */}
     
      <div className="volcano-plot-legend">
        <div className="volcano-plot-legend-item">
          <div style={{ backgroundColor: '#ffa500', border: '1.5px solid black', borderRadius: '50%', width: 18, height: 18 }} />
          <span>Peptides in {highlightedProtein}</span>
        </div>
        <div className="volcano-plot-legend-item">
          <div style={{ backgroundColor: '#cc00cc', borderRadius: '50%', width: 18, height: 18 }} />
          <span>Selected Peptide</span>
        </div>
        <div className="volcano-plot-legend-item">
          <div style={{ backgroundColor: '#d9d9d9', borderRadius: '50%', width: 18, height: 18 }} />
          <span>Other Peptides</span>
        </div>
  

        </div>
        <div style={{ position: 'relative' }}>
        <div id="html-tooltip" className="html-tooltip" />
      <div
        ref={svgRef}
        className="volcano-plot-section"
      />

      {totalPages > 1 && (
        <div className="plot-grid-wrapper-volcano">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
            &lt;
          </button>
          <span>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>
            &gt;
          </button>
        </div>
      )}
    </div>
    </div>
    
  );
  
};


function getAxisRange(data) {
  const xExtent = d3.extent(data, d => d.diff);
  const yValues = data.map(d => -Math.log10(d.adj_pval));
  const yExtent = d3.extent(yValues);
  return {
    xRange: Math.abs(xExtent[1] - xExtent[0]),
    yRange: Math.abs(yExtent[1] - yExtent[0])
  };
}

export default VolcanoPlot;