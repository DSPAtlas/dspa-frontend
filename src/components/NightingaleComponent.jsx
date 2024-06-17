import React, { useEffect, useState, useRef } from 'react';
import "@nightingale-elements/nightingale-sequence";
import "@nightingale-elements/nightingale-navigation";
import "@nightingale-elements/nightingale-manager";
import "@nightingale-elements/nightingale-colored-sequence";
import "@nightingale-elements/nightingale-track";
import "@nightingale-elements/nightingale-structure";
import "@nightingale-elements/nightingale-msa";

const NightingaleComponent = ({ proteinData}) => {

    const seqContainer = useRef(null);
    const residuelevelContainer = useRef(null);
    const featuresContainer = useRef(null);
    const multipleExperimentsContainer = useRef(null);
    const sequenceLength = proteinData.proteinSequence.length;

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
                multipleExperimentsContainer.current.data = [{name: "LIP1",sequence: proteinData.barcodeSequence, },{name: "LIP2",
                    sequence: proteinData.barcodeSequence,  }, ];
            }
        });   
    }, [proteinData.barcodeSequence]);

    useEffect(() => {
        customElements.whenDefined("nightingale-track").then(() => {
            if (featuresContainer.current) {
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
   
    return( 
    <nightingale-manager>
        <nightingale-structure protein-accession="P25443" structure-id="AF-P25443-F1" />
     <table>
     
          <tbody>
            <tr>
              <td></td>
              <td>
                <nightingale-navigation
                    id="navigation"
                    min-width="800"
                    height="40"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    margin-color="white"
                ></nightingale-navigation>
               </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <nightingale-sequence
                    ref={seqContainer}
                    min-width="800"
                    height="40"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    margin-color="white"
                    highlight-event="onmouseover"
                ></nightingale-sequence>
               </td>
            </tr>
              <tr>
                <td>Barcode 1</td>
                <td>
                    <nightingale-colored-sequence
                        ref={residuelevelContainer}
                        sequence={proteinData.barcodeSequence}
                        width="800"
                        height="40"
                        length={sequenceLength} 
                        display-start="1"
                        display-end={sequenceLength} 
                        scale="I:-2,D:0,S:2"
                    ></nightingale-colored-sequence>
                </td>
            </tr>
            <tr>
                <td>Barcode 2 - Score - formula</td>
                <td>
                    <nightingale-colored-sequence
                        ref={residuelevelContainer}
                        sequence={proteinData.barcodeSequence}
                        width="800"
                        height="40"
                        length={sequenceLength} 
                        display-start="1"
                        display-end={sequenceLength} 
                        scale="I:-2,D:0,S:2"
                    ></nightingale-colored-sequence>
                </td>
            </tr>
            <tr>
            <td>Multiple LiP Experiments</td>
            <td>
                    <nightingale-msa
                        ref={multipleExperimentsContainer}
                        id="msa"
                        height="200"
                        width="800"
                        color-scheme="clustal"
                        label-width="200"
                    ></nightingale-msa>
                    </td>
                </tr>
                <tr>
                <td>Domain</td>
                <td>
                <nightingale-track
                    ref={featuresContainer}
                    id="domain"
                    min-width="800"
                    height="15"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    margin-color="aliceblue"
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
                    min-width="800"
                    height="15"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    margin-color="aliceblue"
                    highlight-event="onmouseover"
                ></nightingale-track>
                </td>
            </tr>
            <tr>
                <td>Site</td>
                <td>
                <nightingale-track
                    id="site"
                    min-width="800"
                    height="15"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    margin-color="aliceblue"
                    highlight-event="onmouseover"
                ></nightingale-track>
                </td>
            </tr>
            <tr>
                <td>Chain</td>
                <td>
                <nightingale-track
                    id="chain"
                    layout="non-overlapping"
                    min-width="800"
                    height="15"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    margin-color="aliceblue"
                    highlight-event="onmouseover"
                ></nightingale-track>
                </td>
            </tr>
            <tr>
                <td>Binding site</td>
                <td>
                <nightingale-track
                    id="binding"
                    min-width="800"
                    height="15"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    margin-color="aliceblue"
                    highlight-event="onmouseover"
                ></nightingale-track>
                </td>
            </tr>
            <tr>
                <td>Disulfide bond</td>
                <td>
                <nightingale-track
                    id="disulfide-bond"
                    layout="non-overlapping"
                    min-width="800"
                    height="15"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    margin-color="aliceblue"
                    highlight-event="onmouseover"
                ></nightingale-track>
                </td>
            </tr>
            <tr>
                <td>Beta strand</td>
                <td>
                <nightingale-track
                    id="beta-strand"
                    min-width="800"
                    height="15"
                    length={sequenceLength} 
                    display-start="1"
                    display-end={sequenceLength} 
                    margin-color="aliceblue"
                    highlight-event="onmouseover"
                ></nightingale-track>
                </td>
            </tr>
            </tbody>
      </table>
     </nightingale-manager>   
    )
};

export default NightingaleComponent;
