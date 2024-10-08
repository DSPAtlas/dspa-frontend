import React, { useEffect, useRef, useState } from 'react';
import "@nightingale-elements/nightingale-sequence";
import "@nightingale-elements/nightingale-navigation";
import "@nightingale-elements/nightingale-manager";
import "@nightingale-elements/nightingale-colored-sequence";
import "@nightingale-elements/nightingale-track";

import "@dspa-nightingale/nightingale-structure/nightingale-structure";

import "@nightingale-elements/nightingale-msa";
import "@nightingale-elements/nightingale-sequence-heatmap";



const NightingaleComponent = ({proteinData, pdbIds}) => {
    const [selectedPdbId, setSelectedPdbId] = useState(pdbIds[0]?.id ||'');

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

    useEffect(() => {
        customElements.whenDefined("nightingale-sequence").then(() => {
            if (seqContainer.current && checkDimensions(seqContainer.current)) {
                seqContainer.current.data = proteinData.proteinSequence;
                console.log("proteinsequence", seqContainer.current.data);
            }
        });
    }, [proteinData.proteinSequence]);

    useEffect(() => {
        customElements.whenDefined("nightingale-colored-sequence").then(() => {
            if (residuelevelContainer.current && checkDimensions(residuelevelContainer.current)) {
                residuelevelContainer.current.data = proteinData.barcodeSequence;
                console.log("barcodeequence", seqContainer.current.data);
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
                    start: ft.start || ft.begin,
                  }));

                const domain = document.querySelector("#domain");
                if (domain) domain.data = features.filter(({ type }) => type === "DOMAIN");
                
                const region = document.querySelector("#region");
                if (region) region.data = features.filter(({ type }) => type === "REGION");
                
                const site = document.querySelector("#site");
                if (site) site.data = features.filter(({ type }) => type === "SITE");
                
                const binding = document.querySelector("#binding");
                if (binding) binding.data = features.filter(({ type }) => type === "BINDING");
               
                const chain = document.querySelector("#chain");
                if (chain) chain.data = features.filter(({ type }) => type === "CHAIN");
               
                const disulfide = document.querySelector("#disulfide-bond");
                if (disulfide) disulfide.data = features.filter(({ type }) => type === "DISULFID");
               
                const betaStrand = document.querySelector("#beta-strand");
                if (betaStrand) betaStrand.data = features.filter(({ type }) => type === "STRAND");
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

                // Extract all xValues
                const xValues = dataHeatmap.map(item => item.xValue);

                // Find the smallest and largest xValue
                const smallestXValue = Math.min(...xValues);
                const largestXValue = Math.max(...xValues);

                // Generate an array from the smallest to the largest xValue
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

    const lipScoreArray = [100, 100, 100, 100, 100, 100, 100, 100];
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
            <div className="table-container">
                <table>
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

            <nightingale-manager> 
                <nightingale-structure 
                    protein-accession={proteinName} 
                    structure-id={selectedPdbId}
                    margin-color="transparent"
                    background-color="white"
                    lipscore-array={lipScoreString}
                    highlight-color={margincolorFeatures}
                    style={{ height: '500px', width: '1250px' }}
                ></nightingale-structure>
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
    )
};

export default NightingaleComponent;