import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

import Home from './components/Home';
import Search from './components/Search';

const App = () => {
  return (
      <div>
        <header>
          <div class="logo">Dynamic Structural Proteome Atlas</div>
        </header>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/tables">Tables</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" exact element={Home()} />
          <Route path="/search" element={Search()} />
          <Route path="/tables" element={Search()} />
        </Routes>
        </div>
  );
};

export default App;


