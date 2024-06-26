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
    <header className="app-header">
      <div className="logo">Dynamic Structural Proteome Atlas</div>
      <nav className="topnav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/search">Search</a></li>
        </ul>
      </nav>
    </header>
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Organism ID:</label>
          <input type="text" className="form-control" value={selectedOrganism} onChange={handleOrganismChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Protein Name:</label>
          <input type="text" className="form-control" value={searchTerm} onChange={handleProteinNameChange} />
        </div>
        <button type="submit" className="button">Search</button>
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