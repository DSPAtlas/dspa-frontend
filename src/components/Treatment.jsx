import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config.json';
import { GOEnrichmentVisualization } from '../visualization/goterm.js';

const ExperimentTable = ({ experimentData }) => {
    console.log("experimentData", experimentData);

    if (!experimentData || typeof experimentData !== 'object') {
        console.error("experimentData is not an object:", experimentData);
        return <div>No valid data to display</div>;  
    }

    const proteinAccessions = Object.keys(experimentData);
    
    const experimentIDs = [...new Set(
        proteinAccessions.flatMap(protein => Object.keys(experimentData[protein].experiments))
    )];

    return (
        <div>
            <h2>Protein Data Table</h2>
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Protein Accession</th>
                        {experimentIDs.map(experimentID => (
                            <th key={experimentID}>{experimentID}</th>
                        ))}
                        <th>Average Score</th>
                    </tr>
                </thead>
                <tbody>
                    {proteinAccessions.map((proteinAccession) => (
                        <tr key={proteinAccession}>
                            <td>{proteinAccession}</td>
                            {experimentIDs.map(experimentID => (
                                <td key={experimentID}>
                                    {experimentData[proteinAccession].experiments[experimentID] !== undefined
                                        ? experimentData[proteinAccession].experiments[experimentID]
                                        : 0}
                                </td>
                            ))}
                            <td>
                                {(experimentData[proteinAccession].averageScore || 0).toFixed(0)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};



const Treatment = () => {
    const treatmentOptions = ["osmoticstress", "heatshock", "dose_response"];
    const chartRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [treatmentData, setTreatmentData] = useState([]);
    const [namespace, setNamespace] = useState('BP'); 
    const [error, setError] = useState('');
    const [selectedTreatment, setSelectedTreatment] = useState(treatmentOptions[0]); 


    const fetchTreatmentData = useCallback(async () => {
        const url = `${config.apiEndpoint}treatment/treatment?treatment=${selectedTreatment}`;
        try {
          const response = await fetch(url);
          console.log('Response:', response);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setTreatmentData(data.treatmentData);
        } catch (error) {
          console.error("Error fetching data: ", error);
          setError(`Failed to load experiment data: ${error}`);
        }finally {
            setLoading(false);
        } 
      }, [selectedTreatment]);
    
    useEffect(() => {
        fetchTreatmentData();
    }, [fetchTreatmentData]);

    useEffect(() => {
        if (treatmentData && treatmentData.goEnrichmentList && chartRef.current) {
            const chartElement = chartRef.current;

            if (!chartElement) {
                console.error("Chart element not found.");
                return;
            }

            const chartWidth = chartElement.clientWidth || 900; 
            const chartHeight = chartElement.clientHeight || 600;
            
            if (chartWidth === 0 || chartHeight === 0) {
                console.error("Chart element has zero dimensions");
                return;
            }
            
            GOEnrichmentVisualization({ 
                goEnrichmentData: treatmentData.goEnrichmentList[0], 
                namespace: namespace 
            });
        }
    }, [treatmentData, namespace]);

    const handleNamespaceChange = (event) => {
        setNamespace(event.target.value);
    };

    const handleTreatmentChange = (event) => {
        setSelectedTreatment(event.target.value); 

    return (
            <div>
                <div className="result-container">
                     {/* Treatment Selection Dropdown */}
                     <div className="treatment-dropdown">
                        <label htmlFor="treatmentSelect">Select Treatment: </label>
                        <select 
                            id="treatmentSelect" 
                            value={selectedTreatment} 
                            onChange={handleTreatmentChange}
                        >
                            {treatmentOptions.map((treatment) => (
                                <option key={treatment} value={treatment}>
                                    {treatment}
                                </option>
                            ))}
                        </select>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        treatmentData &&
                        treatmentData.treatment && (
                            <div>
                                <span className="result-header">Treatment {treatmentData.treatment}</span><br />
                            </div>
                        )
                    )}
                    <div className="results-experiment-search-container">
                        <div ref={chartRef} id="chart" style={{ width: '900px', height: '600px' }}></div>
                    </div>
                    {treatmentData && treatmentData.goEnrichmentList && treatmentData.goEnrichmentList.length > 0 && (
                        <div className="results-experiment-search-container">
                            <div className="namespace-dropdown">
                                <select value={namespace} onChange={handleNamespaceChange}>
                                    <option value="BP">Biological Process</option>
                                    <option value="MF">Molecular Function</option>
                                    <option value="CC">Cellular Component</option>
                                </select>
                            </div>
                        </div>
                    )}
                    <div>
                    <span className="result-text">Cumulative LiP Score</span><br />
                    <div className="table-container">
                            {treatmentData && treatmentData.proteinScoresTable && (
                                <ExperimentTable 
                                    experimentData={treatmentData.proteinScoresTable} 
                                />
                            )}
                        </div>
                </div>
                </div>
                
            </div>
        );
    };
}
export default Treatment;