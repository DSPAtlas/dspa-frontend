
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../config.json';
import { GOEnrichmentVisualization } from '../visualization/goterm.js';
import NightingaleComponent from './NightingaleComponent.jsx';
import { useProteinData } from '../hooks/useProteinData.js'; 
import "@nightingale-elements/nightingale-sequence";


const experimentTableStyles = {
    border: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#f9f9f9",
};


const ExperimentTable = ({ experimentData, onProteinClick, onExperimentClick, displayedProtein }) => {
    if (!experimentData || !Array.isArray(experimentData)) {
        console.error("experimentData is not an array:", experimentData);
        return <div>No valid data to display</div>;  
    }

    const experimentIDs = [...new Set(
        experimentData.flatMap(protein => Object.keys(protein.experiments))
    )];

    return (
        <div>
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th style={experimentTableStyles}>Protein Accession</th>
                        {experimentIDs.map(experimentID => (
                            <th key={experimentID} style={experimentTableStyles}>{experimentID}</th>
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
                            <td onClick={() => onProteinClick(proteinData.proteinAccession)}>
                                {proteinData.proteinAccession}
                            </td>
                            {/* {experimentIDs.map(experimentID => (
                                <td 
                                    key={experimentID}
                                    onClick={() => onExperimentClick(proteinData.proteinAccession, experimentID)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {proteinData.experiments[experimentID] !== undefined
                                        ? Math.round(proteinData.experiments[experimentID]) 
                                        : 0}
                                </td>
                            ))} */}
                            <td style={{ ...experimentTableStyles, cursor: "pointer" }}>{Math.round(proteinData.averageScore || 0)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const Treatment = () => {
    const { selectedTreatment: treatmentParam } = useParams();
    const treatmentOptions = ["Phe", "Mal", "Citrulin", "Pyr", "heatshock", "dose_response"];
    const chartRef = useRef(null);

    const navigate = useNavigate();
    const [selectedTreatment, setSelectedTreatment] = useState(treatmentParam || treatmentOptions[0]);
    const [loading, setLoading] = useState(false);
    const [treatmentData, setTreatmentData] = useState([]);
    const [error, setError] = useState('');
    const [displayedProtein, setDisplayedProtein] = useState("");
    const [selectedPdbId, setSelectedPdbId] = useState("");
    const [selectedExperiment, setSelectedExperiment] = useState("");
    const [lipIDs, setLipIDs] = useState([]);
   
    const [filteredExperimentData, setFilteredExperimentData] = useState([]); 
    const [selectedGoTerm, setSelectedGoTerm] = useState(null);

    const [filteredProteinData, setFilteredProteinData] = useState(null);

    const { loading: proteinLoading, error: proteinError, proteinData: displayedProteinData, pdbIds, fetchProteinData } = useProteinData();

    const fetchTreatmentData = useCallback(async () => {
        setLoading(true);
        const url = `${config.apiEndpoint}treatment/treatment?treatment=${selectedTreatment}`;
        try {
            const response = await fetch(url);
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setTreatmentData(data.treatmentData);
    
            const extractedLipIDs = data.treatmentData.goEnrichmentList
                .flatMap(entry => entry.data.map(item => item.experimentID))
                .filter((id, index, self) => id && self.indexOf(id) === index);
    
            setLipIDs(extractedLipIDs);
        } catch (error) {
            console.error("Error fetching data: ", error);
            setError(`Failed to load experiment data: ${error.message}`);
        } finally {
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
        if (treatmentData?.goEnrichmentList && treatmentData.goEnrichmentList.length > 0) {
            const firstEnrichmentEntry = treatmentData.goEnrichmentList[0];
            const firstGoTerm = firstEnrichmentEntry.data && firstEnrichmentEntry.data[0];
            console.log("firstgoterm", firstGoTerm);
            console.log("goenruchment", treatmentData.goEnrichmentList);
            
            setSelectedGoTerm(firstGoTerm.goName);
            const studyItems = firstGoTerm.study_items.split(', ');
            const filteredData = treatmentData.proteinScoresTable.filter(
                (proteinData) => studyItems.includes(proteinData.proteinAccession)
            );
            setFilteredExperimentData(filteredData);
        }
    }, [treatmentData]);

    useEffect(() => {
        if (displayedProteinData) {
            console.log("lipids", lipIDs);
            setFilteredProteinData({
                ...displayedProteinData,
                experimentIDsList: lipIDs
            });
        }
    }, [displayedProteinData, lipIDs]);

    const handleGoTermClick = (goName, studyItems) => {
        setSelectedGoTerm(goName);
        if (treatmentData && treatmentData.proteinScoresTable) {
            // Filter the experiment data to show only proteins in the selected GO term

            const filteredData = treatmentData.proteinScoresTable.filter(
                (proteinData) => studyItems.includes(proteinData.proteinAccession)
            );
            setFilteredExperimentData(filteredData);
        }
    };

    const handleTreatmentChange = (event) => {
        const newTreatment = event.target.value;
        setSelectedTreatment(newTreatment);
        navigate("/treatment/${newTreatment}");
    };

    const handleProteinClick = (proteinAccession) => {
        setDisplayedProtein(proteinAccession);
        setSelectedExperiment(""); 
    };

    const handleExperimentClick = (proteinAccession, experimentID) => {
        setDisplayedProtein(proteinAccession); 
        setSelectedExperiment(experimentID); 
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
            
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                treatmentData && treatmentData.treatment && (
                    <div>
                        <h1>Treatment {treatmentData.treatment}</h1><br />
                    </div>
                )
            )}
    
            {/* First Row: Gene Ontology Enrichment Analysis */}
            <div className="treatment-row">
            <div className="treatment-header">
                    <h2>Gene Ontology Enrichment Analysis</h2>
                </div>
                <div className="goenrichment-chart-wrapper">
                    <div ref={chartRef} className="goenrichment-chart-container"></div>
                    {treatmentData?.goEnrichmentList && (
                        <GOEnrichmentVisualization 
                            goEnrichmentData={treatmentData.goEnrichmentList} 
                            onGoTermClick={handleGoTermClick} 
                            chartRef={chartRef} 
                            selectedGoTerm={selectedGoTerm}
                        />
                    )}
                </div>
            </div>
    
            {/* Second Row: LiP Scores among Experiments */}
            <div className="treatment-row">
            <h2>GO Term: {selectedGoTerm}</h2>
                <div className="treatment-protein-experiment-wrapper">
                    <div className="treatment-table-container">
                        <h2>LiP Scores among Experiments</h2><br />
                        {treatmentData?.proteinScoresTable && (
                            <ExperimentTable 
                                experimentData={filteredExperimentData} 
                                onProteinClick={handleProteinClick} 
                                onExperimentClick={handleExperimentClick} 
                                displayedProtein={displayedProtein}
                            />
                        )}
                    </div>
    
                    <div className="treatment-protein-container">
                        <h2>{displayedProtein}</h2><br />
                        {filteredProteinData && pdbIds && ( 
                            <NightingaleComponent
                                proteinData={filteredProteinData} 
                                pdbIds={pdbIds}
                                selectedPdbId={selectedPdbId}
                                setSelectedPdbId={setSelectedPdbId} 
                                selectedExperiment={selectedExperiment}
                                showHeatmap={false}
                            />
                        )}
                    </div>
                </div>

             {/* Third Row */}
             <div className="treatment-row">
                <div className="treatment-container">
                    <h2>Experiments</h2>
                </div>
            </div>

            
            </div>
        </div>
    );
};
export default Treatment;