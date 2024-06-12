import React, { useState, useEffect } from 'react';

const ProteinVisualization = () => {

  const [selectedOrganism, setSelectedOrganism] = useState('559292');  // Default to Saccharomyces cerevisiae S288C
  const [proteinName, setProteinName] = useState('');
  const [proteinData, setProteinData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // Handle changes to the select dropdown for organisms
  const handleOrganismChange = (event) => {
    setSelectedOrganism(event.target.value);
  };

  // Handle changes to the protein name input
  const handleProteinNameChange = (event) => {
    setProteinName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchProteinData();
  };

  const fetchProteinData = async () => {
      try {
          setLoading(true);
          setError('');
          const queryParams = `taxonomyID=${encodeURIComponent(selectedOrganism)}&proteinName=${encodeURIComponent(proteinName)}`;
          const response = await fetch(`/api/proteins?${queryParams}`);
          const data = await response.json();
          if (!response.ok) {
              throw new Error(data.message || 'An error occurred while fetching data');
          }
          setProteinData(data.proteinData);
      } catch (error) {
          setError(error.message);
          setProteinData({});
      } finally {
          setLoading(false);
      }
  }

  useEffect(() => {
    // Update the protein name in the HTML
    const header = document.getElementById('proteinName');
    if (header && proteinData.proteinName) {
      header.textContent = `Protein: ${proteinData.proteinName}`;
    }
  }, [proteinData]); // Dependency array ensures this runs only if proteinData changes

  useEffect(() => {
    // Update elements when proteinData changes
    const sequenceElement = document.getElementById('sequence');
    if (sequenceElement && proteinData.sequence) {
      sequenceElement.setAttribute('data', proteinData.sequence);
    }
  }, [proteinData.sequence]);  

  return (
    <div className="search-container">
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
    <div>
      {/* Display Protein Data */}
      {proteinData && (
        <div>
          <h3>Protein Details</h3>
          <p>Name: {proteinData.proteinName}</p>
          <p>Sequence: {proteinData.proteinSequence}</p>
          <p>Structure: {proteinData.proteinStructure}</p>
          <p>Differential Abundance Data: {proteinData.differentialAbundanceData}</p>
          <p>Barcode Sequence: {proteinData.barcodesequence}</p>
        </div>
      )}
    <iframe src="/public/proteinView.html" style={{ width: '100%', height: '500px', border: 'none' }}></iframe>
  </div>
  </div>
  );
};

export default ProteinVisualization;