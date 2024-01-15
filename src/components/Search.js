import React, { useState } from 'react';
import axios from 'axios';
//import config from '../../config/config.mjs';

const Search = () => {
  const [proteinName, setProteinName] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.post(`http://localhost:${3000}/search`, { proteinName });
      setResult(response.data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error searching protein:', error.message);
      setResult(null); // Clear previous results in case of an error
      setError('An error occurred while searching for the protein.'); // Set error message
    }
  };

  return (
    <div>
      <h1>Search Page</h1>
      <input
        type="text"
        value={proteinName}
        onChange={(e) => setProteinName(e.target.value)}
        placeholder="Enter protein name"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {result && (
        <div>
          <h2>Search Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Search;