import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import config from '../config.json';
import ProteinSearchResults from './ProteinSearchResults.jsx';


const ProteinSearch = () => {
  const location = useLocation();
  const [selectedOrganism, setSelectedOrganism] = useState('559292'); 
  const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');
  const [error, setError] = useState('');
  const { searchResults: initialSearchResults } = location.state || {};
  const [searchResults, setSearchResults] = useState(initialSearchResults || null);

  const handleOrganismChange = (event) => {
    setSelectedOrganism(event.target.value);
  };

  const handleProteinNameChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (location.state?.searchTerm) {
      performSearch(location.state.searchTerm);
    }
  }, [location.state?.searchTerm]);

  const performSearch = async (searchTerm) => {
    try {
      const queryParams = `searchTerm=${encodeURIComponent(searchTerm)}`;
      const url = `${config.apiEndpoint}search?${queryParams}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.results);
      } else {
        throw new Error(data.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (initialSearchResults) {
      setSearchResults(initialSearchResults);
    }
  }, [initialSearchResults]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const queryParams = `searchTerm=${encodeURIComponent(searchTerm)}`;
      const url = `${config.apiEndpoint}search?${queryParams}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data);
  
      } else {
        throw new Error(data.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="search-form-container">
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Organism</label>
            <select 
              className="select-dropdown" 
              value={selectedOrganism} 
              onChange={handleOrganismChange}
            >
              <option value="10090">Mus musculus</option>
              <option value="559292">Saccharomyces cerevisiae S288C</option>
              <option value="9606">Homo Sapiens</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Protein Name</label>
            <input 
              type="text" 
              className="search-form" 
              value={searchTerm} 
              onChange={handleProteinNameChange} 
            />
          </div>
          <button type="submit" className="search-button">Search</button>
        </form>
          {error && <p>Error: {error}</p>}
        </div>
        <div className="results-search-container">
        {searchResults && <ProteinSearchResults searchResults={searchResults} />}
      </div>
    </div>
  );
};

export default ProteinSearch;