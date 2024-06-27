import React, { useState, useEffect } from 'react';
import { useLocation, Link} from 'react-router-dom';
import config from '../config.json';

const ProteinSearch = () => {
  const [selectedOrganism, setSelectedOrganism] = useState('559292'); // Default to Saccharomyces cerevisiae S288C
  const [proteinName, setProteinName] = useState(''); // Added missing state for proteinName
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const handleOrganismChange = (event) => {
    setSelectedOrganism(event.target.value);
  };

  const handleProteinNameChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const queryParams = `searchTerm=${encodeURIComponent(searchTerm)}`;
      const url = `${config.apiEndpoint2}search?${queryParams}`;
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
                <label className="">Organism </label>
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
                <label className="form-label">Protein Name </label>
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
      {searchResults && searchResults.table && (
        <table>
          <thead>
            <tr>
              <th>Protein Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.table.map((entry, index) => (
              <tr key={index}>
                <td>
                  <Link to={`/visualize/${selectedOrganism}/${entry.proteinName}`}>
                    {entry.proteinName}
                  </Link>
                </td>
                <td>{entry.proteinDescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
};

export default ProteinSearch;