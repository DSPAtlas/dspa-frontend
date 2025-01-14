import React, { useEffect, useState } from "react";
import "@nightingale-elements/nightingale-sequence";
import config from "../config.json";
import { useLocation, useNavigate } from "react-router-dom";
import ProteinSearchResults from './ProteinSearchResults.jsx';

function Home() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');
  const [error, setError] = useState("");
  const { searchResults: initialSearchResults } = location.state || {};
  const [searchResults, setSearchResults] = useState(initialSearchResults || null);
  const [treatments, setTreatments] = useState([]);

  const navigate = useNavigate();

  const handleTreatmentChange = (event) => {
    const selectedTreatment = event.target.value;
    if (selectedTreatment) {
      navigate(`/treatment/${selectedTreatment}`);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    navigate("/search", { state: { searchTerm } });
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


  const fetchTreatments = async () => {
        try {
            const response = await fetch(`${config.apiEndpoint}treatment/condition`); 
            const data = await response.json();
            console.log("treatment", data);

            if (data.success && Array.isArray(data.conditions)) {
                setTreatments(data.conditions); // Directly set treatments from API response
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
   

  // Combined useEffect to handle both class and data fetching
  useEffect(() => {
    if (location.state?.searchTerm) {
      performSearch(location.state.searchTerm);
    }
  }, [location.state?.searchTerm]);

  return (
    <>
      <main className="home-container">

        <div className="dspa-text-blue">

          <br />
          <span className="dspa-logo-text">DynaProt</span>
          <br />
          <span className="dspa-large">Explore dynamic changes in protein structure.</span>
        </div>

        <div className="three-boxes-container">
          {/* Left Box - Treatment Dropdown */}
          <div className="box">
            <label htmlFor="treatment-select">Select Condition</label>
            <p className="description">Choose a treatment condition to explore its impact on protein structures.</p>
            <select id="treatment-select" onChange={handleTreatmentChange}>
              <option value="">Select a Condition</option>
              {treatments.map((treatment, index) => (
                  <option key={index} value={treatment}>{treatment}</option>
              ))}
          </select>
          </div>

         {/* Middle Box - Protein Search */}
        <div className="box">
          <form onSubmit={handleSubmit}>
            <label htmlFor="protein-search">Protein Search</label>
            <p className="description">Search for proteins by name to view related structural dynamics data.</p>
            <input
              id="protein-search"
              type="text"
              value={searchTerm}
              onChange={handleProteinNameChange}
            />
            <button type="submit">Search</button>
          </form>
        </div>

        {/* Right Box - Experiment Link */}
        <div className="box">
          <label>Go to Experiments</label>
          <p className="description">Explore all experiments related to protein structural changes.</p>
          <button onClick={() => navigate("/experiments")}>View Experiments</button>
        </div>
      </div>

        <div className="dspa-publications">
          <h2>Publications related to LiP-MS</h2>
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
            <h3>
              Dynamic 3D proteomes reveal protein functional alterations at high resolution in situ
            </h3>
            <p>
              Cappelletti V, Hauser T, Piazza I, Pepelnjak M, Malinovska L, Fuhrer T, 
              Li Y, Dörig C, Boersema P, Gillet L, Grossbach J, Dugourd A, Saez-Rodriguez J, 
              Beyer A, Zamboni N, Caflisch A, de Souza N,  Cell. 2021 Jan 21;184(2):545-559.e22. 
              doi: 10.1016/j.cell.2020.12.021. Epub 2020 Dec 23. PMID: 33357446; PMCID: PMC7836100.
            </p>
            <a
              href="https://www.sciencedirect.com/science/article/pii/S0092867420316913?via%3Dihub"
              target="_blank"
              rel="noopener noreferrer"
              className="dspa-link"
            >
              View Publication on sciencedirect.com
            </a>
            <h3>
              A Map of Protein-Metabolite Interactions Reveals Principles of Chemical Communication
            </h3>
            <p>
              Piazza I, Kochanowski K, Cappelletti V, Fuhrer T, Noor E, Sauer U, Picotti P. 
              Cell. 2018 Jan 11;172(1-2):358-372.e23. doi: 10.1016/j.cell.2017.12.006. Epub 2018 Jan 4. PMID: 29307493.
            </p>
            <a
              href="https://www.sciencedirect.com/science/article/pii/S0092867417314484?via%3Dihub"
              target="_blank"
              rel="noopener noreferrer"
              className="dspa-link"
            >
              View Publication on sciencedirect.com
            </a>
          </div>
        </div>
      </main>

       {/* Impressum */}
       <footer style={{ textAlign: "center", marginTop: "20px", padding: "10px", backgroundColor: "#f8f8f8" }}>
        <p>© 2024 Eidgenössische Technische Hochschule Zürich</p>
      </footer>
    </>

  );
}

export default Home;
