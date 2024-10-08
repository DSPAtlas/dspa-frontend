import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config.json';

import "@dspa-nightingale/nightingale-structure/nightingale-structure";



const DoseResponse = () => {
    //const { groupID } = useParams(); 
    const groupID = "GRP000001";
    const proteinName = "P00966";

    const [loading, setLoading] = useState(true);
    const [groupData, setGroupData] = useState(null);  // State for holding group data
    const [lipScoreArray, setLipScoreArray] = useState([]); // State for lip score array
    const [selectedDose, setSelectedDose] = useState(null); // State for the selected dose
    const [error, setError] = useState('');

    const fetchGroupData = useCallback(async () => {
        const url = `${config.apiEndpoint}group?groupID=${groupID}`;
        
        try {
          const response = await fetch(url);
          console.log('Response:', response);
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();

          // needs to get a list of differentialAbundanceData
          console.log(data.groupData.differentialAbundanceData);
          
          setGroupData(data.GroupData);
       
        } catch (error) {
          console.error("Error fetching data: ", error);
          setError(`Failed to load group-experiment data: ${error}`);
        }finally {
            setLoading(false);
        } 
      }, [groupID]);
    

    useEffect(() => {
        fetchGroupData();
    }, [fetchGroupData]);

    const handleDoseClick = (dose, index) => {
        const selectedExperiment = groupData.differentialAbundanceDataList[index];
        setLipScoreArray(selectedExperiment.data); // Update lip score array based on dose
        setSelectedDose(dose); // Update selected dose
    };

    // extract dose information create ordered button based on this 
    // if button gets clicked lipScoreArray gets updated based on dose and correlating lipscore

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
                                            backgroundColor: selectedDose === dose ? '#ccc' : '#fff',
                                            cursor: 'pointer',
                                            margin: '5px',
                                            padding: '10px'
                                        }}
                                    >
                                        {dose}
                                    </button>
                                ))}
                            </div>
                            
                            {/* Nightingale Structure Component */}
                            <nightingale-structure 
                                protein-accession={proteinName} 
                                //structure-id={groupData.experimentIDsList[0]}  // Assuming first experiment ID
                                margin-color="transparent"
                                background-color="white"
                                lipscore-array={lipScoreArray}
                                highlight-color="red"
                                style={{ height: '500px', width: '1250px' }}
                            ></nightingale-structure>
                        </>
                    )
                )}
                <div className="results-experiment-search-container">
                    <div id="chart"></div>
                </div>
            </div>
        </div>     
    );
};
export default DoseResponse;
