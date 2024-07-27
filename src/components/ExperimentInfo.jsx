import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config.json';
import { GOEnrichmentVisualization } from '../visualization/goterm.js';
import Select from 'react-select'; 

const ExperimentInfo = () => {
    const { experimentID } = useParams(); 
    const [loading, setLoading] = useState(false);
    const [experimentData, setExperimentData] = useState([]);
    const [namespace, setNamespace] = useState('BP'); 
    const [error, setError] = useState('');


    const fetchExperimentData = useCallback(async () => {
        const url = `${config.apiEndpoint}experiment?experimentID=${experimentID}`;
        try {
          const response = await fetch(url);
          console.log('Response:', response);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log(data);
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
                ) : experimentData ? (
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Experiment ID</th>
                                    <th>Submission</th>
                                    <th>ProteomeXchange ID</th>
                                    <th>Peptide Atlas ID</th>
                                    <th>Taxonomy ID</th>
                                    <th>Preprocessed</th>
                                    <th>Treatment</th>
                                    <th>Instrument</th>
                                    <th>Digestion Enzyme</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Render a single row with data from experimentData */}
                                <tr>
                                    <td>{experimentData.experimentID}</td>
                                    <td>{experimentData.submission || 'N/A'}</td>
                                    <td>{experimentData.proteomexchangeID || 'N/A'}</td>
                                    <td>{experimentData.peptideatlasID || 'N/A'}</td>
                                    <td>{experimentData.taxonomyID || 'N/A'}</td>
                                    <td>{experimentData.preprocessed || 'N/A'}</td>
                                    <td>{experimentData.treatment || 'N/A'}</td>
                                    <td>{experimentData.instrument || 'N/A'}</td>
                                    <td>{experimentData.enzyme || 'N/A'}</td>
                                    <td>{experimentData.description || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                        {experimentData.goEnrichment && experimentData.goEnrichment.length > 0 && (
                            <div className="results-experiment-search-container">
                                <div id="chart"></div>
                                <div className="namespace-dropdown">
                                    <select value={namespace} onChange={handleNamespaceChange}>
                                        <option value="BP">Biological Process</option>
                                        <option value="MF">Molecular Function</option>
                                        <option value="CC">Cellular Component</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>No data available.</p> // This will display if experimentData is null
                )}
            </div>
        </div>
    );
};

export default ExperimentInfo;
