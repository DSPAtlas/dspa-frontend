import React, { useState, useEffect } from 'react';
import config from '../config.json';
import { useParams, useNavigate } from 'react-router-dom'; 
import NightingaleComponent from './NightingaleComponent';
import FunctionalComponent from './FunctionalComponent';


function ProteinVisualizationComponents({proteinData}) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const taxonomy = "Saccharomyces cerevisiae S288C";
    const proteinfunction ="sss";
    return (
        <div className="nightingale-component-container">
        {loading ? <p>Loading...</p> : error ? <p>Error: {error}</p> : (
            proteinData && proteinData.proteinName && (
                <div>
                   <span className="protein-header"> </span><br />
                    <span className="protein-header">UniProt ID {proteinData.proteinName} </span><br />
                    <span className="result-text">Taxonomy: {taxonomy || 'N/A'}</span><br />
                    <span className="result-text">Function: {proteinfunction || 'N/A'}</span><br />
                    <NightingaleComponent proteinData={proteinData} />
                    <span className="protein-header"> </span><br />
                    <h2>Functional LiP Results</h2>
                    <FunctionalComponent proteinData={proteinData} />
                </div>
            )
        )}
    </div>
    )
};


const ProteinVisualization = () => {
    const { taxonomyID, proteinName } = useParams(); 
    
    const [proteinData, setProteinData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [setSelectedTaxonomy] = useState('559292'); 
    
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const fetchProteinData = async () => {
        setLoading(true);
        setError('');
        const queryParams = `taxonomyID=${encodeURIComponent(taxonomyID)}&proteinName=${encodeURIComponent(proteinName)}`;
        const url = `${config.apiEndpoint}/v1/proteins?${queryParams}`;
        console.log(url);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json(); 
            setProteinData(data.proteinData);
            
        } catch (error) {
            console.error("Error fetching data: ", error);
            setError('Failed to load protein data');
            setProteinData({});
        } finally {
            setLoading(false);
        } 
    };

    useEffect(() => {
        fetchProteinData();
    }, [taxonomyID, proteinName]);
  
    const handleTaxonomyChange = (event) => {
        setSelectedTaxonomy(event.target.value);
    };

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


    return (
    <>
        <form onSubmit={handleSubmit}>
            <select name="taxonomyID" value={taxonomyID} onChange={handleTaxonomyChange}>
                <option value="10090">Mus musculus</option>
                <option value="559292">Saccharomyces cerevisiae S288C</option>
                <option value="9606">Homo Sapiens</option>
            </select>
        <input
            type="text"
            name="proteinName"
            value={searchTerm}
            onChange={handleSearchTermChange}
            required
            placeholder="Enter protein name..."
            />
            <button type="submit">Search</button>
        </form>
    <div className="results-search-container">
        {proteinData && <ProteinVisualizationComponents proteinData={proteinData} />}
    </div>
</>
);
};


export default ProteinVisualization;