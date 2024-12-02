import React, { useState, useEffect, useCallback } from 'react';
import config from '../config.json';
import { useParams, useNavigate } from 'react-router-dom'; 
import NightingaleComponent from './NightingaleComponent';
import { SumLipScoreVisualization } from '../visualization/sumlipscore';

async function getPdbIds(uniprotAccession) {
    const url = `https://rest.uniprot.org/uniprotkb/${uniprotAccession}.json`;

    const alphafoldstructure = [
        { id: `AF-${uniprotAccession}-F1`, properties: [
            { key: 'Method', value: 'AlphaFold' }, 
            { key: 'Resolution', value: ' ' }, 
            { key: 'Chains', value: ' ' }] },
       ];
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to retrieve data for accession ${uniprotAccession}`);
        }
        
        const data = await response.json();
        const pdbIds = data.uniProtKBCrossReferences
            .filter(ref => ref.database === 'PDB')
            .map(ref=> ({
                id: ref.id,
                properties: ref.properties
            }));
        
        return [...alphafoldstructure, ...pdbIds];
    } catch (error) {
        console.error(error);
        return alphafoldstructure;
    }
}


function sumScores(differentialAbundanceData) {
    const result = {};

    for (const experiment in differentialAbundanceData) {
        let sum = 0;
        
        for (const key in differentialAbundanceData[experiment]) {
            const data = differentialAbundanceData[experiment][key];
            
            if (data.score !== null) {
                sum += data.score;
            }
        }
        result[experiment] = sum;
    }

    return result;
}


function ProteinVisualizationComponents({ proteinData, pdbIds, loading, error }) {
    const proteinfunction = proteinData.proteinDescription;
    const scoresSum = sumScores(proteinData.differentialAbundanceData);
    const [selectedPdbId, setSelectedPdbId] = useState("");
    const [selectedExperiment, setSelectedExperiment] = useState("");


    useEffect(() => {
        if (pdbIds && pdbIds.length > 0) {
            setSelectedPdbId(pdbIds[0].id);
        }
    }, [pdbIds]);

    useEffect(() => {
        console.log("experimentmetadata", proteinData.experimentMetaData);
        if (scoresSum) {
            const chartElement = document.getElementById("sumlipscorebarplot");
            if (chartElement) {
                SumLipScoreVisualization({ 
                    data: scoresSum,
                    experimentMetaData: proteinData.experimentMetaData
                });
            } else {
                console.error("Chart element not properly loaded or has zero dimensions");
            }
        }
    }, [scoresSum, proteinData.experimentMetaData]);
    
    return (
        <div>
            {loading ? <p>Loading...</p> : error ? <p>Error: {error}</p> : (
                proteinData && proteinData.proteinName && (
                    <div>
                    <span className="protein-header"> </span><br />
                        <span className="protein-header">UniProt ID {proteinData.proteinName} </span><br />
                        <NightingaleComponent 
                             proteinData={proteinData} 
                             pdbIds={pdbIds}
                             selectedPdbId={selectedPdbId}
                             setSelectedPdbId={setSelectedPdbId} 
                             selectedExperiment={selectedExperiment}/>
                        <span className="protein-header"> </span><br />
                        <h2>Summed LiP Score in Experiments for {proteinData.proteinName}</h2>
                        <div className="results-experiment-search-container">
                            <div id="sumlipscorebarplot"></div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}


const ProteinVisualization = () => {
    const { proteinName } = useParams(); 
    
    const [proteinData, setProteinData] = useState({});
    const [pdbIds, setPdbIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const fetchProteinData = useCallback(async () => {
        setLoading(true);
        setError('');
        
        const queryParams = `proteinName=${encodeURIComponent(proteinName)}`;
        const url = `${config.apiEndpoint}proteins?${queryParams}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json(); 
            setProteinData(data.proteinData);
            console.log("proteindata", data.proteinData);

            const pdbIds = await getPdbIds(proteinName);
            setPdbIds(pdbIds);
           
        } catch (error) {
            console.error("Error fetching data: ", error);
            setError('Failed to load protein data');
            setProteinData({});

        } finally {
            setLoading(false);
        } 
    },  [proteinName]);

    useEffect(() => {
        fetchProteinData();
    }, [fetchProteinData]);

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        
        try {
            navigate('/search', { state: { searchTerm: searchTerm } });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <div className="results-container">
                {proteinData && <ProteinVisualizationComponents proteinData={proteinData} pdbIds={pdbIds} loading={loading} error={error}/>}
            </div>
        </>
    );
};

export default ProteinVisualization;