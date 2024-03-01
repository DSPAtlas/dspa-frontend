import axios from 'axios';
//import config from '../../config/config.mjs';

// const Search = () => {
//   const [proteinName, setProteinName] = useState('');
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);

//   const handleSearch = async () => {
//     try {
//       const response = await axios.post(`http://localhost:${3000}/search`, { proteinName });
//       setResult(response.data);
//       setError(null); // Clear any previous errors
//     } catch (error) {
//       console.error('Error searching protein:', error.message);
//       setResult(null); // Clear previous results in case of an error
//       setError('An error occurred while searching for the protein.'); // Set error message
//     }
//   };

//   return (
//     <div>
//       <h1>Search Page</h1>
//       <input
//         type="text"
//         value={proteinName}
//         onChange={(e) => setProteinName(e.target.value)}
//         placeholder="Enter protein name"
//       />
//       <button onClick={handleSearch}>Search</button>
//       {error && <div style={{ color: 'red' }}>{error}</div>}
//       {result && (
//         <div>
//           <h2>Search Result:</h2>
//           <pre>{JSON.stringify(result, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Search;


// frontend/src/components/ProteinVisualization.js

import React, { useState, useEffect } from 'react';

const ProteinVisualization = () => {
  const [organismList, setOrganismList] = useState([]);
  const [selectedOrganism, setSelectedOrganism] = useState('');
  const [proteinName, setProteinName] = useState('');
  const [svgImage, setSvgImage] = useState(null);

  useEffect(() => {
    fetch('/api/organisms')
      .then((response) => response.json())
      .then((data) => {
        setOrganismList(data);
        setSelectedOrganism(data[0].taxonomy_id); // Set default selected organism
      })
      .catch((error) => console.error('Error fetching organisms:', error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send API request to backend to fetch sequence
      const response = await fetch(`/api/protein?name=${proteinName}&taxonomy_id=${selectedOrganism}`);
      const data = await response.json();
  
      // Check if the response contains SVG data
      if (data && data.svg) {
        // Update state with SVG image
        setSvgImage(data.svg);
      } else {
        // Handle error if SVG data is not received
        console.error('Error fetching SVG data:', data);
      }
    } catch (error) {
      console.error('Error fetching protein sequence:', error);
    }
  };

  return (
    <div>
      {/* Organism Dropdown */}
      <label>
        Select Organism:
        <select value={selectedOrganism} onChange={(e) => setSelectedOrganism(e.target.value)}>
          {organismList.map((organism) => (
            <option key={organism.taxonomy_id} value={organism.taxonomy_id}>{organism.organism_name}</option>
          ))}
        </select>
      </label>
      
      {/* Protein Name Input */}
      <form onSubmit={handleSubmit}>
        <label>
          Protein Name:
          <input
            type="text"
            value={proteinName}
            onChange={(e) => setProteinName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Search</button>
      </form>
      
      {/* Display SVG image */}
      {svgImage && <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svgImage)}`} alt="Protein Visualization" />}
    </div>
  );
};

export default ProteinVisualization;
  