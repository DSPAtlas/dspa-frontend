import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import config from '../config.json';
import Select from 'react-select';
import ProteinSearchResults from './ProteinSearchResults.jsx';


const ProteinSearch = () => {
  const location = useLocation();
  const [selectedOrganism, setSelectedOrganism] = useState('559292'); 
  const [experimentID, setExperimentID] = useState('LIP000001'); 
  const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');
  const [error, setError] = useState('');
  const [taxonomy, setTaxonomy] = useState([]);
  const [treatment, setTreatment] = useState([]);
  const [enzyme, setEnzyme] = useState([]);
  const { searchResults: initialSearchResults } = location.state || {};
  const [searchResults, setSearchResults] = useState(initialSearchResults || null);
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
        //navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
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
        </div>
        <div className="results-search-container">
        {searchResults && <ProteinSearchResults searchResults={searchResults} />}
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