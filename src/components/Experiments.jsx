import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config.json';
import { GOEnrichmentVisualization } from '../visualization/goterm.js';
import Select from 'react-select'; // Assuming react-select is being used

const ExperimentInfo = () => {
    const { experimentID } = useParams(); 
    const [loading, setLoading] = useState(false);
    const [experimentData, setExperimentData] = useState([]);
    const [filteredExperiments, setFilteredExperiments] = useState([]);
    const [namespace, setNamespace] = useState('BP'); 
    const [error, setError] = useState('');
    const [taxonomy, setTaxonomy] = useState([]);
    const [treatment, setTreatment] = useState([]);
    const [enzyme, setEnzyme] = useState([]);
    const [selectedExperimentID, setSelectedExperimentID] = useState(experimentID);

    const fetchExperimentInfo = useCallback(async () => {
        setLoading(true);
        setError('');
        const url = `${config.apiEndpoint}experiments`;
        console.log(url);
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json(); 
            setExperimentData(data.experiments);
            setFilteredExperiments(data.experiments);
        } catch (error) {
            console.error("Error fetching data: ", error);
            setError('Failed to load experiment data');
            setExperimentData([]);
        } finally {
            setLoading(false);
        } 
    }, []);

    useEffect(() => {
        fetchExperimentInfo();
    }, [fetchExperimentInfo]);

    const handleNamespaceChange = (event) => {
        setNamespace(event.target.value);
    };

    const handleExperimentIDChange = (event) => {
        setSelectedExperimentID(event.target.value);
        filterExperiments(event.target.value);
    };

    const handleTaxonomyChange = (selectedOptions) => {
        setTaxonomy(selectedOptions);
    };

    const handleTreatmentChange = (selectedOptions) => {
        setTreatment(selectedOptions);
    };

    const handleEnzymeChange = (selectedOptions) => {
        setEnzyme(selectedOptions);
    };

    const handleSubmitExperiment = (event) => {
        event.preventDefault();
        fetchExperimentInfo();
    };

    const filterExperiments = (experimentID) => {
        if (experimentID) {
            const filtered = experimentData.filter(experiment => experiment.experimentID === experimentID);
            setFilteredExperiments(filtered);
        } else {
            setFilteredExperiments(experimentData);
        }
    };

    useEffect(() => {
        if (experimentData && experimentData.length > 0 && selectedExperimentID) {
            filterExperiments(selectedExperimentID);
        }
    }, [selectedExperimentID, experimentData]);

    useEffect(() => {
        if (filteredExperiments.length > 0 && filteredExperiments[0].goEnrichment) {
            // Ensure the canvas element is fully loaded and has non-zero dimensions
            const chartElement = document.getElementById("chart");
            if (chartElement) {
                GOEnrichmentVisualization({ 
                    goEnrichmentData: filteredExperiments[0].goEnrichment, 
                    namespace: namespace 
                });
            } else {
                console.error("Chart element not properly loaded or has zero dimensions");
            }
        }
    }, [namespace, filteredExperiments]);

    const handleRowClick = (experimentID) => {
        setSelectedExperimentID(experimentID);
        filterExperiments(experimentID);
    };

    return (
        <div>
            <div className="search-experiment-form-container">
                <form className="search-form" onSubmit={handleSubmitExperiment}>
                    <div className="form-group">
                        <label>LiP Experiment</label>
                        <select 
                            className="select-dropdown" 
                            value={selectedExperimentID} 
                            onChange={handleExperimentIDChange}>
                            <option value="">All</option>
                            {experimentData.map(exp => (
                                <option key={exp.experimentID} value={exp.experimentID}>{exp.experimentID}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Taxonomy</label>
                        <Select
                            isMulti
                            value={taxonomy}
                            onChange={handleTaxonomyChange}
                            options={[
                                { value: '10090', label: 'Mus musculus' },
                                { value: '559292', label: 'Saccharomyces cerevisiae S288C' },
                                { value: '9606', label: 'Homo Sapiens' },
                            ]}
                            className="select-dropdown"
                        />
                    </div>

                    <div className="form-group">
                        <label>Treatment</label>
                        <Select
                            isMulti
                            value={treatment}
                            onChange={handleTreatmentChange}
                            options={[
                                { value: 'Osmotic', label: 'Osmotic' },
                                // Add more options as needed
                            ]}
                            className="select-dropdown"
                        />
                    </div>

                    <div className="form-group">
                        <label>Digestion Enzyme</label>
                        <Select
                            isMulti
                            value={enzyme}
                            onChange={handleEnzymeChange}
                            options={[
                                { value: 'Proteinase K', label: 'Proteinase K' },
                                { value: 'Trypsin', label: 'Trypsin' },
                                { value: 'Chymotrypsin', label: 'Chymotrypsin' },
                            ]}
                            className="select-dropdown"
                        />
                    </div>

                    <button type="submit" className="search-button">Submit</button>
                </form>
                {error && <p>Error: {error}</p>}
            </div>

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
                                {filteredExperiments.map(experiment => (
                                    <tr key={experiment.experimentID} onClick={() => handleRowClick(experiment.experimentID)} style={{ cursor: 'pointer' }}>
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

                        {filteredExperiments.length > 0 && filteredExperiments[0].goEnrichment && (
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
