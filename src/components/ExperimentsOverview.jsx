import React, { useState, useEffect } from 'react';
import config from '../config.json';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';


const ExperimentOverview = () => {
  const [experiments, setExperiments] = useState([]);
  const [filteredExperiments, setFilteredExperiments] = useState([]);
  const [treatmentOptions, setTreatmentOptions] = useState([]);
  const [taxonomyOptions, setTaxonomyOptions] = useState([]);
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [selectedTaxonomies, setSelectedTaxonomies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${config.apiEndpoint}experiments`)
      .then(response => response.json())
      .then(data => {
        if (data.success && Array.isArray(data.experiments)) {
          setExperiments(data.experiments);
          setFilteredExperiments(data.experiments);

          const uniqueTreatments = [...new Set(data.experiments.map(exp => exp.treatment).filter(treatment => treatment))];
          const uniqueTaxonomies = [...new Set(data.experiments.map(exp => exp.taxonomy_id).filter(taxonomy => taxonomy))];
          
          setTreatmentOptions(uniqueTreatments.map(treatment => ({ value: treatment, label: treatment })));
          setTaxonomyOptions(uniqueTaxonomies.map(taxonomy => ({ value: taxonomy, label: taxonomy })));

        } else {
          console.error('Expected an array of experiments but got:', data);
        }
      })
      .catch(error => console.error('Error fetching experiments:', error));
  }, []);


  const handleRowClick = (experiment) => {
    navigate(`/experiment/${experiment.lipexperiment_id}`);
  };

  const handleTreatmentFilterChange = (selectedOptions) => {
    setSelectedTreatments(selectedOptions);
    applyFilters(selectedOptions, selectedTaxonomies);
  };

  const handleTaxonomyFilterChange = (selectedOptions) => {
    setSelectedTaxonomies(selectedOptions);
    applyFilters(selectedTreatments, selectedOptions);
  };

  const applyFilters = (selectedTreatments, selectedTaxonomies) => {
    const selectedTreatmentValues = selectedTreatments.map(option => option.value);
    const selectedTaxonomyValues = selectedTaxonomies.map(option => option.value);

    const filtered = experiments.filter(experiment => 
      (selectedTreatmentValues.length === 0 || selectedTreatmentValues.includes(experiment.treatment)) &&
      (selectedTaxonomyValues.length === 0 || selectedTaxonomyValues.includes(experiment.taxonomy_id))
    );
    setFilteredExperiments(filtered);
  };

  return (
    <div className="experiment-overview-container">
    <h1>Experiments</h1>
    <table className="experiment-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>
            Taxonomy ID
            <Select
              isMulti
              options={taxonomyOptions}
              value={selectedTaxonomies}
              onChange={handleTaxonomyFilterChange}
              placeholder="Filter by taxonomy ID..."
              className="filter-select"
            />
          </th>
          <th>
            Treatment
            <Select
              isMulti
              options={treatmentOptions}
              value={selectedTreatments}
              onChange={handleTreatmentFilterChange}
              placeholder="Filter by treatment..."
              className="filter-select"
            />
          </th>
          <th>Submission Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {filteredExperiments.map(experiment => (
          <tr key={experiment.lipexperiment_id} onClick={() => handleRowClick(experiment)}>
            <td>{experiment.lipexperiment_id}</td>
            <td>{experiment.taxonomy_id}</td>
            <td>{experiment.treatment || 'N/A'}</td>
            <td>{experiment.submission_timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};


export default ExperimentOverview;
