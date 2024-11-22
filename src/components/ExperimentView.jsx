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
    
        // Convert the binary data to a Blob
        const blob = new Blob([new Uint8Array(experimentData.metaData.qc_pdf_file.data)], { type: 'application/pdf' });
    
        // Create a URL for the Blob and trigger the download
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
            <div className="result-container">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    experimentData &&
                    experimentData.experimentID && (
                        <div>
                            <span className="result-header">LiP Experiment ID {experimentData.experimentID}</span><br />
                            <span className="result-text">Perturbation: {experimentData.metaData.perturbation || 'N/A'}</span><br />
                            <span className="result-text">Condition: {experimentData.metaData.condition || 'N/A'}</span><br />
                            <span className="result-text">TaxonomyID: {experimentData.metaData.taxonomy_id || 'N/A'}</span><br />
                            <span className="result-text">Strain: {experimentData.metaData.strain || 'N/A'}</span><br />
                            <span className="result-text">Publication: {experimentData.metaData.publication || 'N/A'}</span><br />
                            <h3> Methods</h3>
                            <span className="result-text">Instrument: {experimentData.metaData.instrument || 'N/A'}</span><br />
                            <span className="result-text">Experiment: {experimentData.metaData.experiment || 'N/A'}</span><br />
                            <span className="result-text">Approach: {experimentData.metaData.approach || 'N/A'}</span><br />
                            <span className="result-text">Digestion Protocol: {experimentData.metaData.digestion_protocol || 'N/A'}</span><br />
                            <span className="result-text">Protease: {experimentData.metaData.protease || 'N/A'}</span><br />
                            <span className="result-text">Digestion Time in Sec: {experimentData.metaData.pk_digestion_time_in_sec || 'N/A'}</span><br />
                            <button onClick={handleDownloadPDF}>Download QC Data as PDF</button>
                        </div>
                    )
                )}
                <div className="results-experiment-search-container">
                    <div id="chart"></div>
                </div>
                <div>
                <span className="result-text">Top 20 Proteins by Cumulative LiP Score</span><br />
                <div className="table-container">
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
            
        </div>
    );
};


export default ExperimentInfo;
