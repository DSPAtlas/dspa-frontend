import React, { useEffect, useState } from "react";
import "@nightingale-elements/nightingale-sequence";
import config from "../config.json";
import { useLocation } from "react-router-dom";
import ProteinSearchResults from './ProteinSearchResults.jsx';

function Home() {
  const [data, setData] = useState(null);
  const location = useLocation();
  const [selectedOrganism, setSelectedOrganism] = useState("559292");
  const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');
  const [error, setError] = useState("");
  const { searchResults: initialSearchResults } = location.state || {};
  const [searchResults, setSearchResults] = useState(initialSearchResults || null);

  const handleOrganismChange = (event) => {
    setSelectedOrganism(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const queryParams = `searchTerm=${encodeURIComponent(searchTerm)}`;
      const url = `${config.apiEndpoint}search?${queryParams}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data);
  
      } else {
        throw new Error(data.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProteinNameChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const performSearch = async (searchTerm) => {
    try {
      const queryParams = `searchTerm=${encodeURIComponent(searchTerm)}`;
      const url = `${config.apiEndpoint}search?${queryParams}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.results);
        console.log('Search results:', data.results); 
      } else {
        throw new Error(data.message || "Failed to fetch data");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    performSearch(searchTerm);
  };

  // Combined useEffect to handle both class and data fetching
  useEffect(() => {
    // Fetch home data
    //fetch(`${config.apiEndpoint}home`)
     // .then((response) => response.json())
      //.then((data) => {
        //setData(data);
     //   console.log("Home data:", data); // Check if the home data is fetched properly
   //   })
     // .catch((error) => console.error("Error fetching home data:", error));
  
    // Perform search if searchTerm is present in the location state
    if (location.state?.searchTerm) {
      performSearch(location.state.searchTerm);
    }
  }, [location.state?.searchTerm]);// Re-run if the searchTerm in the location state changes

  return (
    <>
      <main className="dspa-background-beige home-container">
        <div className="logo-container">
          <img src="/images/dspalogo.webp" alt="DSPAtlas Logo" className="logo" />
        </div>
        <div className="dspa-text-blue">
          <span className="dspa-jumbo dspa-hide-small">Dynamic Structural Proteome Atlas</span>
          <br />
          <span className="dspa-xxlarge dspa-hide-large dspa-hide-medium">Dynamic Structural Proteome Atlas</span>
          <br />
          <span className="dspa-large">Explore our comprehensive database.</span>
        </div>

        <div>
            <form className="search-form" onSubmit={handleSubmit}>
              <div className="form-group">
              </div>
              <div className="form-group">
                <label className="form-label">Protein Name</label>
                <input 
                  type="text" 
                  className="search-form" 
                  value={searchTerm} 
                  onChange={handleProteinNameChange} 
                />
              </div>
              <button type="submit" className="search-button">Search</button>
            </form>
              {error && <p>Error: {error}</p>}
            <div>
            {searchResults && searchResults.table && Array.isArray(searchResults.table) && searchResults.table.length > 0 ? (
              <div className="results-search-container">
                <ProteinSearchResults searchResults={searchResults} />
              </div>
            ) : (
              <p>No search results to display.</p>
            )}
          </div>
          </div>



        <div className="dspa-publications">
          <h2>LiP Atlas Publications</h2>
          <div className="publication-block dspa-padding dspa-background-rose">
            <h3>
              Measuring protein structural changes on a proteome-wide scale using
              limited proteolysis-coupled mass spectrometry.
            </h3>
            <p>
              Schopper S, Kahraman A, Leuenberger P, Feng Y, Piazza I, Müller O,
              Boersema PJ, Picotti P. Nat Protoc. 2017 Nov;12(11):2391-2410. doi:
              10.1038/nprot.2017.100. Epub 2017 Oct 26. PMID: 29072706.
            </p>
            <a
              href="https://www.nature.com/articles/nprot.2017.100"
              target="_blank"
              rel="noopener noreferrer"
              className="dspa-link"
            >
              View Publication on Nature.com
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
