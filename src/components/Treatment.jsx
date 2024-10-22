import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config.json';
import { GOEnrichmentVisualization } from '../visualization/goterm.js';
import NightingaleComponent from './NightingaleComponent';
import { useProteinData } from '../hooks/useProteinData'; 

const ExperimentTable = ({ experimentData, onProteinClick }) => {
    console.log("experimentData", experimentData);

    if (!experimentData || !Array.isArray(experimentData)) {
        console.error("experimentData is not an array:", experimentData);
        return <div>No valid data to display</div>;  
    }
    const proteinAccessions = experimentData.map(data => data.proteinAccession);
  
    const experimentIDs = [...new Set(
        experimentData.flatMap(protein => Object.keys(protein.experiments))
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
                    {experimentData.map((proteinData) => (
                        <tr 
                            key={proteinData.proteinAccession}
                            onClick={() => onProteinClick(proteinData.proteinAccession)} 
                            style={{ cursor: 'pointer' }}  
                        >
                            <td>{proteinData.proteinAccession}</td>
                            {experimentIDs.map(experimentID => (
                                <td key={experimentID}>
                                    {proteinData.experiments[experimentID] !== undefined
                                        ? proteinData.experiments[experimentID]
                                        : 0}
                                </td>
                            ))}
                            <td>
                                {(proteinData.averageScore || 0).toFixed(0)}
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
    const [displayedProtein, setDisplayedProtein] = useState("");

    const { loading: proteinLoading, error: proteinError, proteinData: displayedProteinData, pdbIds, fetchProteinData } = useProteinData();

    const fetchTreatmentData = useCallback(async () => {
        const url = `${config.apiEndpoint}treatment/treatment?treatment=${selectedTreatment}`;
        try {
          const response = await fetch(url);
          console.log('Response:', response);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log("treatmentdata", data);
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
        if (treatmentData && treatmentData.proteinScoresTable && treatmentData.proteinScoresTable.length > 0) {
            setDisplayedProtein(treatmentData.proteinScoresTable[0].proteinAccession);
        }
    }, [treatmentData]);

    useEffect(() => {
        if (displayedProtein) {
            fetchProteinData(displayedProtein);
        }
    }, [displayedProtein, fetchProteinData]);

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
    };

    const handleProteinClick = (proteinAccession) => {
        setDisplayedProtein(proteinAccession);
    };

    return (
            <div>
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
                    {loading ? (  <p>Loading...</p>) : error ? (<p>Error: {error}</p>
                    ) : (
                        treatmentData &&
                        treatmentData.treatment && (
                            <div>
                                <span className="treatment-header">Treatment {treatmentData.treatment}</span><br />
                            </div>
                        )
                    )}
                      <div className="treatment-container">
                      
                      <div className="treatment-protein-experiment-wrapper">
                      <div className="treatment-table-container">
                            {treatmentData && treatmentData.proteinScoresTable && (
                                <ExperimentTable 
                                    experimentData={treatmentData.proteinScoresTable} 
                                    onProteinClick={handleProteinClick} 
                                />
                            )}
                        </div>

                     
                        <div className="treatment-protein-container">
                            {displayedProteinData && pdbIds && (
                                <NightingaleComponent
                                    proteinData={displayedProteinData} 
                                    pdbIds={pdbIds}
                                />
                            )}
                        </div>
  
                    </div>
                    <div className="treatment-goenrichment-container">
                        <div ref={chartRef} id="chart" style={{ width: '900px', height: '600px' }}></div>
                    </div>
                    {treatmentData && treatmentData.goEnrichmentList && treatmentData.goEnrichmentList.length > 0 && (
                        <div className="treatment-goenrichment-container">
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
                </div>
             </div>
        </div>
        );
    };

export default Treatment;