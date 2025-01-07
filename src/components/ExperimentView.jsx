import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config.json';
import { GOEnrichmentVisualization } from '../visualization/goterm.js';

const getTop20Proteins = (proteinScores) => {
    const sortedData = proteinScores.sort((a, b) => b.cumulativeScore - a.cumulativeScore);
    return sortedData.slice(0, 20);
};


const ExperimentInfo = () => {
    const { experimentID } = useParams(); 
    const [loading, setLoading] = useState(false);
    const [experimentData, setExperimentData] = useState([]);
    const [error, setError] = useState('');
    const [topProteins, setTopProteins] = useState([]);

    const fetchExperimentData = useCallback(async () => {
        const url = `${config.apiEndpoint}experiment?experimentID=${experimentID}`;
        try {
          const response = await fetch(url);
          console.log('Response:', response);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log("exoerumentdata", data.experimentData);
          setExperimentData(data.experimentData);
        } catch (error) {
          console.error("Error fetching data: ", error);
          setError(`Failed to load experiment data: ${error}`);
        }finally {
            setLoading(false);
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
                            <h1>LiP Experiment ID: <span>{experimentData.experimentID}</span></h1>
                        </div>
                
                        {/* Metadata Sections */}
                        <div className="metadata-section">
                            <h2>General Information</h2>
                            <div className="metadata-field">
                                <strong>Perturbation:</strong> {experimentData.metaData.perturbation || 'N/A'}
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
                    <div  className="experiment-header">
                <h1>Top 20 Proteins by Cumulative LiP Score</h1><br />
                </div>
                <div className="experiment-protein-container">
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
