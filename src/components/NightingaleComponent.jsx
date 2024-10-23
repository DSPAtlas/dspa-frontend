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
    console.log(proteinData);
    // Initialize selectedExperiment as an empty string by default
    const structureRefs = useRef(proteinData.experimentIDsList.map(() => React.createRef()));

    const [structures, setStructures] = useState(proteinData.experimentIDsList.map((_, index) => {
        const sequenceLength = proteinData.proteinSequence.length;
        const defaultLipScoreString = JSON.stringify(Array(sequenceLength).fill(-1)); // Default to -1

        return {
            id: index + 1,
            lipScoreString: defaultLipScoreString,  // Default to -1 array
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
    const minWidth = "1000";

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

    useEffect(() => {
        customElements.whenDefined("nightingale-sequence").then(() => {
            if (seqContainer.current && checkDimensions(seqContainer.current)) {
                seqContainer.current.data = proteinData.proteinSequence;
            }
        });
    }, [proteinData.proteinSequence]);

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
                const features = proteinData.featuresData.features.map((ft) => ({
                    ...ft,
                    start: parseInt(ft.start || ft.begin, 10),  // Ensure 'start' is numeric
                    end: parseInt(ft.end || ft.stop, 10),  // Ensure 'end' is numeric
                }));
    
                console.log("Mapped Features: ", features);  // Log the mapped features to check
    
                const domain = document.querySelector("#domain");
                const region = document.querySelector("#region");
                const site = document.querySelector("#site");
                const binding = document.querySelector("#binding");
                const chain = document.querySelector("#chain");
                const disulfide = document.querySelector("#disulfide-bond");
                const betaStrand = document.querySelector("#beta-strand");
    
                if (domain) {
                    const domainData = features.filter(({ type }) => type.toUpperCase() === "DOMAIN");
                    console.log("Domain Data: ", domainData);
                    domain.data = domainData;
                }
    
                if (region) {
                    const regionData = features.filter(({ type }) => type.toUpperCase() === "REGION");
                    console.log("Region Data: ", regionData);
                    region.data = regionData;
                }
    
                if (site) {
                    const siteData = features.filter(({ type }) => type.toUpperCase() === "SITE");
                    console.log("Site Data: ", siteData);
                    site.data = siteData;
                }
    
                if (binding) {
                    const bindingData = features.filter(({ type }) => type.toUpperCase() === "BINDING");
                    console.log("Binding Data: ", bindingData);
                    binding.data = bindingData;
                }
    
                if (chain) {
                    const chainData = features.filter(({ type }) => type.toUpperCase() === "CHAIN");
                    console.log("Chain Data: ", chainData);
                    chain.data = chainData;
                }
    
                if (disulfide) {
                    const disulfideData = features.filter(({ type }) => type.toUpperCase() === "DISULFID");
                    console.log("Disulfide Data: ", disulfideData);
                    disulfide.data = disulfideData;
                }
    
                if (betaStrand) {
                    const betaStrandData = features.filter(({ type }) => type.toUpperCase() === "STRAND");
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

    return( 
        <div>
            <p>{selectedExperiment}</p>
            <p>{proteinData?.proteinDescription}</p>
            <div id="nightingale-manager-container">
            <nightingale-manager> 

                {/* conditonally render buttons only if the experiment is not provided  */}
                {!selectedExperiment &&(
                <div className="experiment-buttons">
                        {proteinData.experimentIDsList.map((experimentID, index) => (
                            <button
                                key={experimentID}
                                onClick={() => handleExperimentClick(experimentID, index)}
                                style={{
                                    backgroundColor: structures[index].isVisible ? '#ccc' : '#fff',
                                    cursor: 'pointer',
                                    margin: '5px',
                                    padding: '10px'
                                }}
                            >
                                {`Experiment ${experimentID}`}
                            </button>
                        ))}
                    </div>
                )}

               {/* Nightingale Structure */}
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
                                style={{ height: '500px', width: '1250px' }}
                            ></nightingale-structure>
                        ) : null
                    )}
            <table>
            <tbody>
                <tr>
                <td></td>
                <td>
                    <nightingale-navigation
                        id="navigation"
                        min-width={minWidth}
                        height="40"
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
                <td></td>
                <td>
                    <nightingale-sequence
                        ref={seqContainer}
                        min-width={minWidth}
                        height="40"
                        width={minWidth}
                        length={sequenceLength} 
                        display-start="1"
                        display-end={sequenceLength} 
                        margin-color="white"
                        highlight-event="onmouseover"
                        highlight-color={highlightColor}
                        margin-left="40"
                    ></nightingale-sequence>
                </td>
                </tr> 
                <tr> 
                <td>Score-Barcode </td>
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
                            color-scheme="hydro" /*hydro mae*/
                            scale="I:-2,D:0,S:2"
                            color-range="#ffe6f7:-2,#FF6699:2"
                        ></nightingale-msa>
                        </td>
                    </tr>
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
                </tbody>
            </table>
        </nightingale-manager>  
        </div>
        <div>
                <table className="pdb-selection-container"
                 style={{
                    width: '100%', // Make the table as wide as the nightingale-manager
                    height: '60px', // Fix the height to 30px
                    overflowY: 'scroll', // Add scroll for vertical scrolling
                    overflowX: 'hidden', // Disable horizontal scrolling
                    display: 'block', // Ensure scroll works on the tbody
                  }}>
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
    )
};

export default NightingaleComponent;