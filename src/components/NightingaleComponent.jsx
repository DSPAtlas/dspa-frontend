import React, { useEffect, useRef, useState } from 'react';
//import "@nightingale-elements/nightingale-sequence";
import "@nightingale-elements/nightingale-navigation";
import "@nightingale-elements/nightingale-manager";
import "@nightingale-elements/nightingale-colored-sequence";
import "@nightingale-elements/nightingale-track";

import "@dspa-nightingale/nightingale-structure/nightingale-structure";
import "@dspa-nightingale/nightingale-sequence";

import "@nightingale-elements/nightingale-msa";
import "@nightingale-elements/nightingale-sequence-heatmap";
import { debounce } from 'lodash'; 

const NightingaleComponent = ({
    proteinData, 
    pdbIds, 
    selectedPdbId, 
    setSelectedPdbId, 
    selectedExperiment, 
    showHeatmap = true,
    passedExperimentIDs,
    containerRef
}) => {
    
    const structureRef = useRef(null); 
    const sequenceRef = useRef(null);
    const navigationRef = useRef(null);
    const domainRef = useRef(null);
    const bindingRef = useRef(null);
    const chainRef = useRef(null);
    const disulfidRef = useRef(null);
    const betastrandRef = useRef(null);
    const siteRef = useRef(null);
    const regionRef = useRef(null);

    const residuelevelContainer = useRef(null);
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
   
    const defaultAttributes = {
        "min-width": "1200",
        length:sequenceLength,
        height: trackHeight,
        "display-start":"1",
        "display-end": sequenceLength,
        "margin-left":"40",
        "layout": "non-overlapping",
        "margin-color": "white",
        "highlight-event":"onmouseover",
        "highlight-color": "rgb(235, 190, 234)",
    };
   
    const [structures, setStructures] = useState(() => {
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
                isVisible: index === 0,
            };
        });
    });
    
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
            const managerContainer = document.getElementById("nightingale-manager-container");
            if (managerContainer) {
                const totalHeight = managerContainer.getBoundingClientRect().height;
                const structureHeight = totalHeight * 0.4;
                structureRefs.current.forEach((structureRef) => {
                    if (structureRef.current) {
                        structureRef.current.setAttribute('style', `--custom-structure-height: ${structureHeight}px;`);
                        structureRef.current.style.setProperty('--custom-structure-height', `${structureHeight}px`);
                    }
                });
    
                const availableTrackHeight = structureHeight;
                const dynamicTrackHeight = Math.max(
                    availableTrackHeight / (visibleTracks.length + 2 || 1), 
                    15
                );
    
                setTrackHeight(dynamicTrackHeight);
            }
        };
    
        const handleTouchStart = () => {
            updateHeight();
        };
    
        window.addEventListener("resize", updateHeight);
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
    
        updateHeight();
    
        return () => {
            window.removeEventListener("resize", updateHeight);
            window.removeEventListener("touchstart", handleTouchStart);
        };
    }, [visibleTracks.length]); 
    
    
    
    const checkDimensions = (element) => {
        if (element) {
            if ('offsetWidth' in element && 'offsetHeight' in element) {
                return element.offsetWidth > 0 && element.offsetHeight > 0;
            }
        }
        return false;
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
        if (experimentID === 0) {
            const sequenceLength = proteinData.proteinSequence.length;
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

    useEffect(()=> {
        if(structureRef.current) {
            const attributes = {
                ...defaultAttributes,
                "protein-accession": proteinName, 
                "structure-id": selectedPdbId,
                id: "structure",           
        }
        Object.keys(attributes).forEach(key => {
            structureRef.current.setAttribute(key, attributes[key]);
        });
        }
      }, [proteinName, selectedPdbId]);

    useEffect(() => {
        let isMounted = true;
    
        const fetchLipScoreData = async () => {
            const sequenceLength = proteinData.proteinSequence.length;
            const defaultLipScoreString = JSON.stringify(Array(sequenceLength).fill(-1));
            let lipScoreString = defaultLipScoreString;
    
            if (selectedExperiment) {
                try {
                    const lipScoreArray = await getLipScoreDataByExperimentID(selectedExperiment);
                    if (lipScoreArray) {
                        lipScoreString = JSON.stringify(lipScoreArray);
                    }
                } catch (error) {
                    console.error("Failed to fetch lip score data:", error);
                }
            }
    
            if (isMounted) {
                setStructures(prevStructures =>
                    prevStructures.map((structure, idx) => ({
                        ...structure,
                        lipScoreString: idx === 0 ? lipScoreString : defaultLipScoreString,
                        isVisible: idx === 0
                    }))
                );
            }
        };
        fetchLipScoreData();
        return () => {
            isMounted = false;  
        };
    }, [selectedExperiment, proteinData.proteinSequence.length]);

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
        if(sequenceRef.current) {
            const attributes = {
                ...defaultAttributes,
                sequence: proteinData.featuresData.sequence,
                id: "sequence",           
        }
        Object.keys(attributes).forEach(key => {
           sequenceRef.current.setAttribute(key, attributes[key]);
        });
        }
      }, [proteinData.featuresData.sequence, defaultAttributes]);

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
        let eventListeners = [];

        customElements.whenDefined("nightingale-track").then(() => {
            console.log("proteindata", proteinData.featuresData);
            
            if (proteinData.featuresData.features) {

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
                "domain", "region", "site", "binding", "chain", "disulfid", "betastrand"
                ];

                trackIds.forEach(id => {
                    const trackElement = document.querySelector(`#${id}`);
                    if (trackElement) {
                        const trackFeatures = mappedFeatures.filter(({ type }) => type.toUpperCase() === id.toUpperCase());
                        trackElement.data = trackFeatures;

                        const mouseMoveHandler = event => {
                            const trackLength = trackElement.getAttribute("length");
                            const relativeX = event.offsetX / trackElement.clientWidth;
                            const position = Math.floor(relativeX * trackLength);
                            const feature = trackFeatures.find(f => f.start <= position && f.end >= position);
                            if (feature) {
                                updateTooltip(feature.tooltipContent, event.pageX, event.pageY);
                            }
                        };

                        trackElement.addEventListener("mousemove", mouseMoveHandler);
                        eventListeners.push({ element: trackElement, handler: mouseMoveHandler }); // Store for cleanup
                        trackElement.setAttribute('show-label', '');  
                        trackElement.setAttribute('label', id.toUpperCase());
                    }
                });
                
    
                if (domainRef.current) {
                    const data = mappedFeatures.filter(({ type }) => type.toUpperCase() === "DOMAIN");
                    const attributes = {
                        ...defaultAttributes,
                        data: data,
                        id: "domain",           
                    };
                    console.log("domain", data);
                    Object.keys(attributes).forEach(key => {
                        domainRef.current.setAttribute(key, attributes[key]);
                     });
                }

                if (regionRef.current) {
                    const data = mappedFeatures.filter(({ type }) => type.toUpperCase() === "REGION");
                    const attributes = {
                        ...defaultAttributes,
                        data: data,
                        id: "region",           
                    };
                    Object.keys(attributes).forEach(key => {
                        regionRef.current.setAttribute(key, attributes[key]);
                     });
                }

                if (siteRef.current) {
                    const data = mappedFeatures.filter(({ type }) => type.toUpperCase() === "SITE");
                    const attributes = {
                        ...defaultAttributes,
                        data: data,
                        id: "site",           
                    };
                    Object.keys(attributes).forEach(key => {
                        siteRef.current.setAttribute(key, attributes[key]);
                     });
                }

                if (bindingRef.current) {
                    
                    const data = mappedFeatures.filter(({ type }) => type.toUpperCase() === "BINDING");
                    const attributes = {
                        ...defaultAttributes,
                        data: data,
                        id: "binding",           
                    };
                    Object.keys(attributes).forEach(key => {
                        bindingRef.current.setAttribute(key, attributes[key]);
                     });
                    };
                    

                if (chainRef.current) {
                    const data = mappedFeatures.filter(({ type }) => type.toUpperCase() === "CHAIN");
                    const attributes = {
                        ...defaultAttributes,
                        data: data,
                        id: "chain",           
                    };
                    Object.keys(attributes).forEach(key => {
                        chainRef.current.setAttribute(key, attributes[key]);
                     });
                }

                if (disulfidRef.current) {
                    const data = mappedFeatures.filter(({ type }) => type.toUpperCase() === "DISULFID");
                    const attributes = {
                        ...defaultAttributes,
                        data: data,
                        id: "disulfid",           
                    };
                    Object.keys(attributes).forEach(key => {
                        disulfidRef.current.setAttribute(key, attributes[key]);
                     });
                }

                if (betastrandRef.current) {
                    const data = mappedFeatures.filter(({ type }) => type.toUpperCase() === "STRAND");
                    const attributes = {
                        ...defaultAttributes,
                        data: data,
                        id: "betastrand",           
                    }
                    Object.keys(attributes).forEach(key => {
                        betastrandRef.current.setAttribute(key, attributes[key]);
                     });
                }

            }
        });
        return () => {
            eventListeners.forEach(({ element, handler }) => {
                element.removeEventListener("mousemove", handler);
            });
        };
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
        <div  id="nightingale-manager-container">
            <p>{selectedExperiment}</p>
            <p style={{ color: '#1a1a1a', fontSize: '18px' }}>{proteinData?.proteinDescription}</p>
            
            {/* LiP Scores Legend */}
            <div>
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
                {experimentIDsList.length > 5 ? (
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
                    <div className="experiment-buttons">
                        {experimentIDsList.map((experimentID, index) => (
                            <button
                                key={experimentID}
                                className={`experiment-button ${selectedButton === index ? "selected" : ""}`}
                                onClick={() => handleButtonClick(experimentID, index)}
                            >
                                {`Experiment ${experimentID}`}
                            </button>
                        ))}
                    </div>
                )}
            </div>
    
            {/* Nightingale Manager with Table of Tracks */}
            <nightingale-manager>
                <div id="tooltip" className="tooltip"></div>
                <div>
                    {structures.map((structure, idx) => 
                        structure.isVisible ? (
                            <nightingale-structure key={idx} ref={structureRefs.current[idx]} />
                        ) : null
                    )}
                </div>
                <table>
                    <tbody>
                        <tr className="track-row">
                            <td className="text-column"></td>
                            <td><nightingale-navigation ref={navigationRef} height="15"/></td>
                        </tr>

                        <tr className="track-row">
                            <td className="text-column">Sequence</td>
                            <td><nightingale-sequence ref={sequenceRef} /></td>
                        </tr>

                        {hasDomainData && (
                            <tr className="track-row">
                                <td className="text-column">Domain</td>
                                <td><nightingale-track ref={domainRef} /></td>
                            </tr>
                        )}

                        {hasBindingData && (
                            <tr className="track-row">
                                <td className="text-column">Binding site</td>
                                <td><nightingale-track ref={bindingRef} /></td>
                            </tr>
                        )}

                        {hasChainData && (
                            <tr className="track-row">
                                <td className="text-column">Chain</td>
                                <td><nightingale-track ref={chainRef} /></td>
                            </tr>
                        )}
                        {hasDisulfidData && (
                            <tr className="track-row">
                                <td className="text-column">Disulfide bond</td>
                                <td><nightingale-track ref={disulfidRef} /></td>
                            </tr>
                        )}
                        {hasBetaStrandData && (
                            <tr className="track-row">
                                <td className="text-column">Beta strand</td>
                                <td style={{ height: `${trackHeight}px`, padding: "0"}}><nightingale-track ref={betastrandRef} /></td>
                            </tr>
                        )}

                        {hasSiteData && (
                            <tr className="track-row">
                                <td className="text-column">Site</td>
                                <td><nightingale-track ref={siteRef} /></td>
                            </tr>
                        )}

                        {hasRegionData && (
                            <tr className="track-row">
                                <td className="text-column">Region</td>
                                <td><nightingale-track ref={regionRef} /></td>
                            </tr>
                        )}

                        {showHeatmap && (
                            <tr className="track-row">
                                <td className="text-column">Score-Barcode</td>
                                <td>
                                    <nightingale-sequence-heatmap
                                        ref={scoreBarcodeContainer}
                                        id="id-for-nightingale-sequence-heatmap"
                                        heatmap-id="seq-heatmap"
                                        min-width="1200"
                                        length={sequenceLength}
                                        height="100"
                                        display-start="1"
                                        margin-left="60"
                                        display-end={sequenceLength}
                                        highlight-event="onmouseover"
                                        color-range="#ffe6f7:-2,#FF6699:2"
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </nightingale-manager>
            <p>Selected PDB ID: {selectedPdbId}</p>
        </div>
    );
};
export default NightingaleComponent;
    