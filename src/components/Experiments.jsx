import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../config.json';
import { GOEnrichmentVisualization } from '../visualization/goterm.js'; 

const ExperimentInfo = () => {
    const { experimentID } = useParams(); 
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [experimentData, setExperimentData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const fetchExperimentInfo = async () => {
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
    };

    useEffect(() => {
        fetchExperimentInfo();
    }, [experimentID]);

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        
        try {
            const queryParams = `searchTerm=${encodeURIComponent(searchTerm)}`;
            const url = `${config.apiEndpoint2}search?${queryParams}`;
            const response = await fetch(url);
            const data = await response.json();
        
            if (data.success) {
                setSearchResults(data);
                navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);  
            } else {
                throw new Error(data.message || 'Failed to fetch data');
            }
            
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (experimentData && experimentData.goEnrichment) {
            GOEnrichmentVisualization({ goEnrichmentData: experimentData.goEnrichment });
        }
    }, [experimentData]);

    return (
        <div className="result--container">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                experimentData &&
                experimentData.experimentID && (
                    <div>
                        <span className="result-header"> </span><br />
                        <span className="result-header">LiP Experiment ID {experimentData.experimentID}</span><br />
                        <span className="result-text">Submission: {experimentData.submission || 'N/A'}</span><br />
                        <span className="result-text">Description: {experimentData.description || 'N/A'}</span><br />
                    </div>
                )
            )}
            <div className="results-experiment-search-container">
                <div id="chart"></div>
            </div> 
        </div>
    );
};

export default ExperimentInfo;
