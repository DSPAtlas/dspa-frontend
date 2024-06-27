import React, { useState, useEffect } from 'react';
import config from '../config.json';
import NightingaleComponent from './NightingaleComponent';
import FunctionalComponent from './FunctionalComponent';

const ProteinVisualization = () => {
  const [selectedOrganism, setSelectedOrganism] = useState('559292'); // Default to Saccharomyces cerevisiae S288C
  const [proteinName, setProteinName] = useState('');
  const [proteinData, setProteinData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOrganismChange = (event) => {
    setSelectedOrganism(event.target.value);
  };

  const handleProteinNameChange = (event) => {
    setProteinName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchProteinData();
  };

  const fetchProteinData = async () => {
    setLoading(true);
    setError('');
    const queryParams = `taxonomyID=${encodeURIComponent(selectedOrganism)}&proteinName=${encodeURIComponent(proteinName)}`;
    const url = `${config.apiEndpoint}/v1/proteins?${queryParams}`;
    console.log(url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json(); // This line throws if the response is not JSON.
        setProteinData(data.proteinData);
    } catch (error) {
        console.error("Error fetching data: ", error);
        setError('Failed to load protein data');
        setProteinData({});
    } finally {
        setLoading(false);
    }
};
    

return (
    <>
    <div className="results-search-container">
        <form onSubmit={handleSubmit}>
            <select name="taxonomyID" value={selectedOrganism} onChange={handleOrganismChange}>
                <option value="10090">Mus musculus</option>
                <option value="559292">Saccharomyces cerevisiae S288C</option>
                <option value="9606">Homo Sapiens</option>
            </select>
            <input
                type="text"
                name="proteinName"
                value={proteinName}
                onChange={handleProteinNameChange}
                required
                placeholder="Enter protein name..."
            />
            <button type="submit">Search</button>
        </form>
    </div>
    <div className="nightingale-component-container">
        {loading ? <p>Loading...</p> : error ? <p>Error: {error}</p> : (
            proteinData && proteinData.proteinName && (
                <div>
                    <h3>UniProt ID {proteinData.proteinName}</h3>
                    <p>Taxonomy: {proteinData.taxonomy || 'N/A'}</p>
                    <NightingaleComponent proteinData={proteinData} />
                    <h2>Functional LiP Results</h2>
                    <FunctionalComponent proteinData={proteinData} />
                </div>
            )
        )}
    </div>
</>
);
};


export default ProteinVisualization;