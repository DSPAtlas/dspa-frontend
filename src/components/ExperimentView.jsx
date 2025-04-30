import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config.json';
import VolcanoPlot from '../visualization/volcanoplot.js';

const getTop20Proteins = (proteinScores) => {
    const sortedData = proteinScores.sort((a, b) => b.cumulativeScore - a.cumulativeScore);
    return sortedData.slice(0, 20);
};


const ExperimentInfo = () => {
    const { experimentID } = useParams(); 
    const [experimentData, setExperimentData] = useState([]);
    const [differentialAbundanceData, setDifferentialAbundanceData] = useState([]);
    const [topProteins, setTopProteins] = useState([]);
    const chartRefVolcano = useRef(null);

    const fetchExperimentData = useCallback(async () => {
        const url = `${config.apiEndpoint}experiment?experimentID=${experimentID}`;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log("dat", data);
          setExperimentData(data.experimentData);
          setDifferentialAbundanceData(data.experimentData.differentialAbundanceDataList);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }, [experimentID]);

    
    
    const handleDownloadPDF = () => {
        if (!experimentData.metaData.qc_pdf_file) {
            console.error('No QC PDF file available');
            return;
        }
    
        const blob = new Blob([new Uint8Array(experimentData.metaData.qc_pdf_file.data)], { type: 'application/pdf' });
    
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Experiment_${experimentData.experimentID}_QC.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    useEffect(() => {
        fetchExperimentData();
    }, [fetchExperimentData]);

    useEffect(() => {
        if (experimentData && experimentData.proteinScores) {
            const top20 = getTop20Proteins(experimentData.proteinScores);
            setTopProteins(top20);
        }
    }, [experimentData]);

    return (
        <div>
            {experimentData && experimentData.experimentID && (
                    <div className="experiment-metadata-container">
                        {/* Experiment Header */}
                        <div className="experiment-header">
                            <h1>DynaProt Experiment Comparison ID: <span>{experimentData.experimentID}</span></h1>
                        </div>
                
                        {/* Metadata Sections */}
                        <div className="metadata-section">
                            <h2>General Information</h2>
                            <div className="metadata-field">
                                <strong>Perturbation:</strong> {experimentData.perturbation || 'N/A'}
                            </div>
                            <div className="metadata-field">
                                <strong>Condition:</strong> {experimentData.metaData.condition || 'N/A'}
                            </div>
                            <div className="metadata-field">
                                <strong>Taxonomy ID:</strong> {experimentData.metaData.taxonomy_id || 'N/A'}
                            </div>
                            <div className="metadata-field">
                                <strong>Strain:</strong> {experimentData.metaData.strain || 'N/A'}
                            </div>
                            <div className="metadata-field">
                                <strong>Publication:</strong> {experimentData.metaData.publication || 'N/A'}
                            </div>
                        </div>
                
                        <div className="metadata-section">
                            <h2>Methods</h2>
                            <div className="metadata-field">
                                <strong>Instrument:</strong> {experimentData.metaData.instrument || 'N/A'}
                            </div>
                            <div className="metadata-field">
                                <strong>Experiment:</strong> {experimentData.metaData.experiment || 'N/A'}
                            </div>
                            <div className="metadata-field">
                                <strong>Approach:</strong> {experimentData.metaData.approach || 'N/A'}
                            </div>
                            <div className="metadata-field">
                                <strong>Digestion Protocol:</strong> {experimentData.metaData.digestion_protocol || 'N/A'}
                            </div>
                            <div className="metadata-field">
                                <strong>Protease:</strong> {experimentData.metaData.protease || 'N/A'}
                            </div>
                            <div className="metadata-field">
                                <strong>Digestion Time (Sec):</strong> {experimentData.metaData.pk_digestion_time_in_sec || 'N/A'}
                            </div>
                        </div>
                
                        {/* Download Button */}
                        <div className="download-section">
                            <button onClick={handleDownloadPDF} className="download-button">Download QC Data as PDF</button>
                        </div>
                    </div>
                )}
                <div className="results-experiment-search-container">
                    <div id="chart"></div>
                </div>
                <div >
                <div className="condition-section condition-volcano-plot-wrapper">
                <h2>Volcano Plots per comparison</h2><br />
                    <div>
                        <VolcanoPlot
                            differentialAbundanceDataList={differentialAbundanceData}
                        />
                    </div>
                    </div>
                <div className="condition-section condition-volcano-plot-wrapper">
                <h2>Top 20 Proteins by Cumulative LiP Score</h2><br />
                <table>
                    <thead>
                        <tr>
                            <th>Protein Accession</th>
                            <th>Cumulative LiP Score</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topProteins.map((protein, index) => (
                            <tr key={index}>
                                <td>{protein.pg_protein_accessions}</td>
                                <td>{protein.cumulativeScore.toFixed(2)}</td>
                                <td>{protein.protein_description || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
            </div>
            
       
    );
};


export default ExperimentInfo;
