import { BrowserRouter as  Router, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import ProteinSearch from './components/Search';
import ProteinVisualization from './components/Result';
import ExperimentInfo from './components/ExperimentInfo';
import ExperimentsOverview from './components/ExperimentsOverview';
import DoseResponse from './components/DoseResponse';
import About from './components/About';
import Contact from './components/Contact';
import Treatment from './components/Treatment';

import "./styles/main.css"
import "./styles/navigationbar.css"
import "./styles/home.css"
import "./styles/result.css"
import "./styles/search.css"
import "./styles/experiments.css"
import "./styles/graphs.css"
import "./styles/treatment.css"

const NotFound = () => <div>Page not found.</div>;

const App = () => {
  return (
    <div>
  <header className="app-header">
    <div className="navbar-top">
      <div className="navigation-bar navigation-white navigation-card">
        <a href="/" className="navigation-bar-item navigation-button navigation-wide">Dynamic Structural Proteome Atlas</a>
        <div className="navigation-right navigation-hide-small">
          <a href="/" className="navigation-bar-item navigation-button">HOME</a>
          <a href="/search" className="navigation-bar-item navigation-button"> SEARCH</a>
          <a href="/experiments" className="navigation-bar-item navigation-button"> EXPERIMENT</a>
          <a href="/about" className="navigation-bar-item navigation-button"> ABOUT</a>
          <a href="/contact" className="navigation-bar-item navigation-button"> CONTACT</a>
        </div>
      </div>  
    </div>    
  </header>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/search" element={<ProteinSearch />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/visualize/:taxonomyID/:proteinName" element={<ProteinVisualization />} />
    <Route path="/experiment/:experimentID" element={<ExperimentInfo />} />
    <Route path="/experiments" element={<ExperimentsOverview />} />
    <Route path="/doseresponse" element={<DoseResponse />} />
    <Route path="/treatment" element={<Treatment />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</div>
  );
};

export default App;


{/* 
  
  const App = () => {
  return (
    <div>
    <header className="app-header">
      <div className="navbar-top">
        <div className="navigation-bar navigation-white navigation-card">
          <a href="/" className="navigation-bar-item navigation-button navigation-wide">Dynamic Structural Proteome Atlas</a>
          <div className="navigation-right navigation-hide-small">
            <a href="/" className="navigation-bar-item navigation-button">HOME</a>
            <a href="/search" className="navigation-bar-item navigation-button"> SEARCH</a>
            <a href="/experiments" className="navigation-bar-item navigation-button"> EXPERIMENT</a>
            <a href="/about" className="navigation-bar-item navigation-button"> ABOUT</a>
            <a href="/contact" className="navigation-bar-item navigation-button"> CONTACT</a>
          </div>
        </div>  
      </div>    
    </header>
    <Routes>
      <Route path="/about" element={<About />} />
    </Routes>
  </div>
  );
};

export default App;

  
  return (
  <div>
  <header className="app-header">
    <div className="navbar-top">
      <div className="navigation-bar navigation-white navigation-card">
        <a href="/" className="navigation-bar-item navigation-button navigation-wide">Dynamic Structural Proteome Atlas</a>
        <div className="navigation-right navigation-hide-small">
          <a href="/" className="navigation-bar-item navigation-button">HOME</a>
          <a href="/search" className="navigation-bar-item navigation-button"> SEARCH</a>
          <a href="/experiments" className="navigation-bar-item navigation-button"> EXPERIMENT</a>
          <a href="/about" className="navigation-bar-item navigation-button"> ABOUT</a>
          <a href="/contact" className="navigation-bar-item navigation-button"> CONTACT</a>
        </div>
      </div>  
    </div>    
  </header>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/search" element={<ProteinSearch />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/visualize/:taxonomyID/:proteinName" element={<ProteinVisualization />} />
    <Route path="/experiment/:experimentID" element={<ExperimentInfo />} />
    <Route path="/experiments" element={<ExperimentsOverview />} />
    <Route path="/doseresponse" element={<DoseResponse />} />
    <Route path="/treatment" element={<Treatment />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</div>
);*/}