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
      <form onSubmit={handleSubmit}>
        <label>
          Organism ID:
          <input type="text" value={selectedOrganism} onChange={handleOrganismChange} />
        </label>
        <label>
          Protein Name:
          <input type="text" value={searchTerm} onChange={handleProteinNameChange} />
        </label>
        <button type="submit">Search</button>
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
  );
};

export default ProteinSearch;