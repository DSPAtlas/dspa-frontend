import React, { useEffect, useRef, useState } from 'react';
import "@nightingale-elements/nightingale-sequence";
import "@nightingale-elements/nightingale-navigation";
import "@nightingale-elements/nightingale-manager";
import "@nightingale-elements/nightingale-colored-sequence";
import "@nightingale-elements/nightingale-track";

import "@dspa-nightingale/nightingale-structure/nightingale-structure";

import "@nightingale-elements/nightingale-msa";
import "@nightingale-elements/nightingale-sequence-heatmap";



const NightingaleComponent = ({proteinData, pdbIds, selectedPdbId, setSelectedPdbId, selectedExperiment}) => {
    console.log("proteindata",proteinData);
    console.log("proteindata sequence",proteinData.featuresData.sequence);
    // Initialize selectedExperiment as an empty string by default
    const structureRefs = useRef(proteinData.experimentIDsList.map(() => React.createRef()));

    const [structures, setStructures] = useState(proteinData.experimentIDsList.map((_, index) => {
        const sequenceLength = proteinData.proteinSequence.length;
        const defaultLipScoreString = JSON.stringify(Array(sequenceLength).fill(-1)); 

        return {
            id: index + 1,
            lipScoreString: defaultLipScoreString,  
            isVisible: index === 0
        };
    }));

    const seqContainer = useRef(null);
    const residuelevelContainer = useRef(null);
    const featuresContainer = useRef(null);
    const multipleExperimentsContainer = useRef(null);
    const scoreBarcodeContainer = useRef(null);
    const sequenceLength = proteinData.proteinSequence.length;

    const [isHeatmapReady, setHeatmapReady] = useState(false);

    const proteinName = proteinData.proteinName;

    const margincolorFeatures = "#FF6699";
    const highlightColor = "rgb(235, 190, 234)";
    const minWidth = "1200";

    const checkDimensions = (element) => {
        return element && element.offsetWidth > 0 && element.offsetHeight > 0;
    };

    const handleRowClick = (id) => {
        setSelectedPdbId(id);
    };

    const getPropertyValue = (properties, key) => {
        const property = properties.find(prop => prop.key === key);
        return property ? property.value : '';
    };

    const getLipScoreDataByExperimentID = (experimentID) => {
        if (!proteinData || !proteinData.lipscoreList) return null;
        const lipScoreEntry = proteinData.lipscoreList.find(entry => entry.experimentID === experimentID);
        return lipScoreEntry ? lipScoreEntry.data : null;
    };

    const handleExperimentClick = (experimentID, index) => {
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
    };

    useEffect(() => {
        const sequenceLength = proteinData.proteinSequence.length;
        const defaultLipScoreString = JSON.stringify(Array(sequenceLength).fill(-1)); // Default to -1

        if (selectedExperiment) {
            const lipScoreArray = getLipScoreDataByExperimentID(selectedExperiment);

            const lipScoreString = lipScoreArray ? JSON.stringify(lipScoreArray) : defaultLipScoreString;

            // Update the structure with the new lipScore or -1 if no data is found
            setStructures(prevStructures =>
                prevStructures.map((structure, idx) => ({
                    ...structure,
                    lipScoreString: idx === 0 ? lipScoreString : defaultLipScoreString,
                    isVisible: idx === 0  // Only the first structure is visible
                }))
            );
        } else {
            // If no selected experiment, reset to default -1 for all sequences
            setStructures(prevStructures =>
                prevStructures.map((structure, idx) => ({
                    ...structure,
                    lipScoreString: defaultLipScoreString,
                    isVisible: idx === 0  // Only the first structure is visible
                }))
            );
        }
    }, [selectedExperiment, proteinData.proteinSequence.length]);
    

    useEffect(() => {
        structures.forEach((structure, idx) => {
            const structureRef = structureRefs.current[idx].current;
            if (structureRef && structure.isVisible) {
                structureRef.proteinAccession = proteinName;
                structureRef.structureId = selectedPdbId;
                structureRef.lipscoreArray = structure.lipScoreString;
                structureRef.marginColor = "transparent";
                structureRef.backgroundColor = "white";
                structureRef.highlightColor = "red";
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
                    tooltipContent: ft.description || "No description available",
                }));

                const updateTooltip = (content, x, y) => {
                    tooltip.innerHTML = content;
                    tooltip.style.top = `${y - 5}px`;
                    tooltip.style.left = `${x}px`;
                    tooltip.style.visibility = "visible";
                };
        
                const hideTooltip = () => {
                    tooltip.style.visibility = "hidden";
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
        
                trackIds.forEach(({ id, type }) => {
                        const trackElement = document.querySelector(`#${id}`);
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
        
                        trackElement.addEventListener("mouseleave", hideTooltip);
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
                    console.log("Domain Data: ", domainData);
                    domain.data = domainData;
                }
    
                if (region) {
                    const regionData = mappedFeatures.filter(({ type }) => type.toUpperCase() === "REGION");
                    console.log("Region Data: ", regionData);
                    region.data = regionData;
                }
    
                if (site) {
                    const siteData = mappedFeatures.filter(({ type }) => type.toUpperCase() === "SITE");
                    console.log("Site Data: ", siteData);
                    site.data = siteData;
                }
    
                if (binding) {
                    const bindingData = mappedFeatures.filter(({ type }) => type.toUpperCase() === "BINDING");
                    console.log("Binding Data: ", bindingData);
                    binding.data = bindingData;
                }
    
                if (chain) {
                    const chainData = mappedFeatures.filter(({ type }) => type.toUpperCase() === "CHAIN");
                    console.log("Chain Data: ", chainData);
                    chain.data = chainData;
                }
    
                if (disulfide) {
                    const disulfideData = mappedFeatures.filter(({ type }) => type.toUpperCase() === "DISULFID");
                    console.log("Disulfide Data: ", disulfideData);
                    disulfide.data = disulfideData;
                }
    
                if (betaStrand) {
                    const betaStrandData = mappedFeatures.filter(({ type }) => type.toUpperCase() === "STRAND");
                    console.log("Beta Strand Data: ", betaStrandData);
                    betaStrand.data = betaStrandData;
                }
            }
        });
    }, [proteinData.featuresData]);    

    useEffect(() => {
        customElements.whenDefined("nightingale-sequence-heatmap").then(() => {
            if (scoreBarcodeContainer.current && checkDimensions(scoreBarcodeContainer.current)) {

                const treatment = "";
                const dataHeatmap = Object.entries(proteinData.differentialAbundanceData).flatMap(([key, values]) =>
                    values.map(value => ({
                        yValue: key,
                        xValue: value.index,
                        score: value.score === null ? 0 : value.score,
                        treatment: treatment
                    }))
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
    }, [proteinData.differentialAbundanceData]);

    if (isHeatmapReady) {
        const heatmapElement = document.getElementById("id-for-nightingale-sequence-heatmap");
        heatmapElement.heatmapInstance.setTooltip((d, x, y, xIndex, yIndex) => {
            let returnHTML = `
                <div class="tooltip-container">
                    <strong>Experiment</strong> <br />
                    Experiment: <a href="/experiment/${d.yValue}" target="_blank" class="tooltip-link"><strong>${d.yValue}</strong></a><br />
                    Treatment: <strong class="tooltip-highlight">${d.treatment}</strong><br />
                    Score: <strong>${d.score}</strong>
                </div>`;
            return returnHTML;
        });
    }

    const lipScoreArray = [-1, -1];
    const lipScoreString = JSON.stringify(lipScoreArray);

    // Check if there is Beta strand data
    const hasDomainData = proteinData.featuresData.features.some(({ type }) => type === "DOMAIN");
    const hasRegionData = proteinData.featuresData.features.some(({ type }) => type === "REGION");
    const hasSiteData = proteinData.featuresData.features.some(({ type }) => type === "SITE");
    const hasBindingData = proteinData.featuresData.features.some(({ type }) => type === "BINDING");
    const hasChainData = proteinData.featuresData.features.some(({ type }) => type === "CHAIN");
    const hasDisulfidData = proteinData.featuresData.features.some(({ type }) => type === "DISULFID");
    const hasBetaStrandData = proteinData.featuresData.features.some(({ type }) => type === "STRAND");

    const legendData = [
        { color: '#ff7d45', label: '0 - 2' },
        { color: '#db13', label: '2 - 4' },
        { color: '#65cbf3', label: '4 - 7' },
        { color: '#0053d6', label: '> 7' },
        { color: 'default', label: 'no LiP Score reported' }
    ];

    return (
        <div>
            <p>{selectedExperiment}</p>
            <p>{proteinData?.proteinDescription}</p>

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

                {/* Button for Experiments */}
                <div className="experiment-buttons">
                    {proteinData.experimentIDsList.map((experimentID, index) => (
                        <button
                            key={experimentID}
                            onClick={() => handleExperimentClick(experimentID, index)}
                            style={{
                                backgroundColor: selectedExperiment === experimentID ? '#ccc' : '#fff',
                                color: selectedExperiment === experimentID ? '#000' : '#333',
                                cursor: 'pointer',
                                margin: '5px',
                                padding: '10px',
                                border: selectedExperiment === experimentID ? '1px solid #333' : '1px solid #ccc'
                            }}
                        >
                            {`Experiment ${experimentID}`}
                        </button>
                    ))}
                </div>

                {/* Nightingale Manager with Two Columns */}
                <nightingale-manager>
                    <div id="tooltip" className="tooltip"></div>

                    <div style={{ display: 'flex' }}>
                        {/* Left Column: Nightingale Structure */}
                        <div style={{ flex: '1', paddingRight: '20px' }}>
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
                                        highlight-color="red"
                                        style={{ height: '1000px', width: '100%' }}
                                    ></nightingale-structure>
                                ) : null
                            )}
                        </div>

                        {/* Right Column: Other Nightingale Elements */}
                        <div style={{ flex: '1' }}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <nightingale-navigation
                                                id="navigation"
                                                min-width={minWidth}
                                                height="30"
                                                length={sequenceLength}
                                                display-start="1"
                                                display-end={sequenceLength}
                                                margin-color="white"
                                                margin-left="50"
                                                highlight-color={highlightColor}
                                            ></nightingale-navigation>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Sequence</td>
                                        <td>
                                            <nightingale-sequence
                                                ref={seqContainer}
                                                sequence={proteinData.featuresData.sequence}
                                                min-width={minWidth}
                                                height="30"
                                                width={minWidth}
                                                length={sequenceLength}
                                                display-start="1"
                                                display-end={sequenceLength}
                                                highlight-event="onmouseover"
                                                highlight-color={highlightColor}
                                                margin-left="40"
                                                margin-color="aliceblue"
                                            ></nightingale-sequence>
                                        </td>
                                    </tr>
                                    {/* Additional Track Elements */}
                                    {hasDomainData && (
                                        <tr>
                                            <td>Domain</td>
                                            <td>
                                                <nightingale-track
                                                    ref={featuresContainer}
                                                    id="domain"
                                                    min-width={minWidth}
                                                    height="25"
                                                    length={sequenceLength}
                                                    display-start="1"
                                                    display-end={sequenceLength}
                                                    margin-left="40"
                                                    highlight-color={highlightColor}
                                                    highlight-event="onmouseover"
                                                    label="labeltest"
                                                    show-label
                                                ></nightingale-track>
                                            </td>
                                        </tr>
                                    )}
                                    {hasBindingData && (
                                    <tr>
                                        <td>Binding site</td>
                                        <td>
                                        <nightingale-track
                                            id="binding"
                                            min-width={minWidth}
                                            height="25"
                                            length={sequenceLength} 
                                            display-start="1"
                                            display-end={sequenceLength} 
                                            highlight-color={highlightColor}
                                            highlight-event="onmouseover"
                                            margin-left="40"
                                        ></nightingale-track>
                                        </td>
                                    </tr>
                                    )}
                                                    {hasRegionData && (
                                <tr>
                                    <td>Region</td>
                                    <td>
                                    <nightingale-track
                                        ref={featuresContainer}
                                        id="region"
                                        min-width={minWidth}
                                        height="25"
                                        length={sequenceLength} 
                                        display-start="1"
                                        display-end={sequenceLength} 
                                        highlight-color={highlightColor}
                                        highlight-event="onmouseover"
                                        margin-left="40"
                                    ></nightingale-track>
                                    </td>
                                </tr>
                            )}
                                {hasSiteData && (
                                <tr>
                                    <td>Site</td>
                                    <td>
                                    <nightingale-track
                                        id="site"
                                        min-width={minWidth}
                                        height="25"
                                        length={sequenceLength} 
                                        display-start="1"
                                        display-end={sequenceLength} 
                                        highlight-color={highlightColor}
                                        highlight-event="onmouseover"
                                        margin-left="40"
                                    ></nightingale-track>
                                    </td>
                                </tr>
                            )}
                             {hasChainData && (
                            <tr>
                                <td>Chain</td>
                                <td>
                                <nightingale-track
                                    id="chain"
                                    layout="non-overlapping"
                                    min-width={minWidth}
                                    height="25"
                                    length={sequenceLength} 
                                    display-start="1"
                                    display-end={sequenceLength} 
                                    highlight-color={highlightColor}
                                    highlight-event="onmouseover"
                                    margin-left="40"
                                ></nightingale-track>
                                </td>
                            </tr>
                        )}
                            {hasDisulfidData && (
                            <tr>
                                <td>Disulfide bond</td>
                                <td>
                                <nightingale-track
                                    id="disulfide-bond"
                                    layout="non-overlapping"
                                    min-width={minWidth}
                                    height="25"
                                    length={sequenceLength} 
                                    display-start="1"
                                    display-end={sequenceLength} 
                                    highlight-color={highlightColor}
                                    highlight-event="onmouseover"
                                    margin-left="40"
                                ></nightingale-track>
                                </td>
                            </tr>
                            )}
                            {hasBetaStrandData && (
                            <tr>
                                <td>Beta strand</td>
                                <td>
                                <nightingale-track
                                    id="beta-strand"
                                    min-width={minWidth}
                                    height="25"
                                    length={sequenceLength} 
                                    display-start="1"
                                    display-end={sequenceLength} 
                                    highlight-color={highlightColor}
                                    highlight-event="onmouseover"
                                    margin-left="40"
                                ></nightingale-track>
                                </td>
                            </tr>
                            )}
                                 {/* Continue with other track elements */}
                                    <tr>
                                        <td>Score-Barcode</td>
                                        <td>
                                            <nightingale-sequence-heatmap
                                                ref={scoreBarcodeContainer}
                                                id="id-for-nightingale-sequence-heatmap"
                                                heatmap-id="seq-heatmap"
                                                width={minWidth}
                                                height="80"
                                                display-start="1"
                                                margin-left="40"
                                                display-end={sequenceLength}
                                                highlight-event="onmouseover"
                                                highlight-color={highlightColor}
                                                color-range="#ffe6f7:-2,#FF6699:2"
                                            ></nightingale-sequence-heatmap>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Barcodes S/D/I</td>
                                        <td>
                                            <nightingale-msa
                                                ref={multipleExperimentsContainer}
                                                id="msa"
                                                height="80"
                                                width={minWidth}
                                                label-width="40"
                                                highlight-color={highlightColor}
                                                margin-left="0"
                                                color-scheme="hydro"
                                                scale="I:-2,D:0,S:2"
                                                color-range="#ffe6f7:-2,#FF6699:2"
                                            ></nightingale-msa>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </nightingale-manager>
            </div>

            {/* Table for PDB selection */}
            <div>
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
            </div>
            <p>Selected PDB ID: {selectedPdbId}</p>
        </div>
    );
};
export default NightingaleComponent;