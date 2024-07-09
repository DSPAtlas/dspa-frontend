import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config.json';
import { GOEnrichmentVisualization } from '../visualization/goterm.js'; 

const ExperimentInfo = () => {
    const { experimentID } = useParams(); 
    const [loading, setLoading] = useState(false);
    const [experimentData, setExperimentData] = useState(null);
    const [namespace, setNamespace] = useState('BP'); 
    const [error, setError] = useState('');
    
    const fetchExperimentInfo = useCallback(async () => {
        setLoading(true);
        setError('');
        const queryParams = `experimentID=${encodeURIComponent(experimentID)}`;
        const url = `${config.apiEndpoint}/v1/experiments?${queryParams}`;
        console.log(url);
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json(); 
            setExperimentData(data.experimentData);
        } catch (error) {
            console.error("Error fetching data: ", error);
            setError('Failed to load experiment data');
            setExperimentData({});
        } finally {
            setLoading(false);
        } 
    }, [experimentID]);

    useEffect(() => {
        fetchExperimentInfo();
    }, [fetchExperimentInfo]);

    const handleNamespaceChange = (event) => {
        setNamespace(event.target.value);
    };

    useEffect(() => {
        if (experimentData && experimentData.goEnrichment) {
            // Ensure the canvas element is fully loaded and has non-zero dimensions
            const chartElement = document.getElementById("chart");
            if (chartElement ) {
                GOEnrichmentVisualization({ 
                    goEnrichmentData: experimentData.goEnrichment, 
                    namespace: namespace 
                });
            } else {
                console.error("Chart element not properly loaded or has zero dimensions");
            }
        }
    }, [namespace, experimentData]);

    return (
        <div className="result-container">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                experimentData &&
                experimentData.experimentID && (
                    <div>
                        <span className="experiment-header"> </span><br />
                        <span className="experiment-header">LiP Experiment ID {experimentData.experimentID}</span><br />
                        <span className="result-text">Submission: {experimentData.submission || 'N/A'}</span><br />
                        <span className="result-text">ProteomeXchange ID: {experimentData.proteomexchangeID || 'N/A'}</span><br />
                        <span className="result-text">Peptide Atlas ID: {experimentData.peptideatlasID || 'N/A'}</span><br />
                        <span className="result-text">Taxonomy ID: {experimentData.taxonomyID || 'N/A'}</span><br />
                        <span className="result-text">Preprocessed: {experimentData.preprocessed || 'N/A'}</span><br />
                        <span className="result-text">Treatment: {experimentData.treatment || 'N/A'}</span><br />
                        <span className="result-text">Instrument: {experimentData.instrument || 'N/A'}</span><br />
                        <span className="result-text">Digestion Enyzme: {experimentData.enzyme || 'N/A'}</span><br />
                        <span className="result-text">Description: {experimentData.description || 'N/A'}</span><br />
                        <span className="experiment-header"> </span><br />
                    </div>
                )
            )}
            <div className="results-experiment-search-container">
            <div id="chart"></div>
                {experimentData && experimentData.goEnrichment && (
                <div className="namespace-dropdown">
                        <select value={namespace} onChange={handleNamespaceChange}>
                            <option value="BP">Biological Process</option>
                            <option value="MF">Molecular Function</option>
                            <option value="CC">Cellular Component</option>
                        </select>
                    </div>
                    )}
            </div> 
        </div>
    );
};

export default ExperimentInfo;
