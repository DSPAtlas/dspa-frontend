import React, { useState, useEffect, useCallback, useRef } from 'react';
import config from '../config.json';

import "@dspa-nightingale/nightingale-structure/nightingale-structure";
import "@nightingale-elements/nightingale-manager";

const DoseResponse = () => {
    const groupID = "GRP000001";
    const proteinName = "P00966";

    const [loading, setLoading] = useState(true);
    const [groupData, setGroupData] = useState(null);
    const [error, setError] = useState('');

    const [structures, setStructures] = useState([
        { id: 1, lipScoreString: "[-1, -1]", isVisible: false },
        { id: 2, lipScoreString: "[100, 100,100, 100, 100, 100, 100, 100, 100, -1]", isVisible: false },
        { id: 3, lipScoreString: "[-1, -1]", isVisible: false }
    ]);

    const structureRefs = useRef([React.createRef(), React.createRef(), React.createRef()]);

    const fetchGroupData = useCallback(async () => {
        const url = `${config.apiEndpoint}group?groupID=${groupID}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setGroupData(data.groupData);
        } catch (error) {
            setError(`Failed to load group-experiment data: ${error}`);
        } finally {
            setLoading(false);
        }
    }, [groupID]);

    useEffect(() => {
        fetchGroupData();
    }, [fetchGroupData]);

    const getLipScoreDataByExperimentID = (experimentID) => {
        if (!groupData || !groupData.lipscoreList) return null;
        const lipScoreEntry = groupData.lipscoreList.find(entry => entry.experimentID === experimentID);
        return lipScoreEntry ? lipScoreEntry.data : null;
    };

    const handleDoseClick = (dose, index) => {
        const experimentID = groupData.experimentIDsList[index];
        const lipScoreArray = getLipScoreDataByExperimentID(experimentID); // Get the lip score data based on experiment ID
        
        if (lipScoreArray) {
            const lipScoreString = JSON.stringify(lipScoreArray);

            setStructures(prevStructures =>
                prevStructures.map((structure, idx) => 
                    idx === index 
                        ? { ...structure, lipScoreString, isVisible: true }
                        : { ...structure, isVisible: false } // Hide other structures
                )
            );
        } else {
            console.error(`No data found for experiment ID: ${experimentID}`);
        }
    };

    useEffect(() => {
        structures.forEach((structure, idx) => {
            if (structureRefs.current[idx].current && structure.isVisible) {
                const structureRef = structureRefs.current[idx].current;
                structureRef.proteinAccession = proteinName;
                structureRef.structureId = "AF-P00966-F1";  // Adjust as needed
                structureRef.marginColor = "transparent";
                structureRef.backgroundColor = "white";
                structureRef.lipscoreArray = structure.lipScoreString; // Pass the string format directly
                structureRef.highlightColor = "red";
            }
        });
    }, [structures, proteinName]);

    return (
        <div>
            <div className="result-container">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    groupData && (
                        <>
                            {/* Render buttons for each dose */}
                            <div className="dose-buttons">
                                {groupData.doses.map((dose, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleDoseClick(dose, index)}
                                        style={{
                                            backgroundColor: structures[index].isVisible ? '#ccc' : '#fff',
                                            cursor: 'pointer',
                                            margin: '5px',
                                            padding: '10px'
                                        }}
                                    >
                                        {dose}
                                    </button>
                                ))}
                            </div>

                            {/* Dynamically render structure elements */}
                            {structures.map((structure, idx) =>
                                structure.isVisible ? (
                                    <nightingale-manager key={structure.id}>
                                        <nightingale-structure
                                            ref={structureRefs.current[idx]}
                                            protein-accession={proteinName}
                                            structure-id="AF-P00966-F1"
                                            margin-color="transparent"
                                            background-color="white"
                                            lipscore-array={structure.lipScoreString}
                                            highlight-color="red"
                                            style={{ height: '500px', width: '1250px' }}
                                        ></nightingale-structure>
                                    </nightingale-manager>
                                ) : null
                            )}
                        </>
                    )
                )}
            </div>
        </div>
    );
};

export default DoseResponse;
