import React, { useState, useEffect } from 'react';
import { getTableNames } from '../utils/api'; 

function Tables() {
    const [tableNames, setTableNames] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          // Assuming getTableNames is an async function that fetches data from an API
          const data = await getTableNames();
          setTableNames(data); // Update the state with the fetched data
        } catch (error) {
          console.error('Error fetching table names:', error);
        }
      };
  
      fetchData();
    }, []); // Empty dependency array to run the effect only once on mount
  
    return (
      <div>
        <h1>Tables Page</h1>
        <ul>
          {tableNames.map((tableName) => (
            <li key={tableName}>{tableName}</li>
          ))}
        </ul>
      </div>
    );
}

export default Tables;