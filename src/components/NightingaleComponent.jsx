import React, { useEffect, useState, useRef } from 'react';
import "@nightingale-elements/nightingale-sequence";
import "@nightingale-elements/nightingale-navigation";
import "@nightingale-elements/nightingale-manager";
import "@nightingale-elements/nightingale-colored-sequence";
import "@nightingale-elements/nightingale-track";
import "@nightingale-elements/nightingale-structure";
import "@nightingale-elements/nightingale-msa";
import "@nightingale-elements/nightingale-sequence-heatmap";
import Background from 'three/examples/jsm/renderers/common/Background.js';
import * as d3 from 'd3';

const NightingaleComponent = ({proteinData}) => {

    const seqContainer = useRef(null);
    const residuelevelContainer = useRef(null);
    const featuresContainer = useRef(null);
    const multipleExperimentsContainer = useRef(null);
    const scoreBarcodeContainer = useRef(null);
    const sequenceLength = proteinData.proteinSequence.length;

    const proteinName = proteinData.proteinName;
    const proteinStructureID = `AF-${proteinData.proteinName}-F1`;

    const margincolorFeatures = "#FF6699";
    const highlightColor = "rgb(235, 190, 234)";

    const minWidth = "1000";

    console.log(proteinData);

    useEffect(() => {
        customElements.whenDefined("nightingale-sequence").then(() => {
            if (seqContainer.current) {
                seqContainer.current.data = proteinData.proteinSequence;
            }
        });
    }, [proteinData.proteinSequence]);

    useEffect(() => {
        customElements.whenDefined("nightingale-colored-sequence").then(() => {
            if (residuelevelContainer.current) {
                residuelevelContainer.current.data = proteinData.barcodeSequence;
            }
        });
    }, [proteinData.barcodeSequence]);

    useEffect(() => {
        customElements.whenDefined("nightingale-msa").then(() => {
            if (multipleExperimentsContainer.current) {
                multipleExperimentsContainer.current.data = [
                {name: "1",sequence: proteinData.barcodeSequence, },
                {name: "LIP2",sequence: proteinData.barcodeSequence, },
                {name: "LIP3",sequence: proteinData.barcodeSequence, },
                {name: "LIP4",sequence: proteinData.barcodeSequence, },
                {name: "LIP5",sequence: proteinData.barcodeSequence, },
                {name: "6",sequence: proteinData.barcodeSequence, },
            ];
            }
        });   
    }, [proteinData.barcodeSequence]);

    useEffect(() => {
        customElements.whenDefined("nightingale-track").then(() => {
            if (featuresContainer.current && proteinData.featuresData.features) {
                const features = proteinData.featuresData.features.map((ft) => ({
                    ...ft,
                    start: ft.start || ft.begin,
                  }));

                const domain = document.querySelector("#domain");
                domain.data = features.filter(({ type }) => type === "DOMAIN");
                
                const region = document.querySelector("#region");
                region.data = features.filter(({ type }) => type === "REGION");
                
                const site = document.querySelector("#site");
                site.data = features.filter(({ type }) => type === "SITE");
                
                const binding = document.querySelector("#binding");
                binding.data = features.filter(({ type }) => type === "BINDING");
               
                const chain = document.querySelector("#chain");
                chain.data = features.filter(({ type }) => type === "CHAIN");
               
                const disulfide = document.querySelector("#disulfide-bond");
                disulfide.data = features.filter(({ type }) => type === "DISULFID");
               
                const betaStrand = document.querySelector("#beta-strand");
                betaStrand.data = features.filter(({ type }) => type === "STRAND");
            }
        });
    }, [proteinData.featuresData]);

    useEffect(() => {
        customElements.whenDefined("nightingale-sequence-heatmap").then(() => {
            if (scoreBarcodeContainer.current){
                const dataHeatmap = proteinData.differentialAbundanceData.map(entry => {
                    return {
                      xValue: entry.index,
                      score: entry.score === null ? 0 : entry.score,
                      aminoacid: entry.aminoacid,
                      detected: entry.detected,
                      yValue: "Median LiPs"
                    };
                  });
                
                const xDomain = Array.from({ length: dataHeatmap.length }, (_, index) => index);
                const yDomain = ["Median LiPs"];

                document.getElementById("id-for-nightingale-sequence-heatmap").setHeatmapData(xDomain, yDomain, dataHeatmap);
            }
            
        });
    }, [proteinData.differentialAbundanceData])
   
    return( 
        <nightingale-manager> 
            <nightingale-structure 
                protein-accession={proteinName} 
                structure-id={proteinStructureID}
                margin-color="transparent"
                background-color="white"
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
                    height="40"
                    display-start="1"
                    margin-left="40"
                    display-end={sequenceLength} 
                    highlight-event="onmouseover"
                    highlight-color={highlightColor}
                    ></nightingale-sequence-heatmap>
                </td>
            </tr> 
            <tr>
                <td>Barcode - Structural Changes</td>
                <td>
                    <nightingale-colored-sequence
                        ref={residuelevelContainer}
                        sequence={proteinData.barcodeSequence}
                        width={minWidth}
                        height="40"
                        length={sequenceLength} 
                        display-start="1"
                        display-end={sequenceLength} 
                        scale="I:-2,D:0,S:2"
                        highlight-color={highlightColor}
                        margin-left="40"
                        color-range="#ffe6f7:-2,#FF6699:2"
                    ></nightingale-colored-sequence>
                </td>
            </tr>
            <tr>
            <td>Compare Multiple LiP Experiments</td>
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
                        color-range="#ffe6f7:-2,#FF6699:2"
                    ></nightingale-msa>
                    </td>
                </tr>
                   <tr>
                <td>Domain</td>
                <td>
                <nightingale-track
                    ref={featuresContainer}
                    id="domain"
                    min-width={minWidth}
                    height="15"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    margin-left="40"
                    highlight-color={highlightColor}
                    highlight-event="onmouseover"
                ></nightingale-track>
                </td>
            </tr>
            <tr>
                <td>Region</td>
                <td>
                <nightingale-track
                    ref={featuresContainer}
                    id="region"
                    min-width={minWidth}
                    height="15"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    highlight-color={highlightColor}
                    highlight-event="onmouseover"
                    margin-left="40"
                ></nightingale-track>
                </td>
            </tr>
            <tr>
                <td>Site</td>
                <td>
                <nightingale-track
                    id="site"
                    min-width={minWidth}
                    height="15"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    highlight-color={highlightColor}
                    highlight-event="onmouseover"
                    margin-left="40"
                ></nightingale-track>
                </td>
            </tr>
            <tr>
                <td>Chain</td>
                <td>
                <nightingale-track
                    id="chain"
                    layout="non-overlapping"
                    min-width={minWidth}
                    height="15"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    highlight-color={highlightColor}
                    highlight-event="onmouseover"
                    margin-left="40"
                ></nightingale-track>
                </td>
            </tr>
            <tr>
                <td>Binding site</td>
                <td>
                <nightingale-track
                    id="binding"
                    min-width={minWidth}
                    height="15"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    highlight-color={highlightColor}
                    highlight-event="onmouseover"
                    margin-left="40"
                ></nightingale-track>
                </td>
            </tr>
            <tr>
                <td>Disulfide bond</td>
                <td>
                <nightingale-track
                    id="disulfide-bond"
                    layout="non-overlapping"
                    min-width={minWidth}
                    height="15"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    highlight-color={highlightColor}
                    highlight-event="onmouseover"
                    margin-left="40"
                ></nightingale-track>
                </td>
            </tr>
            <tr>
                <td>Beta strand</td>
                <td>
                <nightingale-track
                    id="beta-strand"
                    min-width={minWidth}
                    height="15"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    highlight-color={highlightColor}
                    highlight-event="onmouseover"
                    margin-left="40"
                ></nightingale-track>
                </td>
            </tr>
            </tbody>
      </table>
     </nightingale-manager>   
    )
};

export default NightingaleComponent;
