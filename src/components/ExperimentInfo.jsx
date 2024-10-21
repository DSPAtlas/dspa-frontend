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
    const [namespace, setNamespace] = useState('BP'); 
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
          setExperimentData(data.experimentData);
        } catch (error) {
          console.error("Error fetching data: ", error);
          setError(`Failed to load experiment data: ${error}`);
        }finally {
            setLoading(false);
        } 
      }, [experimentID]);
    

    useEffect(() => {
        fetchExperimentData();
    }, [fetchExperimentData]);

    useEffect(() => {
        if (experimentData && experimentData.proteinScores) {
            const top20 = getTop20Proteins(experimentData.proteinScores);
            setTopProteins(top20);
        }
    }, [experimentData]);

    useEffect(() => {
        if (experimentData && experimentData.goEnrichment) {
            const chartElement = document.getElementById("chart");
            if (chartElement) {
                GOEnrichmentVisualization({ 
                    goEnrichmentData: experimentData.goEnrichment, 
                    namespace: namespace 
                });
            } else {
                console.error("Chart element not properly loaded or has zero dimensions");
            }
        }
    }, [experimentData, namespace]);

    const handleNamespaceChange = (event) => {
        setNamespace(event.target.value);
    };

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
                            <span className="result-text">Submission: {experimentData.submission || 'N/A'}</span><br />
                            <span className="result-text">Description: {experimentData.description || 'N/A'}</span><br />
                        </div>
                    )
                )}
                <div className="results-experiment-search-container">
                    <div id="chart"></div>
                </div>
                {experimentData && experimentData.goEnrichment && experimentData.goEnrichment.length > 0 && (
                    <div className="results-experiment-search-container">
                        <div className="namespace-dropdown">
                            <select value={namespace} onChange={handleNamespaceChange}>
                                <option value="BP">Biological Process</option>
                                <option value="MF">Molecular Function</option>
                                <option value="CC">Cellular Component</option>
                            </select>
                        </div>
                    </div>
                )}
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
