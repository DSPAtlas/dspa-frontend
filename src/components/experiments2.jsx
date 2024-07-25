import React, { useState, useEffect } from 'react';
import config from '../config.json';

const Experiments = () => {
  const [experiments, setExperiments] = useState([]);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [experimentInfo, setExperimentInfo] = useState(null);
  const [goEnrichment, setGoEnrichment] = useState(null);

  useEffect(() => {
    // Fetch all experiments on component mount
    fetch(`${config.apiEndpoint}experiments`)
      .then(response => response.json())
      .then(data => {
        if (data.success && Array.isArray(data.experiments)) {
          setExperiments(data.experiments);
        } else {
          console.error('Expected an array of experiments but got:', data);
        }
      })
      .catch(error => console.error('Error fetching experiments:', error));
  }, []);

  const fetchExperimentInfo = (experimentId) => {
    // Fetch the selected experiment info
    fetch(`${config.apiEndpoint}experiment/${experimentId}`)
      .then(response => response.json())
      .then(data => {
        setExperimentInfo(data);
        // Assume goEnrichment is a part of the fetched experiment data
        if (data.goEnrichment) {
          setGoEnrichment(data.goEnrichment);
        } else {
          setGoEnrichment([]);
        }
      })
      .catch(error => console.error('Error fetching experiment info:', error));
  };

  const handleRowClick = (experiment) => {
    setSelectedExperiment(experiment);
    fetchExperimentInfo(experiment.lipexperiment_id);
  };

  return (
    <div>
      <h1>Experiments</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Taxonomy ID</th>
            <th>Treatment</th>
            <th>Submission Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {experiments.map(experiment => (
            <tr key={experiment.lipexperiment_id} onClick={() => handleRowClick(experiment)}>
              <td>{experiment.lipexperiment_id}</td>
              <td>{experiment.taxonomy_id}</td>
              <td>{experiment.treatment || 'N/A'}</td>
              <td>{experiment.submission_timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {experimentInfo && (
        <div>
          <h2>Experiment Info</h2>
          <p><strong>ID:</strong> {experimentInfo.id}</p>
          <p><strong>Name:</strong> {experimentInfo.name}</p>
          <p><strong>Description:</strong> {experimentInfo.description}</p>
          <h3>GO Enrichment</h3>
          {goEnrichment.length > 0 ? (
            <ul>
              {goEnrichment.map((enrichment, index) => (
                <li key={index}>{enrichment}</li>
              ))}
            </ul>
          ) : (
            <p>No GO Enrichment data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Experiments;
