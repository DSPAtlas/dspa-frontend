
import React, { useState, useEffect, useCallback, useRef, useMemo} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../config.json';
import GOEnrichmentVisualization  from '../visualization/GOEnrichmentVisualization.js';
import NightingaleComponent from './NightingaleComponent.jsx';
import { getPdbIds } from '../hooks/useProteinData.js'; 
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



const Condition = () => {
    const { selectedcondition: conditionParam } = useParams();
   
    const chartRefGO = useRef(null);
    const chartRefVolcano = useRef(null);
    const isMounted = useRef(true);
    const containerRef = useRef(null); 

    const [allGoTerms, setAllGoTerms] = useState([]); 
    const [allProteinData, setAllProteinData] = useState([]); 

    const navigate = useNavigate();
   
    const [loading, setLoading] = useState(false);
    const [conditionData, setconditionData] = useState([]);
    const [goEnrichmentData, setGoEnrichmentData] = useState([]);
    const [experimentIDs, setExperimentIDs] = useState([]);
    const [error, setError] = useState('');
    const [displayedProtein, setDisplayedProtein] = useState("");
    const [pdbIds, setPdbIds] = useState([]);
    const [selectedPdbId, setSelectedPdbId] = useState("");
    
    const [selectedExperiment, setSelectedExperiment] = useState("");
    const [conditions, setconditions] = useState([]);
    const [selectedcondition, setSelectedcondition] = useState(conditionParam || conditions[0]);
   
    const [filteredExperimentData, setFilteredExperimentData] = useState([]); 
    const [selectedGoTerm, setSelectedGoTerm] = useState(null);
    const [displayedProteinData, setdisplayedProteinData] = useState(null);

    const fetchconditions = async (signal) => {
        try {
            const response = await fetch(`${config.apiEndpoint}condition/condition`, signal);
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
    
    function processData(data) {
        if (!data.conditionData) {
            throw new Error("conditionData is missing from the response");
        }
    
        const goEnrichmentData = data.conditionData.goEnrichmentList.flatMap(experiment =>
            experiment.data.map(d => ({
                ...d,
                experimentID: experiment.experimentID,
                accessions: d.accessions ? d.accessions.split(";").map(a => a.trim()) : []
            }))
        ).filter(d => d.adj_pval < 0.9);
    
        const experimentIDs = Array.from(new Set(goEnrichmentData.map(d => d.experimentID)));
        const termMap = new Map();
    
        if (data.conditionData.goEnrichmentList?.length > 0) {
            for (const item of data.conditionData.goEnrichmentList) {
                for (const term of item.data) {
                    const accessions = term.accessions ? term.accessions.split(';').map(accession => accession.trim()) : [];
                    if (!termMap.has(term.term)) {
                        termMap.set(term.term, {
                            term: term.term,
                            adj_pval: term.adj_pval,
                            dpx_comparison: term.dpx_comparison,
                            accessions
                        });
                    }
                }
            }
        }
    
        return {
            goEnrichmentData,
            experimentIDs,
            allGoTerms: [...termMap.values()],
            proteinData: data.conditionData.proteinScoresTable,
            initialProtein: data.conditionData.proteinScoresTable?.[0]?.proteinAccession
        };
    }
    
    useEffect(() => {
        const abortController = new AbortController();
      
        const fetchconditionData = async (signal) =>{
            setLoading(true);
            const url = `${config.apiEndpoint}condition/condition?condition=${selectedcondition}`;
            try {
                const rawData = await fetchData(url, signal);
                if (!abortController.signal.aborted) {
                    const {
                        goEnrichmentData,
                        experimentIDs,
                        allGoTerms,
                        proteinData,
                        initialProtein
                    } = processData(rawData);
                    
                    setconditionData(rawData.conditionData);
                    setGoEnrichmentData(goEnrichmentData);
                    setExperimentIDs(experimentIDs);
                    setAllProteinData(proteinData);
                    setFilteredExperimentData(proteinData);
                    setAllGoTerms(allGoTerms);
                    setDisplayedProtein(initialProtein);  
                    
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
    }, [selectedcondition])


    const handleGoTermSelect = (selectedTerm) => {
        setSelectedGoTerm(selectedTerm);
        if (selectedTerm === "" && isMounted.xurrent) {
            setFilteredExperimentData(allProteinData); 
        } else {
            const termDetails = allGoTerms.find(term => term.term === selectedTerm);
            if (termDetails && termDetails.accessions && isMounted.current) {
                const filteredData = allProteinData.filter(proteinData =>
                    termDetails.accessions.includes(proteinData.proteinAccession)
                );
                setFilteredExperimentData(filteredData);
            } else {
                setFilteredExperimentData([]); 
            }
        }
    };
    
    const handleconditionChange = (event) => {
        const newcondition = event.target.value;
        setSelectedcondition(newcondition);
        navigate(`/condition/${newcondition}`);
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
        const contentStyle = (tabName) => ({
            display: activeTab === tabName ? 'block' : 'none'
        });
    
        return (
            <div className="condition-section-wrapper">
                <div 
                    style={contentStyle(TABS.VOLCANO_PLOT)} 
                    ref={chartRefVolcano} 
                    key={`volcano-plot-${selectedcondition}`} 
                    className="condition-section goenrichment-chart-content"
                >
                    {conditionData?.differentialAbundanceDataList && (
                        <VolcanoPlot
                            differentialAbundanceDataList={conditionData?.differentialAbundanceDataList}
                            chartRef={chartRefVolcano}
                            highlightedProtein={displayedProtein}
                        />
                    )}
                </div>
                <div 
                    style={contentStyle(TABS.GENE_ONTOLOGY)} 
                    ref={chartRefGO} 
                    key={`go-plot-${selectedcondition}`} 
                    className="condition-section goenrichment-chart-content"
                >
                    {goEnrichmentData && chartRefGO.current && (
                        <GOEnrichmentVisualization
                            goEnrichmentData={goEnrichmentData}
                            chartRef={chartRefGO}
                        />
                    )}
                </div>
            </div>
        );
    };
    
    
   
    return (
        <div>
            <div className="condition-section condition-dropdown">
                <label htmlFor="conditionSelect">Select condition: </label>
                <select 
                    id="conditionSelect" 
                    value={selectedcondition} 
                    onChange={handleconditionChange}
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
                conditionData && conditionData.condition && (
                    <div>
                        <h1>condition {conditionData.condition}</h1><br />
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

            {/* Experiment List Section */}
            <div className="condition-section condition-experiment-container">
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
export default Condition;