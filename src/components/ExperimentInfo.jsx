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


    const fetchExperimentData = useCallback(() => {
        const url = `${config.apiEndpoint}experiment/${experimentID}`;
        
        try {
            const response = fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data =  response.json(); 
            setExperimentData(data.experiment);

        } catch (error) {
            console.error("Error fetching data: ", error);
            setError('Failed to load experiment data');
            setExperimentData([]);

        } finally {
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
                ) : (
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
                                {experimentData.map(experiment => (
                                    <tr key={experiment.experimentID}  >
                                        <td>{experiment.experimentID}</td>
                                        <td>{experiment.submission || 'N/A'}</td>
                                        <td>{experiment.proteomexchangeID || 'N/A'}</td>
                                        <td>{experiment.peptideatlasID || 'N/A'}</td>
                                        <td>{experiment.taxonomyID || 'N/A'}</td>
                                        <td>{experiment.preprocessed || 'N/A'}</td>
                                        <td>{experiment.treatment || 'N/A'}</td>
                                        <td>{experiment.instrument || 'N/A'}</td>
                                        <td>{experiment.enzyme || 'N/A'}</td>
                                        <td>{experiment.description || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {experimentData.length > 0 && experimentData[0].goEnrichment && (
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
                )}
            </div>
        </div>
    );
};

export default ExperimentInfo;
