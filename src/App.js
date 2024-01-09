import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

import Home from './components/Home';
import Search from './components/Search';
import Tables from './components/Tables';

// This file contains the main component of your React application, which is the App component in your case.
// It defines the structure and behavior of your application, including the state, rendering logic, and any other related components.


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
          <Route path="/tables" element={Tables()} />
        </Routes>
        </div>
  );
};

export default App;


