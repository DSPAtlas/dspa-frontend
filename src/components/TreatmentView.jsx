
import React, { useState, useEffect, useCallback, useRef, useMemo} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../config.json';
import { GOEnrichmentVisualization } from '../visualization/goterm.js';
import NightingaleComponent from './NightingaleComponent.jsx';
import { useProteinData } from '../hooks/useProteinData.js'; 
import "@nightingale-elements/nightingale-sequence";
import VolcanoPlot from '../visualization/volcanoplot.js';


const experimentTableStyles = {
    border: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#f9f9f9",
};


const ProteinScoresTable = ({ experimentData, onProteinClick, displayedProtein, goTerms, onGoTermSelect }) => {
    const sortedExperimentData = useMemo(() => {
        return [...experimentData].sort((a, b) => b.averageScore - a.averageScore);
    }, [experimentData]);

    if (!sortedExperimentData || !Array.isArray(sortedExperimentData)) {
        console.error("experimentData is not an array or is undefined:", experimentData);
        return <div>No valid data to display</div>;
    }

    return (
        <div className="experiment-table-container">
            <div className="go-term-selector">
                <label htmlFor="goTermSelect">Filter by GO Term: </label>
                <select 
                    id="goTermSelect" 
                    onChange={(e) => onGoTermSelect(e.target.value)}
                    defaultValue=""
                    className="go-term-dropdown"
                >
                    <option value="">All</option>
                    {goTerms && goTerms.map((term, index) => (
                        <option key={index} value={term.term}>{term.term}</option>
                    ))}
                </select>
            </div>
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th style={experimentTableStyles}>Protein Accession</th>
                        <th style={experimentTableStyles}>Average LiP Score among Experiments</th>
                        <th style={experimentTableStyles}>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedExperimentData.map((proteinData) => (
                        <tr 
                            key={proteinData.proteinAccession}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: displayedProtein === proteinData.proteinAccession ? '#f0f0f0' : 'white'
                            }}
                            onClick={() => onProteinClick(proteinData.proteinAccession)}
                        >
                            <td>{proteinData.proteinAccession}</td>
                            <td>{Math.round(proteinData.averageScore || 0)}</td>
                            <td>{proteinData.protein_description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};



const Treatment = () => {
    const { selectedTreatment: treatmentParam } = useParams();
   
    const chartRefGO = useRef(null);
    const chartRefVolcano = useRef(null);

    const [allGoTerms, setAllGoTerms] = useState([]); 
    const [allProteinData, setAllProteinData] = useState([]); 

    const navigate = useNavigate();
   
    const [loading, setLoading] = useState(false);
    const [treatmentData, setTreatmentData] = useState([]);
    const [goEnrichmentData, setGoEnrichmentData] = useState([]);
    const [experimentIDs, setExperimentIDs] = useState([]);
    const [error, setError] = useState('');
    const [displayedProtein, setDisplayedProtein] = useState("");
    const [selectedPdbId, setSelectedPdbId] = useState("");
    const [selectedExperiment, setSelectedExperiment] = useState("");
    const [treatments, setTreatments] = useState([]);
    const [selectedTreatment, setSelectedTreatment] = useState(treatmentParam || treatments[0]);
   
    const [filteredExperimentData, setFilteredExperimentData] = useState([]); 
    const [selectedGoTerm, setSelectedGoTerm] = useState(null);

    const {proteinData: displayedProteinData, pdbIds, fetchProteinData } = useProteinData();

    useEffect(() => {
        let isActive = true;
        const fetchTreatments = async () => {
            try {
                const response = await fetch(`${config.apiEndpoint}treatment/condition`); 
                const data = await response.json();
    
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
        fetchTreatments();
        return () => {
            isActive = false;  
        };
    }, []); 


    const fetchTreatmentData = useCallback(async () => {
        setLoading(true);
        const url = `${config.apiEndpoint}treatment/treatment?treatment=${selectedTreatment}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
    
            if (!data.treatmentData) throw new Error("treatmentData is missing from the response");
    
            setTreatmentData(data.treatmentData);
            const goEnrichemntData = data.treatmentData.goEnrichmentList.flatMap(experiment =>
                experiment.data.map(d => ({
                    ...d,
                    experimentID: experiment.experimentID,
                    accessions: d.accessions ? d.accessions.split(";").map(a => a.trim()) : []
                }))
            ).filter(d => d.adj_pval < 0.9);
            const experimentIDs = Array.from(new Set(goEnrichemntData.map(d => d.experimentID)));
            setGoEnrichmentData(goEnrichemntData);
            setExperimentIDs(experimentIDs);
            setAllProteinData(data.treatmentData.proteinScoresTable);
    
            if (data.treatmentData.proteinScoresTable?.length > 0) {
                const initialProtein = data.treatmentData.proteinScoresTable[0].proteinAccession;
                setDisplayedProtein(initialProtein);
                fetchProteinData(initialProtein); 
            }
    
            if (data.treatmentData.goEnrichmentList && data.treatmentData.goEnrichmentList.length > 0) {
                const extractedTerms = data.treatmentData.goEnrichmentList.flatMap(item =>
                    item.data.map(term => ({
                        term: term.term,
                        adj_pval: term.adj_pval,
                        lipexperiment_id: term.lipexperiment_id,
                        accessions: term.accessions.split(';').map(accession => accession.trim())
                    }))
                );
                
                const uniqueTerms = Array.from(new Set(extractedTerms.map(term => term.term)))
                    .map(uniqueTerm => extractedTerms.find(term => term.term === uniqueTerm));
                
                setAllGoTerms(uniqueTerms);
            } else {
                setAllGoTerms([]);
            }
    
            setFilteredExperimentData(data.treatmentData.proteinScoresTable);
        } catch (error) {
            setError(`Failed to load experiment data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [selectedTreatment, fetchProteinData]);  
    
    useEffect(() => {
        fetchTreatmentData();
    }, [fetchTreatmentData]);  

    useEffect(() => {
        if (pdbIds?.length > 0) setSelectedPdbId(pdbIds[0].id);
    }, [pdbIds]);
    

    useEffect(() => {
        fetchTreatmentData();
    }, [fetchTreatmentData]); 
    

    useEffect(() => {
        if (pdbIds && pdbIds.length > 0) {
            setSelectedPdbId(pdbIds[0].id);
        }
    }, [pdbIds]);


    const handleGoTermClick = (term, accessions) => {
        setSelectedGoTerm(term);
        if (accessions && accessions.length > 0 && treatmentData?.proteinScoresTable) {
            const filteredData = treatmentData.proteinScoresTable.filter(proteinData =>
                accessions.includes(proteinData.proteinAccession)
            );
            setFilteredExperimentData(filteredData);
        } else {
            console.warn("No accessions to filter experiment data");
            setFilteredExperimentData([]);
        }
    };

    const handleGoTermSelect = (selectedTerm) => {
        
        setSelectedGoTerm(selectedTerm);
        if (selectedTerm === "") {
            setFilteredExperimentData(allProteinData); 
        } else {
            
            const termDetails = allGoTerms.find(term => term.term === selectedTerm);
            if (termDetails && termDetails.accessions) {
                const filteredData = allProteinData.filter(proteinData =>
                    termDetails.accessions.includes(proteinData.proteinAccession)
                );
                setFilteredExperimentData(filteredData);
            } else {
                setFilteredExperimentData([]); 
            }
        }
    };
    
    const handleTreatmentChange = (event) => {
        const newTreatment = event.target.value;
        setSelectedTreatment(newTreatment);
        navigate(`/treatment/${newTreatment}`);
    };

    const handleProteinClick = (proteinAccession) => {
        setDisplayedProtein(proteinAccession);
        setSelectedExperiment(""); 
    };

    const handleExperimentClick = (experimentID) => {
        setSelectedExperiment(experimentID); 
        navigate(`/experiment/${experimentID}`);
    };

    const TABS = {
        VOLCANO_PLOT: 'Volcano Plot',
        GENE_ONTOLOGY: 'Gene Ontology Enrichment Analysis'
    };

    const [activeTab, setActiveTab] = useState(TABS.VOLCANO_PLOT);
    const renderTabNav = () => (
        <div className="tab-navigation">
            <button
                className={`header-or-tab tab-button ${activeTab === TABS.VOLCANO_PLOT ? 'active' : ''}`}
                onClick={() => setActiveTab(TABS.VOLCANO_PLOT)}
            >
                Volcano Plot
            </button>
            <button
                className={`header-or-tab tab-button ${activeTab === TABS.GENE_ONTOLOGY ? 'active' : ''}`}
                onClick={() => setActiveTab(TABS.GENE_ONTOLOGY)}
            >
                Gene Ontology Enrichment Analysis
            </button>
        </div>
    );
    
    const renderTabContent = () => {
        switch (activeTab) {
            case TABS.VOLCANO_PLOT:
                return (
                    <div ref={chartRefVolcano} className="treatment-section goenrichment-chart-content">
                        {treatmentData?.differentialAbundanceDataList && (
                            <VolcanoPlot
                                differentialAbundanceDataList={treatmentData?.differentialAbundanceDataList}
                                chartRef={chartRefVolcano}
                                highlightedProtein={displayedProtein}
                            />
                        )}
                    </div>
                );
            case TABS.GENE_ONTOLOGY:
                return (
                    <div ref={chartRefGO} className="treatment-section goenrichment-chart-content">
                        {goEnrichmentData && chartRefGO.current &&(
                            <GOEnrichmentVisualization
                                goEnrichmentData={goEnrichmentData}
                                onGoTermClick={handleGoTermClick}
                                chartRef={chartRefGO}
                            />
                        )}
                    </div>
                );
            default:
                return <p>Invalid tab</p>;
        }
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

            {renderTabNav()}
    
            <div className="treatment-section-wrapper">
                {renderTabContent()}
            
            {/* Protein Experiment Section */}
            <div className="treatment-section treatment-protein-experiment-wrapper">
                <div className="treatment-table-container">
                    <h2>Proteins in {selectedGoTerm}</h2>
                    <ProteinScoresTable
                        experimentData={filteredExperimentData}
                        onProteinClick={handleProteinClick}
                        displayedProtein={displayedProtein}
                        goTerms={allGoTerms}
                        onGoTermSelect={handleGoTermSelect}
                    />
                </div>
                <div className="treatment-protein-container">
                    <h2>{displayedProtein}</h2>
                    {displayedProteinData && pdbIds && experimentIDs &&(
                        <NightingaleComponent
                            proteinData={displayedProteinData}
                            pdbIds={pdbIds}
                            selectedPdbId={selectedPdbId}
                            setSelectedPdbId={setSelectedPdbId}
                            selectedExperiment={selectedExperiment}
                            showHeatmap={false}
                            passedExperimentIDs={experimentIDs}
                        />
                    )}
                </div>
            </div>

            {/* Experiment List Section */}
            <div className="treatment-section treatment-experiment-container">
                <h2>Experiments</h2>
                <div className="experiment-boxes">
                    {experimentIDs.map((experimentID, index) => (
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