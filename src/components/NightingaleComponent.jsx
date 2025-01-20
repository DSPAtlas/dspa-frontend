import React, { useEffect, useRef, useState } from 'react';
import "@nightingale-elements/nightingale-sequence";
import "@nightingale-elements/nightingale-navigation";
import "@nightingale-elements/nightingale-manager";
import "@nightingale-elements/nightingale-colored-sequence";
import "@nightingale-elements/nightingale-track";

import "@dspa-nightingale/nightingale-structure/nightingale-structure";

import "@nightingale-elements/nightingale-msa";
import "@nightingale-elements/nightingale-sequence-heatmap";


const NightingaleComponent = ({
    proteinData, 
    pdbIds, 
    selectedPdbId, 
    setSelectedPdbId, 
    selectedExperiment, 
    showHeatmap = true,
    passedExperimentIDs
}) => {
    
    const structureRef = useRef(null); 
    const containerRef = useRef(null); 
    const seqContainer = useRef(null);
    const residuelevelContainer = useRef(null);
    const featuresContainer = useRef(null);
    const multipleExperimentsContainer = useRef(null);
    const scoreBarcodeContainer = useRef(null);
    const sequenceLength = proteinData.proteinSequence.length;
    
    const [selectedButton, setSelectedButton] = useState(0);
    const [isHeatmapReady, setHeatmapReady] = useState(false);
    const experimentIDsList = passedExperimentIDs?.length > 0 
    ? passedExperimentIDs 
    : proteinData.experimentIDsList.length > 0
        ? proteinData.experimentIDsList
        : proteinData.lipscoreList.map(entry => entry.experimentID);
    const [selectedExperimentDropdown, setSelectedExperimentDropdown] = useState(experimentIDsList[0]);

    const structureRefs = useRef(experimentIDsList.map(() => React.createRef()));
    const [trackHeight, setTrackHeight] = useState(15);

    const proteinName = proteinData.proteinName;
    const highlightColor = "rgb(235, 190, 234)";
    const minWidth = "1200";
   
    const [structures, setStructures] = useState(() => {
        // Ensure proteinData and experimentIDsList are valid
        if (!proteinData || !proteinData.proteinSequence || !experimentIDsList) {
            console.error("Invalid proteinData or experimentIDsList");
            return [];
        }
    
        const sequenceLength = proteinData.proteinSequence.length;
        const defaultLipScoreString = JSON.stringify(Array(sequenceLength).fill(-1));
    
        return experimentIDsList.map((experimentID, index) => {
            let lipScoreArray = null;
            try {
                lipScoreArray = getLipScoreDataByExperimentID(experimentID);
            } catch (err) {
                console.error(`Error fetching lip score for experimentID ${experimentID}:`, err);
            }
    
            const lipScoreString = lipScoreArray ? JSON.stringify(lipScoreArray) : defaultLipScoreString;
    
            return {
                id: index + 1,
                lipScoreString: lipScoreString,
                isVisible: index === 0, // First experiment is visible
            };
        });
    });
    
    

    const nightingaleTdStyleTrack = {
        padding: "0",
        margin: "0",
        backgroundColor: "#f9f9f9",
        borderBottom: "1px solid #ddd",
        height: "30px",
    };

    const hasDomainData = proteinData.featuresData?.features?.some(({ type }) => type === "DOMAIN");
    const hasRegionData = proteinData.featuresData.features.some(({ type }) => type === "REGION");
    const hasSiteData = proteinData.featuresData.features.some(({ type }) => type === "SITE");
    const hasBindingData = proteinData.featuresData.features.some(({ type }) => type === "BINDING");
    const hasChainData = proteinData.featuresData.features.some(({ type }) => type === "CHAIN");
    const hasDisulfidData = proteinData.featuresData.features.some(({ type }) => type === "DISULFID");
    const hasBetaStrandData = proteinData.featuresData.features.some(({ type }) => type === "STRAND");

    const visibleTracks = [
        hasDomainData && "domain",
        hasBindingData && "binding",
        hasSiteData && "site",
        hasChainData && "chain",
        hasDisulfidData && "disulfide-bond",
        hasBetaStrandData && "beta-strand",
        hasRegionData && "region",
        showHeatmap && "heatmap"
    ].filter(Boolean);

    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current) {
                const totalHeight = containerRef.current.getBoundingClientRect().height;
                const structureHeight = structureRef.current
                    ? structureRef.current.getBoundingClientRect().height
                    : 0;
                const navigationHeight = document.getElementById("navigation")
                    ? document.getElementById("navigation").offsetHeight
                    : 0;
                const availableTrackHeight = totalHeight - structureHeight - navigationHeight - 80;
                const dynamicTrackHeight = Math.max(
                    availableTrackHeight / (visibleTracks.length || 1),
                    15
                ); 
                setTrackHeight(dynamicTrackHeight);
            }
        };
    
        const handleTouchStart = () => {
            // You can call updateHeight here if touch interactions could affect element sizes
            updateHeight();
        };
    
        // Add both resize and touchstart listeners
        window.addEventListener("resize", updateHeight);
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
    
        // Initial call to update the height
        updateHeight();
    
        // Cleanup function to remove both event listeners
        return () => {
            window.removeEventListener("resize", updateHeight);
            window.removeEventListener("touchstart", handleTouchStart);
        };
    }, [visibleTracks.length]); // Dependencies stay the same
    
    
    
    const checkDimensions = (element) => {
        return element && element.offsetWidth > 0 && element.offsetHeight > 0;
    };

    const handleButtonClick = (experimentID, index) => {
        setSelectedButton((prevIndex) => (prevIndex === index ? null : index)); 
        if (selectedButton === index) {
            handleExperimentClick(0, index);
        } else {
            handleExperimentClick(experimentID, index);
        }
    };

    const handleUnselectColoring = () => {
        setStructures((prevStructures) =>
            prevStructures.map((structure) => ({
                ...structure,
                isVisible: false,
                lipScoreString: JSON.stringify(Array(sequenceLength).fill(-1)), 
            }))
        );
    };
    
    

    const handleDropdownChange = (event) => {
        const selectedExperiment = event.target.value;
        if (selectedExperiment === "none") {
            handleUnselectColoring();
        } else {
            setSelectedExperimentDropdown(selectedExperiment);
            const experimentIndex = experimentIDsList.indexOf(selectedExperiment);
            handleButtonClick(selectedExperiment, experimentIndex);
        }
    };

    const getLipScoreDataByExperimentID = (experimentID) => {
        if (!proteinData || !proteinData.lipscoreList) return null;
        const lipScoreEntry = proteinData.lipscoreList.find(entry => entry.experimentID === experimentID);
        return lipScoreEntry ? lipScoreEntry.data : null;
    };

    const handleExperimentClick = (experimentID, index) => {
        if (experimentID === 0) { // Ensure proper comparison with ===
            const sequenceLength = 100000//proteinData.proteinSequence.length;
            const defaultLipScoreString = JSON.stringify(Array(sequenceLength).fill(-1));
    
            setStructures(prevStructures =>
                prevStructures.map((structure, idx) => ({
                    ...structure,
                    lipScoreString: defaultLipScoreString,
                    isVisible: idx === 0
                }))
            ); 
        } else {
            const lipScoreArray = getLipScoreDataByExperimentID(experimentID);
    
            if (lipScoreArray) {
                const lipScoreString = JSON.stringify(lipScoreArray);
    
                setStructures(prevStructures =>
                    prevStructures.map((structure, idx) =>
                        idx === index
                            ? { ...structure, lipScoreString, isVisible: true }
                            : { ...structure, isVisible: false }
                    )
                );
            } else {
                console.error(`No data found for experiment ID: ${experimentID}`);
            }
        }
    };
    

    useEffect(() => {
        const sequenceLength = proteinData.proteinSequence.length;
        const defaultLipScoreString = JSON.stringify(Array(sequenceLength).fill(-1)); 

        if (selectedExperiment) {
            const lipScoreArray = getLipScoreDataByExperimentID(selectedExperiment);

            const lipScoreString = lipScoreArray ? JSON.stringify(lipScoreArray) : defaultLipScoreString;

            setStructures(prevStructures =>
                prevStructures.map((structure, idx) => ({
                    ...structure,
                    lipScoreString: idx === 0 ? lipScoreString : defaultLipScoreString,
                    isVisible: idx === 0  
                }))
            );
        } else {
            setStructures(prevStructures =>
                prevStructures.map((structure, idx) => ({
                    ...structure,
                    lipScoreString: defaultLipScoreString,
                    isVisible: idx === 0  
                }))
            );
        }
    }, [selectedExperiment, proteinData.proteinSequence.length]);

    useEffect(() => {
        const adjustDimensions = () => {
            const container = document.querySelector('#nightingale-manager-container');
            if (container) {
                const width = container.offsetWidth;
                const height = container.offsetHeight;
            }
        };
        window.addEventListener('resize', adjustDimensions);
        adjustDimensions();
    
        return () => window.removeEventListener('resize', adjustDimensions);
    }, []);

    useEffect(() => {
        structures.forEach((structure, idx) => {
            const structureRef = structureRefs.current[idx].current;
            if (structureRef && structure.isVisible) {
                structureRef.setAttribute('protein-accession', proteinName);
                structureRef.setAttribute('structure-id', selectedPdbId);
                structureRef.setAttribute('highlight-color', '#FF6699');
                structureRef.setAttribute('lipscore-array',  structure.lipScoreString);
            }
        });
    }, [structures, proteinName, selectedPdbId]);

    useEffect(()=> {
        if(seqContainer && customElements.whenDefined("nightingale-sequence")) {
          seqContainer.current.data = proteinData.featuresData.sequence;
        }
      }, [proteinData.featuresData.sequence]);

    useEffect(() => {
        customElements.whenDefined("nightingale-colored-sequence").then(() => {
            if (residuelevelContainer.current && checkDimensions(residuelevelContainer.current)) {
                residuelevelContainer.current.data = proteinData.barcodeSequence;
            }
        });
    }, [proteinData.barcodeSequence]);

    useEffect(() => {
        customElements.whenDefined("nightingale-msa").then(() => {
            if (multipleExperimentsContainer.current && checkDimensions(multipleExperimentsContainer.current)) {
                const data = Object.keys(proteinData.barcodeSequence).map((key, index) => ({
                    name: key,
                    sequence: proteinData.barcodeSequence[key]
                }));
                multipleExperimentsContainer.current.data = data;
            }
        });
    }, [proteinData.barcodeSequence]);

    useEffect(() => {
        customElements.whenDefined("nightingale-track").then(() => {
            if (featuresContainer.current && proteinData.featuresData.features && checkDimensions(featuresContainer.current)) {
                const tooltip = document.getElementById("tooltip");
                if (!tooltip) {
                    console.error("Tooltip element not found!");
                    return;
                }
        
                const mappedFeatures = proteinData.featuresData.features.map((ft) => ({
                    ...ft,
                    start: ft.start || ft.begin,
                    tooltipContent: ft.type === "BINDING" && !ft.description ? 
                    `Ligand: ${ft.ligand?.name || "No ligand information"}` : 
                    (ft.description || "No description available"),
                }));

                const updateTooltip = (content, x, y) => {
                    tooltip.innerHTML = `
                        <div class="simple-tooltip">
                            ${content}
                        </div>
                    `;
                    tooltip.style.top = `${y}px`;
                    tooltip.style.left = `${x}px`;
                    tooltip.style.visibility = "visible";
                };

                const trackIds = [
                    { id: "domain", type: "DOMAIN" },
                    { id: "region", type: "REGION" },
                    { id: "site", type: "SITE" },
                    { id: "binding", type: "BINDING" },
                    { id: "chain", type: "CHAIN" },
                    { id: "disulfide-bond", type: "DISULFID" },
                    { id: "beta-strand", type: "STRAND" }
                ];

                trackIds.forEach(({ id, type, label }) => {
                    const trackElement = document.querySelector(`#${id}`);
                    if (trackElement) {
                        const trackFeatures = mappedFeatures.filter(({ type: featureType }) => featureType === type);
                        
                        trackElement.data = trackFeatures;

                        trackElement.addEventListener("mousemove", (event) => {
                                        // Calculate approximate position
                                        const trackLength = trackElement.getAttribute("length");
                                        const relativeX = event.offsetX / trackElement.clientWidth;
                                        const position = Math.floor(relativeX * trackLength);
                    
                                        // Find the closest feature to this position
                                        const feature = trackFeatures.find(f => f.start <= position && f.end >= position);
                                        if (feature) {
                                            updateTooltip(feature.tooltipContent, event.pageX, event.pageY);
                                        }
                                    });
                        trackElement.setAttribute('show-label', '');  // Enable labels
                        trackElement.setAttribute('label', label);    // Set the label text
                    }
                });
                
                const domain = document.querySelector("#domain");
                const region = document.querySelector("#region");
                const site = document.querySelector("#site");
                const binding = document.querySelector("#binding");
                const chain = document.querySelector("#chain");
                const disulfide = document.querySelector("#disulfide-bond");
                const betaStrand = document.querySelector("#beta-strand");
    
                if (domain) {
                    const domainData = mappedFeatures.filter(({ type }) => type.toUpperCase() === "DOMAIN");
                    domain.data = domainData;
                }
    
                if (region) {
                    const regionData = mappedFeatures.filter(({ type }) => type.toUpperCase() === "REGION");
                    region.data = regionData;
                }
    
                if (site) {
                    const siteData = mappedFeatures.filter(({ type }) => type.toUpperCase() === "SITE");
                    site.data = siteData;
                }
    
                if (binding) {
                    const bindingData = mappedFeatures.filter(({ type }) => type.toUpperCase() === "BINDING");
                    binding.data = bindingData;
                }
    
                if (chain) {
                    const chainData = mappedFeatures.filter(({ type }) => type.toUpperCase() === "CHAIN");
                    chain.data = chainData;
                }
    
                if (disulfide) {
                    const disulfideData = mappedFeatures.filter(({ type }) => type.toUpperCase() === "DISULFID");
                    disulfide.data = disulfideData;
                }
    
                if (betaStrand) {
                    const betaStrandData = mappedFeatures.filter(({ type }) => type.toUpperCase() === "STRAND");
                    betaStrand.data = betaStrandData;
                }
            }
        });
    }, [proteinData.featuresData]);    

    useEffect(() => {
        customElements.whenDefined("nightingale-sequence-heatmap").then(() => {
            if (scoreBarcodeContainer.current && checkDimensions(scoreBarcodeContainer.current)) {

                const experimentMetaDataMap = new Map();
                proteinData.experimentMetaData.forEach((meta) => {
                    experimentMetaDataMap.set(meta.lipexperiment_id, meta);
                });

                const dataHeatmap = Object.entries(proteinData.differentialAbundanceData).flatMap(([key, values]) =>
                    values.map(value => {
                        const metaData = experimentMetaDataMap.get(key); 
                        return {
                            yValue: key,
                            xValue: value.index,
                            score: value.score === null ? 0 : value.score,
                            condition: metaData ? metaData.condition : "N/A", 
                        };
                    })
                );

                const xValues = dataHeatmap.map(item => item.xValue);
                const smallestXValue = Math.min(...xValues);
                const largestXValue = Math.max(...xValues);

                const xDomain = Array.from({ length: largestXValue - smallestXValue + 1 }, (_, i) => i + smallestXValue);
                const yDomain = Object.keys(proteinData.differentialAbundanceData);

                const heatmapElement = document.getElementById("id-for-nightingale-sequence-heatmap");
                if (heatmapElement && heatmapElement.setHeatmapData) {
                    heatmapElement.setHeatmapData(xDomain, yDomain, dataHeatmap);
                    setHeatmapReady(true);
                }
            }
        });
    }, [proteinData.differentialAbundanceData, proteinData.experimentMetaData]);

    if (isHeatmapReady) {
        const heatmapElement = document.getElementById("id-for-nightingale-sequence-heatmap");
        heatmapElement.heatmapInstance.setTooltip((d, x, y, xIndex, yIndex) => {
            let returnHTML = `
                <div class="tooltip-container">
                    Experiment: <a href="/experiment/${d.yValue}" target="_blank" class="tooltip-link"><strong>${d.yValue}</strong></a><br />
                    Condition: <strong class="tooltip-highlight">${d.condition || "N/A"}</strong><br />
                    LiP Score: <strong>${d.score.toFixed(2)}</strong>
                </div>`;
            return returnHTML;
        });
    }


    const legendData = [ 
        { color: '#acc1db', label: '0 - 3' },
        { color: '#fbeaf5', label: '3 - 4' },
        { color: '#f2c0e1', label: '4 - 5' },
        { color: '#da49a9', label: '5 - 7' },
        { color: '#782162', label: '> 7' },
        { color: '#CCCCCC', label: 'no LiP Score reported' }
    ];
    

    return (
        <div>
            <p>{selectedExperiment}</p>
            <p style={{ color: '#1a1a1a', fontSize: '18px' }} >{proteinData?.proteinDescription}</p>

            {/* LiP Scores Legend */}
            <div id="nightingale-manager-container">
                <p>LiP Scores Legend</p>
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    {legendData.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
                            <div
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: item.color === 'default' ? 'transparent' : item.color,
                                    border: item.color === 'default' ? '1px solid #000' : 'none',
                                    marginRight: '5px'
                                }}
                            ></div>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>

                <div>

            {experimentIDsList.length > 5 ? (
                // Render dropdown if more than 5 experiments
                <div>
                    <label htmlFor="experiment-dropdown">Color structure according to experiment:</label>
                    <select
                        id="experiment-dropdown"
                        value={selectedExperimentDropdown}
                        onChange={handleDropdownChange}
                    >
                        {experimentIDsList.map((experimentID) => (
                            <option key={experimentID} value={experimentID}>
                                {`Experiment ${experimentID}`}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                // Render buttons if 5 or fewer experiments
                <div className="experiment-buttons">
                    {experimentIDsList.map((experimentID, index) => (
                        <button
                            key={experimentID}
                            className={`experiment-button ${
                                selectedButton === index ? "selected" : ""
                            }`}
                            onClick={() => handleButtonClick(experimentID, index)}
                        >
                            {`Experiment ${experimentID}`}
                        </button>
                    ))}
                </div>
            )}
        </div>

                {/* Nightingale Manager with Two Columns */}
                <nightingale-manager>
                    <div id="tooltip" className="tooltip"></div>

                    <div >
                        {/* Left Column: Nightingale Structurestyle={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%'cd */}
                        <div style={{ position: 'relative', paddingRight: '20px', zIndex: '1' }}>
                            {structures.map((structure, idx) =>
                                structure.isVisible ? (
                                    <nightingale-structure
                                        key={structure.id}
                                        ref={structureRefs.current[idx]}
                                        protein-accession={proteinName}
                                        structure-id={selectedPdbId}
                                        margin-color="transparent"
                                        background-color="white"
                                        lipscore-array={structure.lipScoreString}
                                        highlight-color="#FFEB3B66"
                                    ></nightingale-structure>
                                ) : null
                            )}
                        </div>

                        {/* Right Column: Other Nightingale Elements */}
                        <div style={{ position: 'relative', paddingRight: '20px', zIndex: '2' }}>
                            <table>
                                <tbody>
                                    <tr  className="navigation-row">
                                    <td  className="text-column"></td>
                                        <td >
                                            <nightingale-navigation
                                                id="navigation"
                                                min-width={minWidth}
                                                length={sequenceLength}
                                                display-start="1"
                                                height={trackHeight}
                                                display-end={sequenceLength}
                                                margin-color="white"
                                                margin-left="50"
                                                highlight-color="#FFEB3B66"
                                            ></nightingale-navigation>
                                        </td>
                                    </tr>
                                    <tr  className="sequence-row">
                                        <td  className="text-column"> Sequence</td> 
                                        <td>
                                            <nightingale-sequence
                                                ref={seqContainer}
                                                sequence={proteinData.featuresData.sequence}
                                                min-width={minWidth}
                                                length={sequenceLength}
                                                height={trackHeight}
                                                display-start="1"
                                                display-end={sequenceLength}
                                                highlight-event="onmouseover"
                                                highlight-color="#FFEB3B66"
                                                margin-left="40"
                                                margin-color="aliceblue"
                                            ></nightingale-sequence>
                                        </td>
                                    </tr>
                                    {/* Additional Track Elements */}
                                    {hasDomainData && (
                                        <tr className="track-row">
                                         <td  className="text-column">Domain</td>
                                        <td >
                                                <nightingale-track
                                                    ref={featuresContainer}
                                                    id="domain"
                                                    min-width={minWidth}
                                                    height={trackHeight}
                                                    length={sequenceLength}
                                                    display-start="1"
                                                    display-end={sequenceLength}
                                                    margin-left="40"
                                                    highlight-color="#FFEB3B66"
                                                    highlight-event="onmouseover"
                                                ></nightingale-track>
                                            </td>
                                        </tr>
                                    )}
                                    {hasBindingData && (
                                  <tr className="track-row">
                                         <td  className="text-column">Binding site
                                        </td>
                                        <td >
                                        <nightingale-track
                                            id="binding"
                                            min-width={minWidth}
                                            height={trackHeight}
                                            length={sequenceLength} 
                                            display-start="1"
                                            display-end={sequenceLength} 
                                            highlight-color="#FFEB3B66"
                                            highlight-event="onmouseover"
                                            margin-left="40"
                                        ></nightingale-track>
                                        </td>
                                    </tr>
                                    )}
                               
                              
                             {hasChainData && (
                           <tr className="track-row">
                                <td  className="text-column">Chain </td>
                                <td style={nightingaleTdStyleTrack}> 
                                <nightingale-track
                                    id="chain"
                                    layout="non-overlapping"
                                    min-width={minWidth}
                                    height={trackHeight}
                                    length={sequenceLength} 
                                    display-start="1"
                                    display-end={sequenceLength} 
                                    highlight-color="#FFEB3B66"
                                    highlight-event="onmouseover"
                                    margin-left="40"
                                ></nightingale-track>
                                </td>
                            </tr>
                        )}
                            {hasDisulfidData && (
                            <tr className="track-row">
                                 <td  className="text-column">Disulfide bond</td>
                                <td style={nightingaleTdStyleTrack}>
                                <nightingale-track
                                    id="disulfide-bond"
                                    layout="non-overlapping"
                                    min-width={minWidth}
                                    height={trackHeight}
                                    length={sequenceLength} 
                                    display-start="1"
                                    display-end={sequenceLength} 
                                    highlight-color="#FFEB3B66"
                                    highlight-event="onmouseover"
                                    margin-left="40"
                                ></nightingale-track>
                                </td>
                            </tr>
                            )}
                            {hasBetaStrandData && (
                            <tr className="track-row">
                                <td  className="text-column">Beta strand</td>
                                <td style={nightingaleTdStyleTrack}>
                                <nightingale-track
                                    id="beta-strand"
                                    min-width={minWidth}
                                    length={sequenceLength} 
                                    height={trackHeight}
                                    display-start="1"
                                    display-end={sequenceLength} 
                                    highlight-color="#FFEB3B66"
                                    highlight-event="onmouseover"
                                    margin-left="40"
                                ></nightingale-track>
                                </td>
                            </tr>
                            )}
                              {hasSiteData && (
                               <tr className="track-row">
                                    <td  className="text-column">Site</td>
                                    <td >
                                    <nightingale-track
                                        id="site"
                                        min-width={minWidth}
                                        height={trackHeight}
                                        length={sequenceLength} 
                                        display-start="1"
                                        display-end={sequenceLength} 
                                        highlight-color="#FFEB3B66"
                                        highlight-event="onmouseover"
                                        margin-left="40"
                                    ></nightingale-track>
                                    </td>
                                </tr>
                            )}
                             {hasRegionData && (
                              <tr className="track-row">
                                     <td  className="text-column">Region </td>
                                    <td>
                                    <nightingale-track
                                        ref={featuresContainer}
                                        id="region"
                                        min-width={minWidth}
                                        height={trackHeight}
                                        length={sequenceLength} 
                                        display-start="1"
                                        display-end={sequenceLength} 
                                        highlight-color="#FFEB3B66"
                                        highlight-event="onmouseover"
                                        margin-left="40"
                                    ></nightingale-track>
                                    </td>
                                </tr>
                            )}
                             <tr className="track-row">
                                <td  className="text-column"></td>
                                <td style={nightingaleTdStyleTrack}>
                                </td>
                            </tr>
                                 {/* Continue with other track elements */}
                                 {showHeatmap && ( // Conditional rendering of heatmap
                                     <tr>
                                        <td>Score-Barcode</td>
                                        <td>
                                            <nightingale-sequence-heatmap
                                                ref={scoreBarcodeContainer}
                                                id="id-for-nightingale-sequence-heatmap"
                                                heatmap-id="seq-heatmap"
                                                min-width={minWidth}
                                                length={sequenceLength} 
                                                height="100"
                                                display-start="1"
                                                margin-left="60"
                                                display-end={sequenceLength}
                                                highlight-event="onmouseover"
                                                highlight-color={highlightColor}
                                                color-range="#ffe6f7:-2,#FF6699:2"
                                            ></nightingale-sequence-heatmap>
                                        </td>
                                    </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </nightingale-manager>
            </div>

            {/* Table for PDB selection 
           /* <div>
                <table className="pdb-selection-container">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Method</th>
                            <th>Resolution</th>
                            <th>Chains</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pdbIds.map((structure) => (
                            <tr
                                key={structure.id}
                                onClick={() => handleRowClick(structure.id)}
                                style={{
                                    backgroundColor: selectedPdbId === structure.id ? '#f0f0f0' : 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <td>{structure.id}</td>
                                <td>{getPropertyValue(structure.properties, 'Method')}</td>
                                <td>{getPropertyValue(structure.properties, 'Resolution')}</td>
                                <td>{getPropertyValue(structure.properties, 'Chains')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>*/}
            <p>Selected PDB ID: {selectedPdbId}</p>
        </div>
    );
};
export default NightingaleComponent;