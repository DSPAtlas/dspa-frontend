import { BrowserRouter as  Router, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import ProteinSearch from './components/Search';
import ProteinVisualization from './components/Result';
import ExperimentInfo from './components/Experiments'

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
            <a href="/experiment" className="navigation-bar-item navigation-button"> EXPERIMENT</a>
            <a href="/search" className="navigation-bar-item navigation-button"> ABOUT</a>
            <a href="/search" className="navigation-bar-item navigation-button"> CONTACT</a>
          </div>
        </div>  
      </div>    
    </header>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<ProteinSearch />} />
      <Route path="/visualize/:taxonomyID/:proteinName" element={<ProteinVisualization />} />
      <Route path="/experiment/:experimentID" element={<ExperimentInfo />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
  );
};

export default App;


