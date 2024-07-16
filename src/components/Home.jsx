import React from 'react';
import { useEffect, useState } from "react";
import "@nightingale-elements/nightingale-sequence";
import config from '../config.json';

function Home () {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    document.body.classList.add('landing-page');

    // Remove the class when the component unmounts
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
      <main className="dspa-background-grey">
      <div className="dspa-display-left dspa-text-white dspa-background-grey">
          <span className="dspa-jumbo dspa-hide-small">Dynamic Structural Proteome Atlas</span><br />
          <span className="dspa-xxlarge dspa-hide-large dspa-hide-medium">Dynamic Structural Proteome Atlas</span><br />
          <span class="dspa-large">Explore our comprehensive database.</span>
        </div>
      </main>
    </>
  );
}

export default Home;
