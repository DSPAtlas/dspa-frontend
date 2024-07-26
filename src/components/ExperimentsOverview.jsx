import React, { useState, useEffect } from 'react';
import config from '../config.json';
import { useNavigate } from 'react-router-dom';

const ExperimentOverview = () => {
  const [experiments, setExperiments] = useState([]);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [experimentInfo, setExperimentInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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


  const handleRowClick = (experiment) => {
    navigate(`/experiment/${experiment.lipexperiment_id}`);
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
    </div>
  );
};

export default ExperimentOverview;
