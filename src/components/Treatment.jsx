import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config.json';
import { GOEnrichmentVisualization } from '../visualization/goterm.js';
import NightingaleComponent from './NightingaleComponent';
import { useProteinData } from '../hooks/useProteinData'; 

const ExperimentTable = ({ experimentData, onProteinClick, onExperimentClick, displayedProtein }) => {
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
                            style={{
                                cursor: 'pointer',
                                backgroundColor: displayedProtein === proteinData.proteinAccession ? '#f0f0f0' : 'white'
                            }}
                        >
                            {/* Clicking on the Protein Accession */}
                            <td 
                                onClick={() => onProteinClick(proteinData.proteinAccession)}
                            >
                                {proteinData.proteinAccession}
                            </td>

                            {/* Experiment Columns */}
                            {experimentIDs.map(experimentID => (
                                <td 
                                    key={experimentID}
                                    onClick={() => onExperimentClick(proteinData.proteinAccession, experimentID)} // Pass both proteinAccession and experimentID
                                    style={{ cursor: 'pointer' }}
                                >
                                    {proteinData.experiments[experimentID] !== undefined
                                        ? Math.round(proteinData.experiments[experimentID]) 
                                        : 0}
                                </td>
                            ))}

                            <td>{Math.round(proteinData.averageScore || 0)}</td>
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
    const [selectedPdbId, setSelectedPdbId] = useState("");
    const [selectedExperiment, setSelectedExperiment] = useState("");

    const { loading: proteinLoading, error: proteinError, proteinData: displayedProteinData, pdbIds, fetchProteinData } = useProteinData();

    const fetchTreatmentData = useCallback(async () => {
        setLoading(true);
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
        if (treatmentData?.proteinScoresTable?.length > 0) {
            setDisplayedProtein(treatmentData.proteinScoresTable[0].proteinAccession);
        }
    }, [treatmentData]);

    useEffect(() => {
        if (displayedProtein) {
            fetchProteinData(displayedProtein);
        }
    }, [displayedProtein, fetchProteinData]);

    useEffect(() => {
        if (pdbIds && pdbIds.length > 0) {
            setSelectedPdbId(pdbIds[0].id);
        }
    }, [pdbIds]);

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
        setSelectedExperiment(""); // Reset the selected experiment when a protein is clicked
    };

    const handleExperimentClick = (proteinAccession, experimentID) => {
        setDisplayedProtein(proteinAccession); // Update the displayed protein
        setSelectedExperiment(experimentID); // Set the selected experiment when an experiment column is clicked
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
                        treatmentData && treatmentData.treatment && (
                            <div>
                                <h1>Treatment {treatmentData.treatment}</h1><br />
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat.
                                </p>
                            </div>
                        )
                    )}
                      <div className="treatment-container">
                      <div className="treatment-protein-experiment-wrapper">
                      <div className="treatment-table-container">
                         <h2>LiP Scores among Experiments</h2><br />
                            {treatmentData?.proteinScoresTable && (
                                <ExperimentTable 
                                    experimentData={treatmentData.proteinScoresTable} 
                                    onProteinClick={handleProteinClick} 
                                    onExperimentClick={handleExperimentClick} 
                                    displayedProtein={displayedProtein}
                                />
                            )}
                        </div>

                        <div className="treatment-protein-container">
                        <h2>{displayedProtein}</h2><br />
                            {displayedProteinData && pdbIds && ( 
                                <NightingaleComponent
                                    proteinData={displayedProteinData} 
                                    pdbIds={pdbIds}
                                    selectedPdbId={selectedPdbId}
                                    selectedExperiment={selectedExperiment}
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