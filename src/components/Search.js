// Search.js
import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
    const [proteinName, setProteinName] = useState('');
    const [result, setResult] = useState(null);
  
    const handleSearch = async () => {
      try {
        const response = await axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT || 3000}/search`, { proteinName });
        setResult(response.data);
      } catch (error) {
        console.error('Error searching protein:', error.message);
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