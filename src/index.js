import React , { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Home from './components/Home';
import ProteinSearch from './components/Search';
import ProteinVisualization from './components/ProteinView';
import ExperimentInfo from './components/ExperimentView';
import ExperimentsOverview from './components/ExperimentsOverview';
import Impressum from './components/Impressum';
import Treatment from './components/TreatmentView';
import Pathway from './components/Pathway';

// Styles Import
import "./styles/main.css";
import "./styles/navigationbar.css";
import "./styles/home.css";
import "./styles/result.css";
import "./styles/search.css";
import "./styles/graphs.css";
import "./styles/treatment.css";
import "./styles/proteinview.css";
import "./styles/experimentView.css";
import "./styles/nightingale.css";

const root = createRoot(document.getElementById("root"));

const NotFound = () => <div>Page not found.</div>;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogin = (username, password) => {
    if (username === process.env.USERNAME_WEBSITE && password === process.env.PASSWORD_WEBSITE){
      setIsAuthenticated(true); 
    } else{
      setIsAuthenticated(false);
      alert('Authentication failed, please check your username and password');
    }
  };

  if (!isAuthenticated) {
    return <div >
      <LoginForm onLogin={handleLogin} />
    </div>;
  }

  return (
    <div>
      <header className="app-header">
        <div className="navbar-top">
          <div className="navigation-bar navigation-white navigation-card">
            <a href="/" className="navigation-bar-item navigation-button navigation-wide">DYNAPROT</a>
            <div className="navigation-right navigation-hide-small">
              <a href="/" className="navigation-bar-item navigation-button">HOME</a>
              <a href="/search" className="navigation-bar-item navigation-button"> SEARCH</a>
              <a href="/experiments" className="navigation-bar-item navigation-button"> EXPERIMENT</a>
              <a href="/impressum" className="navigation-bar-item navigation-button"> IMPRESSUM</a>
            </div>
          </div>  
        </div>    
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<ProteinSearch />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/visualize/:proteinName" element={<ProteinVisualization />} />
        <Route path="/experiment/:experimentID" element={<ExperimentInfo />} />
        <Route path="/experiments" element={<ExperimentsOverview />} />
        <Route path="/treatment/:selectedTreatment" element={<Treatment />} />
        <Route path="/pathway" element={<Pathway />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};


root.render(
  <Router>
    <App /> 
  </Router>
);
