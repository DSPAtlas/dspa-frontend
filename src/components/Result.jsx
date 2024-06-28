import React, { useState, useEffect } from 'react';
import config from '../config.json';
import NightingaleComponent from './NightingaleComponent';
import FunctionalComponent from './FunctionalComponent';

const ProteinVisualization = () => {
  const [selectedOrganism, setSelectedOrganism] = useState('559292'); // Default to Saccharomyces cerevisiae S288C
  const [proteinName, setProteinName] = useState('');
  const [proteinData, setProteinData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const taxonomy = "Saccharomyces cerevisiae S288C";
  const proteinfunction = "NADP-dependent, medium-chain alcohol dehydrogenase with a broad substrate specificity (PubMed:11742541). Aldehydes exhibited 50-12000 times higher catalytic efficiency than the corresponding alcohols, therefore the major function of the enzyme is as an aldehyde reductase (PubMed:11742541). The enzyme is active towards aromatic and aliphatic (linear and branched-chain) aldehydes (PubMed:11742541). The enzyme is very active towards aromatic aldehydes, such as cinnamaldehyde, benzaldehyde and substituted benzaldehydes, such as veratraldehyde and panisaldehyde (PubMed:11742541). It exhibits low activity towards substituted cinnamaldehydes, such as coniferaldehyde and sinapaldehyde (PubMed:11742541). The enzyme has no activity with ketones, such as acetone or cyclohexanone (PubMed:11742541). For the reverse reaction, linear and branched-chain primary alcohols are substrates, whereas very low activity is found with secondary alcohols, such as butan-2-ol (PubMed:11742541). The enzyme may be physiologically involved in several steps of the lignin degradation pathway, initiated by other microorganisms, in the synthesis of fusel alcohols, products derived from the aminoacidic metabolism, and in the homeostasis of NADP(H) (PubMed:12604208). Has the ability to reduce 5-hydroxymethyl furfural (HMF), a furan derivative which is formed during the hydrolysis of lignocellulosic materials, to 5-hydroxymethylfurfuryl alcohol, thereby alleviating the inhibition of the fermentation of lignocellulose hydrolysates by HMF during fuel ethanol production (PubMed:16652391). Also acts as an inhibitor of protein S-nitrosylation by mediating degradation of S-nitroso-coenzyme A (S-nitroso-CoA), a cofactor required to S-nitrosylate proteins (PubMed:25512491).";

  const handleOrganismChange = (event) => {
    setSelectedOrganism(event.target.value);
  };

  const handleProteinNameChange = (event) => {
    setProteinName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchProteinData();
  };

  const fetchProteinData = async () => {
    setLoading(true);
    setError('');
    const queryParams = `taxonomyID=${encodeURIComponent(selectedOrganism)}&proteinName=${encodeURIComponent(proteinName)}`;
    const url = `${config.apiEndpoint}/v1/proteins?${queryParams}`;
    console.log(url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json(); // This line throws if the response is not JSON.
        setProteinData(data.proteinData);
        
    } catch (error) {
        console.error("Error fetching data: ", error);
        setError('Failed to load protein data');
        setProteinData({});
    } finally {
        setLoading(false);
    }

    
};
    

return (
    <>
    <div className="results-search-container">
        <form onSubmit={handleSubmit}>
            <select name="taxonomyID" value={selectedOrganism} onChange={handleOrganismChange}>
                <option value="10090">Mus musculus</option>
                <option value="559292">Saccharomyces cerevisiae S288C</option>
                <option value="9606">Homo Sapiens</option>
            </select>
            <input
                type="text"
                name="proteinName"
                value={proteinName}
                onChange={handleProteinNameChange}
                required
                placeholder="Enter protein name..."
            />
            <button type="submit">Search</button>
        </form>
    </div>
    <div className="nightingale-component-container">
        {loading ? <p>Loading...</p> : error ? <p>Error: {error}</p> : (
            proteinData && proteinData.proteinName && (
                <div>
                   <span className="protein-header"> </span><br />
                    <span className="protein-header">UniProt ID {proteinData.proteinName} </span><br />
                    <span className="result-text">Taxonomy: {taxonomy || 'N/A'}</span><br />
                    <span className="result-text">Function: {proteinfunction || 'N/A'}</span><br />
                    <NightingaleComponent proteinData={proteinData} />
                    <span className="protein-header"> </span><br />
                    <h2>Functional LiP Results</h2>
                    <FunctionalComponent proteinData={proteinData} />
                </div>
            )
        )}
    </div>
</>
);
};


export default ProteinVisualization;