
import React, { useState, useEffect, useCallback, useRef, useMemo} from 'react';
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


const ExperimentTable = ({ experimentData, onProteinClick, displayedProtein }) => {
    
    if (!experimentData || !Array.isArray(experimentData)) {
        console.error("experimentData is not an array:", experimentData);
        return <div>No valid data to display</div>;  
    }

    return (
        <div>
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th style={experimentTableStyles}>Protein Accession</th>
                        <th style={experimentTableStyles}>Average LiP Score among Experiments</th>
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
                            <td style={{ ...experimentTableStyles }}>
                                {Math.round(proteinData.averageScore || 0)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const Treatment = () => {
    const { selectedTreatment: treatmentParam } = useParams();
   
    const chartRef = useRef(null);

    const navigate = useNavigate();
    const [selectedTreatment, setSelectedTreatment] = useState(treatmentParam || treatments[0]);
    const [loading, setLoading] = useState(false);
    const [treatmentData, setTreatmentData] = useState([]);
    const [error, setError] = useState('');
    const [displayedProtein, setDisplayedProtein] = useState("");
    const [selectedPdbId, setSelectedPdbId] = useState("");
    const [selectedExperiment, setSelectedExperiment] = useState("");
    const [lipIDs, setLipIDs] = useState([]);
    const [treatments, setTreatments] = useState([]);
   
    const [filteredExperimentData, setFilteredExperimentData] = useState([]); 
    const [selectedGoTerm, setSelectedGoTerm] = useState(null);

    const [filteredProteinData, setFilteredProteinData] = useState(null);

    const { loading: proteinLoading, error: proteinError, proteinData: displayedProteinData, pdbIds, fetchProteinData } = useProteinData();

    const fetchTreatments = async () => {
        try {
            const response = await fetch(`${config.apiEndpoint}treatment/condition`); 
            const data = await response.json();
            console.log("treatment", data);

            if (data.success && Array.isArray(data.conditions)) {
                setTreatments(data.conditions); 
            } else {
                throw new Error(data.message || "Failed to fetch treatments");
            }
        } catch (error) {
            console.error("Error fetching treatments:", error);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchTreatments();
    }, []); 

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

            // Automatically set the first GO term
            const firstEnrichmentEntry = data.treatmentData.goEnrichmentList?.[0];
            const firstGoTerm = firstEnrichmentEntry?.data?.[0];

            if (firstGoTerm) {
                console.log("first goterm", firstGoTerm);
                setSelectedGoTerm(firstGoTerm.term);

                const accessions = firstGoTerm?.accessions?.split(';')?.map(a => a.trim()) || [];
                const filteredData = data.treatmentData.proteinScoresTable.filter((proteinData) =>
                    accessions.includes(proteinData.proteinAccession.trim())
                );
                setFilteredExperimentData(filteredData);
            }

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
            console.log("Fetching protein data for:", displayedProtein);
            fetchProteinData(displayedProtein);
        }
    }, [displayedProtein, fetchProteinData]);

    useEffect(() => {
        if (pdbIds && pdbIds.length > 0) {
            setSelectedPdbId(pdbIds[0].id);
        }
    }, [pdbIds]);

    useEffect(() => {
        if (displayedProteinData) {
            console.log("lipids", lipIDs);
            setFilteredProteinData({
                ...displayedProteinData,
                experimentIDsList: lipIDs
            });
        }
    }, [displayedProteinData, lipIDs]);

    const extractedExperimentIDs = useMemo(() => {
        if (!filteredExperimentData || filteredExperimentData.length === 0) return [];
        return [
            ...new Set(
                filteredExperimentData.flatMap((proteinData) =>
                    proteinData.experiments ? Object.keys(proteinData.experiments) : []
                )
            ),
        ];
    }, [filteredExperimentData]);

    const handleGoTermClick = (term, accessions) => {
        setSelectedGoTerm(term);
        if (accessions && accessions.length > 0 && treatmentData?.proteinScoresTable) {
            const filteredData = treatmentData.proteinScoresTable.filter(proteinData =>
                accessions.includes(proteinData.proteinAccession)
            );
            console.log("Filtered Experiment Data after GO Term click:", filteredData);
            setFilteredExperimentData(filteredData);
        } else {
            console.warn("No accessions to filter experiment data");
            setFilteredExperimentData([]);
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

    const handleExperimentClick = (experimentID) => {
        setSelectedExperiment(experimentID); 
        navigate(`/experiment/${experimentID}`);
    };

   
    return (
        <div>
            <div className="treatment-section treatment-dropdown">
                <label htmlFor="treatmentSelect">Select Treatment: </label>
                <select 
                    id="treatmentSelect" 
                    value={selectedTreatment} 
                    onChange={handleTreatmentChange}
                >
                    {treatments.map((treatment) => (
                        <option key={treatment} value={treatment}>{treatment}</option>
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
    
            <div className="treatment-section-wrapper">
            {/* Gene Ontology Chart Section */}
            <div className="treatment-section goenrichment-chart-wrapper">
                <h2>Gene Ontology Enrichment Analysis</h2>
                <div ref={chartRef} className="goenrichment-chart-content"></div>
                {treatmentData?.goEnrichmentList && (
                    <GOEnrichmentVisualization
                        goEnrichmentData={treatmentData.goEnrichmentList}
                        onGoTermClick={handleGoTermClick}
                        chartRef={chartRef}
                        selectedGoTerm={selectedGoTerm}
                    />
                )}
            </div>

            {/* Protein Experiment Section */}
            <div className="treatment-section treatment-protein-experiment-wrapper">
                <div className="treatment-table-container">
                    <h2>Proteins in {selectedGoTerm}</h2>
                    <ExperimentTable
                        experimentData={filteredExperimentData}
                        onProteinClick={handleProteinClick}
                        displayedProtein={displayedProtein}
                    />
                </div>
                <div className="treatment-protein-container">
                    <h2>{displayedProtein}</h2>
                    {filteredProteinData && pdbIds && (
                        <NightingaleComponent
                            proteinData={filteredProteinData}
                            pdbIds={pdbIds}
                            selectedPdbId={selectedPdbId}
                            setSelectedPdbId={setSelectedPdbId}
                            selectedExperiment={selectedExperiment}
                            showHeatmap={false}
                            passedExperimentIDs={extractedExperimentIDs}
                        />
                    )}
                </div>
            </div>

            {/* Experiment List Section */}
            <div className="treatment-section treatment-experiment-container">
                <h2>Experiments</h2>
                <div className="experiment-boxes">
                    {extractedExperimentIDs.map((experimentID, index) => (
                        <div
                            key={index}
                            className="experiment-box"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleExperimentClick(experimentID)} 
                        >
                            <h2>{experimentID}</h2>
                            <p>Placeholder text for experiment {experimentID}.</p>
                        </div>
                    ))}
                </div>
   
                </div>
                </div>
        </div>
    );
};
export default Treatment;