import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config.json';
import Select from 'react-select';


function ProteinSearchResult({searchResults}) {
  
  const navigate = useNavigate();

  const handleLinkClick = (event, taxonomyID, proteinName) => {
    event.preventDefault();
    navigate(`/visualize/${taxonomyID}/${encodeURIComponent(proteinName)}`);
  };

  return (
    <div>
    <div className="results-search-container">
        {searchResults && searchResults.table && searchResults.table.length > 0 ? (
            <table>
                <thead>
                    <tr>
                        <th>Protein Name</th>
                        <th>Taxonomy</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResults.table.map((entry, index) => (
                        <tr key={index}>
                            <td>
                                <button onClick={(e) => handleLinkClick(e, entry.taxonomyID, entry.proteinName)}>
                                    {entry.proteinName}
                                </button>
                            </td>
                            <td>{entry.taxonomyName}</td>
                            <td>{entry.proteinDescription}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>No search results to display.</p>
        )}
      </div>
    </div>
  )
};




const ProteinSearch = () => {
  const [selectedOrganism, setSelectedOrganism] = useState('559292'); 
  const [experimentID, setExperimentID] = useState('LIP000001'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [taxonomy, setTaxonomy] = useState([]);
  const [treatment, setTreatment] = useState([]);
  const [enzyme, setEnzyme] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const navigate = useNavigate();

  const handleOrganismChange = (event) => {
    setSelectedOrganism(event.target.value);
  };

  const handleProteinNameChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleExperimentIDChange = (event) => {
    setExperimentID(event.target.value);
  };

  const handleTaxonomyChange = (selectedOptions) => {
    setTaxonomy(selectedOptions);
  };

  const handleTreatmentChange = (selectedOptions) => {
    setTreatment(selectedOptions);
  };

  const handleEnzymeChange = (selectedOptions) => {
    setEnzyme(selectedOptions);
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
        navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
      } else {
        throw new Error(data.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmitExperiment = (event) => {
    event.preventDefault();
    navigate(`/experiment/${experimentID}/`);
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
        {searchResults && <ProteinSearchResult searchResults={searchResults} />}
      </div>
      <div className="search-experiment-form-container">
        <form className="search-form" onSubmit={handleSubmitExperiment}>
          
          <div className="form-group">
            <label>LiP Experiment</label>
            <select 
              className="select-dropdown" 
              value={experimentID} 
              onChange={handleExperimentIDChange}>
              <option value="LIP000001">LIP000001</option>
            </select>
          </div>

        <div className="form-group">
          <label>Taxonomy</label>
          <Select
            isMulti
            value={taxonomy}
            onChange={handleTaxonomyChange}
            options={[
              { value: '10090', label: 'Mus musculus' },
              { value: '559292', label: 'Saccharomyces cerevisiae S288C' },
              { value: '9606', label: 'Homo Sapiens' },
            ]}
            className="select-dropdown"
          />
        </div>

        <div className="form-group">
          <label>Treatment</label>
          <Select
            isMulti
            value={treatment}
            onChange={handleTreatmentChange}
            options={[
              { value: '', label: 'Osmotic' },
              { value: '559292', label: ' ' },
              { value: '9606', label: ' ' },
            ]}
            className="select-dropdown"
          />
        </div>

        <div className="form-group">
          <label>Digestion Enzyme</label>
          <Select
            isMulti
            value={enzyme}
            onChange={handleEnzymeChange}
            options={[
              { value: '', label: 'Proteinase K' },
              { value: '559292', label: 'Trypsin' },
              { value: '9606', label: 'Chymotrypsin' },
            ]}
            className="select-dropdown"
          />
        </div>

          <button type="submit" className="search-button">Submit</button>
        </form>
        {error && <p>Error: {error}</p>}
      </div>
    </div>
  );
};

export default ProteinSearch;