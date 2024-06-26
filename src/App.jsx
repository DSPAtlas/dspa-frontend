import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

import Home from './components/Home';
import ProteinSearch from './components/Search';
import ProteinVisualization from './components/Result';

const NotFound = () => <div>Page not found.</div>;

const App = () => {
  return (
      <div>
        <header className="app-header">
          <div class="logo">Dynamic Structural Proteome Atlas</div>
        </header>
        <nav className='main-nav'>
          <ul className='nav-links'>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" exact element={<Home/>} />
          <Route path="/search" element={<ProteinSearch/>} />
          <Route path="/visualize/:organismId/:proteinName" element={<ProteinVisualization />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
  );
};

export default App;


