import React from 'react';
import { useEffect, useState } from "react";
import "@nightingale-elements/nightingale-sequence";
import config from '../config.json';

function Home () {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    document.body.classList.add('landing-page');
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  useEffect(() => {
    fetch(`${config.apiEndpoint}home`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [config.apiEndpoint]);

  return (
    <>
    <main className="dspa-background-beige home-container">
    <div className="logo-container">
        <img src="/images/dspalogo.webp" alt="DSPAtlas Logo" className="logo" />
      </div>
      <div className="dspa-text-blue">
        <span className="dspa-jumbo dspa-hide-small">Dynamic Structural Proteome Atlas</span><br />
        <span className="dspa-xxlarge dspa-hide-large dspa-hide-medium">Dynamic Structural Proteome Atlas</span><br />
        <span className="dspa-large">Explore our comprehensive database.</span>
      </div>
 
      <div className="dspa-publications">
        <h2>LiP Atlas Publications</h2>
        <div className="publication-block dspa-padding dspa-background-rose">
          <h3>Measuring protein structural changes on a proteome-wide scale using limited proteolysis-coupled mass spectrometry.</h3>
          <p>Schopper S, Kahraman A, Leuenberger P, Feng Y, Piazza I, Müller O, Boersema PJ, Picotti P. Nat Protoc. 2017 Nov;12(11):2391-2410. doi: 10.1038/nprot.2017.100. Epub 2017 Oct 26. PMID: 29072706.</p>
          <a 
            href="https://www.nature.com/articles/nprot.2017.100" 
            target="_blank" 
            rel="noopener noreferrer"
            className="dspa-link"
          >
            View Publication on Nature.com
          </a>
          <h3>Measuring protein structural changes on a proteome-wide scale using limited proteolysis-coupled mass spectrometry.</h3>
          <p>Schopper S, Kahraman A, Leuenberger P, Feng Y, Piazza I, Müller O, Boersema PJ, Picotti P. Nat Protoc. 2017 Nov;12(11):2391-2410. doi: 10.1038/nprot.2017.100. Epub 2017 Oct 26. PMID: 29072706.</p>
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
