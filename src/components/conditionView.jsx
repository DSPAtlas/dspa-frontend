
import React, { useState, useEffect, useCallback, useRef, useMemo} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../config.json';
import GOEnrichmentVisualization  from '../visualization/GOEnrichmentVisualization.js';
import NightingaleComponent from './NightingaleComponent.jsx';
import { getPdbIds } from '../hooks/useProteinData.js'; 
import "@nightingale-elements/nightingale-sequence";
import VolcanoPlot from '../visualization/volcanoplot.js';
import DoseResponseCurves from '../visualization/DoseResponse.js'



const ProteinScoresTable = ({ experimentData, onProteinClick, displayedProtein, goTerms, onGoTermSelect }) => {
    const sortedExperimentData = useMemo(() => {
        return [...experimentData].sort((a, b) => b.averageScore - a.averageScore);
    }, [experimentData]);

    if (!sortedExperimentData || !Array.isArray(sortedExperimentData)) {
        console.error("experimentData is not an array or is undefined:", experimentData);
        return <div>No valid data to display</div>;
    }

    return (
        <div className="condition-table-container">
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
                        <option key={index} value={term.go_term}>{term.go_term}</option>
                    ))}
                </select>
            </div>
            <table className="condition-protein-table">
                <thead>
                    <tr>
                        <th className= "condition-protein-table">Protein Accession</th>
                        <th className= "condition-protein-table">Average LiP Score among Experiments</th>
                        <th className= "condition-protein-table">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedExperimentData.map((proteinData) => (
                        <tr 
                        key={proteinData.proteinAccession}
                        className={`protein-row ${displayedProtein === proteinData.proteinAccession ? 'selected' : ''}`}
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



const Condition = () => {
    const { selectedCondition: conditionParam } = useParams();
    const [selectedCondition, setSelectedCondition] = useState(conditionParam || "");
   
    const chartRefGO = useRef(null);
    const chartRefVolcano = useRef(null);
    const isMounted = useRef(true);
    const containerRef = useRef(null); 

    const [allGoTerms, setAllGoTerms] = useState([]); 
    const [allProteinData, setAllProteinData] = useState([]); 

    const navigate = useNavigate();
   
    const [loading, setLoading] = useState(false);
    const [differentialAbundanceData, setDifferentialAbundanceData] = useState([]);
    const [goEnrichmentData, setGoEnrichmentData] = useState([]);
    const [experimentIDs, setExperimentIDs] = useState([]);
    const [error, setError] = useState('');
    const [displayedProtein, setDisplayedProtein] = useState("");
    const [pdbIds, setPdbIds] = useState([]);
    const [selectedPdbId, setSelectedPdbId] = useState("");
    const [doseResponseDataPlotCurve, setDoseResponseDataPlotCurve] = useState([]);
    const [doseResponseDataPlotPoints, setDoseResponseDataPlotPoints] = useState([]);
    
    const [selectedExperiment, setSelectedExperiment] = useState("");
    const [conditions, setconditions] = useState([]);
    
   
    const [filteredExperimentData, setFilteredExperimentData] = useState([]); 
    const [selectedGoTerm, setSelectedGoTerm] = useState(null);
    const [displayedProteinData, setdisplayedProteinData] = useState(null);

    const fetchconditions = async (signal) => {
        try {
            const response = await fetch(`${config.apiEndpoint}condition/allconditions`, signal);
            const data = await response.json();

            if (!isMounted.current) return;

            if (data.success && Array.isArray(data.conditions)) {
                setconditions(data.conditions);
            } else {
                throw new Error(data.message || "Failed to fetch conditions");
            }
        } catch (error) {
            console.error("Error fetching conditions:", error);
            if (isMounted.current) {
                setError(error.message);
            }
        }
    };

    useEffect(() => {
        const abortController = new AbortController();
        fetchconditions(abortController.signal);
        return () => {
            abortController.abort();
            isMounted.current = false;
        };
    }, []);

    async function fetchData(url, abortSignal) {
        const response = await fetch(url, { signal: abortSignal });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    }

   const fetchDoseResponseData = useCallback(async (dynaprotExperiment, proteinName, signal) => {
        if (!proteinName) return;
        setError('');
        try {
            const queryParams = `dynaprotExperiment=${encodeURIComponent(dynaprotExperiment)}&proteinName=${encodeURIComponent(proteinName)}`;
            const url = `${config.apiEndpoint}doseresponse?${queryParams}`;
            const response = await fetch(url, { signal });

            if (!response.ok) {
                throw new Error(`Failed to fetch protein data: ${response.statusText}`);
            }

            const data = await response.json(); 
            console.log("data", data);
            setDoseResponseDataPlotCurve(data.doseResponseDataPlotCurve);
            setDoseResponseDataPlotPoints(data.doseResponseDataPlotPoints);
            
        } catch (error) {
            if (isMounted.current) {
                setError(`Error fetching protein data: ${error.message}`);
                setdisplayedProteinData({});
            }
        }
    }, []);

    // 2. THEN use it here
    useEffect(() => {
        const abortController = new AbortController();
        const defaultDynaprotExperiment = "DPX000012";

        if (selectedCondition.toLowerCase() === "rapamycin") {
            fetchDoseResponseData(defaultDynaprotExperiment, displayedProtein, abortController.signal);
        }

        return () => abortController.abort();
    }, [selectedCondition, fetchDoseResponseData, displayedProtein]);

    const fetchProteinData = useCallback(async (proteinName, signal) => {
        if (!proteinName) return;
        setError('');
    
        try {
            const queryParams = `proteinName=${encodeURIComponent(proteinName)}`;
            const url = `${config.apiEndpoint}proteins?${queryParams}`;
            const response = await fetch(url, { signal });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch protein data: ${response.statusText}`);
            }
    
            const data = await response.json();
            const pdbResponse = await getPdbIds(proteinName);  
            setPdbIds(pdbResponse);
            setdisplayedProteinData(data.proteinData || {});  
            
        } catch (error) {
            if (isMounted.current) {
                setError(`Error fetching protein data: ${error.message}`);
                setdisplayedProteinData({});
            }
        }
    }, [setPdbIds, setSelectedPdbId, setdisplayedProteinData, setError]);  
    
    useEffect(() => {
        const abortController = new AbortController();
        fetchProteinData(displayedProtein, abortController.signal);
        return () => {
            abortController.abort();
            isMounted.current = false;
        };
    }, [displayedProtein, fetchProteinData]);

    useEffect(() => {
        if (pdbIds.length > 0) {
            setSelectedPdbId(pdbIds[0].id);
        }
    }, [pdbIds]);
    
    useEffect(() => {
        const abortController = new AbortController();
      
        const fetchconditionData = async (signal) =>{
            setLoading(true);
            const url = `${config.apiEndpoint}condition/data?condition=${selectedCondition}`;
            try {
                const rawData = await fetchData(url, signal);
                if (!abortController.signal.aborted) {
                    setSelectedCondition(rawData.conditionData.condition);
                    setDifferentialAbundanceData(rawData.conditionData.differentialAbundanceDataList);
                    setGoEnrichmentData(rawData.conditionData.goEnrichmentData);
                    console.log("goenruchemnt", rawData.conditionData.goEnrichmentData);
                    setExperimentIDs(rawData.conditionData.experimentIDsList);
                    setAllProteinData(rawData.conditionData.proteinScoresTable);
                    setFilteredExperimentData(rawData.conditionData.proteinScoresTable);
                    setAllGoTerms(rawData.conditionData.goTerms);
                    setDisplayedProtein(rawData.conditionData.proteinScoresTable?.[0]?.proteinAccession);   
                }
            } catch (error) {
                if (!signal.aborted && isMounted.current) {
                    console.log(error);
                    setError(error.toString());
                }
            } finally {
                setLoading(false);    
            }
        }
        fetchconditionData(abortController.signal);
    
        return () => {
            abortController.abort(); 
            isMounted.current = false;
        };
    }, [selectedCondition])


    const handleGoTermSelect = (selectedTerm) => {
        setSelectedGoTerm(selectedTerm);
    
        if (selectedTerm === "" && isMounted.current) {
            setFilteredExperimentData(allProteinData); 
        } else if (allGoTerms) {
         
            const termDetails = allGoTerms.find(term => term.go_term === selectedTerm);
            
            if (termDetails) {
                const accessionsArray = termDetails.accessions.map(accession => accession.trim());
    
                const filteredData = allProteinData.filter(proteinData =>
                    accessionsArray.includes(proteinData.proteinAccession?.trim())
                );
    
                setFilteredExperimentData(filteredData);
            } else {
                setFilteredExperimentData([]); 
            }
        } else {
            console.warn("allGoTerms is not available or not an array");
            setFilteredExperimentData([]); 
        }
    };
    
    const handleconditionChange = (event) => {
        const selectedCondition = event.target.value;
        if (selectedCondition) {
          setSelectedCondition(selectedCondition); 
          navigate(`/condition/${selectedCondition}`);
        }
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
        if (loading) {
            return <div>Loading...</div>; 
        }
    
        if (!differentialAbundanceData && !goEnrichmentData) {
            return <div>No data available</div>; 
        }
    
        const contentStyle = (tabName) => ({
            display: activeTab === tabName ? 'block' : 'none'
        });
    
        return (
            <div >
                {differentialAbundanceData && Object.keys(differentialAbundanceData).length > 0 && (
                     <div className="condition-section condition-volcano-plot-wrapper">
                    <div 
                        style={contentStyle(TABS.VOLCANO_PLOT)} 
                        key={`volcano-plot-${selectedCondition}`} 
                    >
                        <VolcanoPlot
                            differentialAbundanceDataList={differentialAbundanceData}
                            chartRef={chartRefVolcano}
                            highlightedProtein={displayedProtein}
                        />
                    </div>
                    </div>
                )}
                {goEnrichmentData && Object.keys(goEnrichmentData).length > 0  &&  (
                     <div className="condition-section condition-volcano-plot-wrapper">
                    <div 
                        style={contentStyle(TABS.GENE_ONTOLOGY)} 
                        key={`go-plot-${selectedCondition}`} 
                    >
                        <GOEnrichmentVisualization
                            goEnrichmentData={goEnrichmentData}
                            chartRef={chartRefGO}
                            onProteinSelect={(proteinAccession) => {
                                setDisplayedProtein(proteinAccession);
                            }}
                        />
                    </div>
                    </div>
                )}
            </div>
        );
    };
 


    return (
        <div>
            <div className="condition-section condition-dropdown">
                <label htmlFor="conditionSelect">Select condition: </label>
                <select 
                    id="conditionSelect" 
                    value={selectedCondition} 
                    onChange={handleconditionChange}
                    className="condition-dropdown"
                >
                    {conditions.map((condition) => (
                        <option key={condition} value={condition}>{condition}</option>
                    ))}
                </select>
            </div>
            
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                differentialAbundanceData && selectedCondition && (
                    <div>
                        <h1>Condition - {selectedCondition}</h1><br />
                    </div>
                )
            )}

            {renderTabNav()}
    
            <div className="condition-section-wrapper">
                {renderTabContent()}
            
            {/* Protein Experiment Section */}
            <div className="condition-section condition-protein-experiment-wrapper">
                <div className="condition-table-container">
                    <h2>Proteins in {selectedGoTerm}</h2>
                    <ProteinScoresTable
                        experimentData={filteredExperimentData}
                        onProteinClick={handleProteinClick}
                        displayedProtein={displayedProtein}
                        goTerms={allGoTerms}
                        onGoTermSelect={handleGoTermSelect}
                    />
                </div>
                <div 
                    ref={containerRef} 
                    className="condition-protein-container">
                    <h2>{displayedProtein}</h2>
                    {displayedProteinData && pdbIds && experimentIDs &&(
                        <NightingaleComponent
                            key={displayedProtein}
                            proteinData={displayedProteinData}
                            pdbIds={pdbIds}
                            selectedPdbId={selectedPdbId}
                            setSelectedPdbId={setSelectedPdbId}
                            selectedExperiment={selectedExperiment}
                            showHeatmap={false}
                            passedExperimentIDs={experimentIDs}
                            containerRef={containerRef}
                        />
                    )}
                </div>
            </div>

           {doseResponseDataPlotCurve && Object.keys(doseResponseDataPlotCurve).length > 0 && (
            <div className="condition-section condition-dose-response-wrapper">
                <div className="condition-dose-response-container">
                    <h2>Dose-Response-Data for Peptides in {displayedProtein}</h2>
                    <DoseResponseCurves
                        points={doseResponseDataPlotPoints}
                        curves={doseResponseDataPlotCurve}
                    />
                </div>
            </div>
        )}

                </div>
        </div>
    );
};
export default Condition;

