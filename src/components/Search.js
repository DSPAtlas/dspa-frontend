import React, { useState, useEffect } from 'react';

const ProteinVisualization = () => {
  const [organismList, setOrganismList] = useState([]);
  const [selectedOrganism, setSelectedOrganism] = useState('');
  const [proteinName, setProteinName] = useState('');
  const [svgImage, setSvgImage] = useState(null);


const fetchProteinData = async () => {
    try {
        const response = await fetch(`/api/proteins?taxonomyID=123&proteinName=example`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'An error occurred');
        }
        console.log(data.proteinData); // Process your data here
    } catch (error) {
        console.error('Fetching error:', error.message);
    }
}

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
  