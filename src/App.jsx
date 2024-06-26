import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

import Home from './components/Home';
import ProteinSearch from './components/Search';
import ProteinVisualization from './components/Result';

const NotFound = () => <div>Page not found.</div>;

const App = () => {
  return (
    <div>
    <header className="app-header">
      <div className="logo">Dynamic Structural Proteome Atlas</div>
    </header>
    <nav className='topnav'>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/search">Search</Link>
        </li>
      </ul>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<ProteinSearch />} />
      <Route path="/visualize/:organismId/:proteinName" element={<ProteinVisualization />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
  );
};

export default App;


