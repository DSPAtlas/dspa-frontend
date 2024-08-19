import React from 'react';
import { useNavigate } from 'react-router-dom';


const ProteinSearchResults = ({searchResults}) => {
    const navigate = useNavigate();
  
    const handleLinkClick = (event, taxonomyID, proteinName) => {
      event.preventDefault();
      navigate(`/visualize/${taxonomyID}/${encodeURIComponent(proteinName)}`);
    };
  
    return (
      <div>
        <div className="results-search-container">
          {searchResults && searchResults.table && searchResults.table.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Protein Name</th>
                  <th>Taxonomy</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.table.map((entry, index) => (
                  <tr key={index}>
                    <td>
                      <button onClick={(e) => handleLinkClick(e, entry.taxonomyID, entry.proteinName)}>
                        {entry.proteinName}
                      </button>
                    </td>
                    <td>{entry.taxonomyName}</td>
                    <td>{entry.proteinDescription}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No search results to display.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default ProteinSearchResults;
  
  