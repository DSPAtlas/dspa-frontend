import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import Tables from './components/Tables';

// This file contains the main component of your React application, which is the App component in your case.
// It defines the structure and behavior of your application, including the state, rendering logic, and any other related components.


const App = () => {
  return (
    <Router>
      <div>
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
          <Route path="/search">
            <Search />
          </Route>
          <Route path="/tables">
            <Tables />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;

// function App() {
//   const [activeTab, setActiveTab] = useState('home');

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//     if (tab === 'search') {
//       // Trigger the search functionality here
//       // For example, you can call a function in the Search component
//       // Make sure to import the necessary functions from the Search component
//       // Search.handleSearch(); // Call the handleSearch function directly if it's static
//     }
//   };

//   return (
//     <div>
//       <div>
//         <button onClick={() => handleTabClick('home')}>Home</button>
//         <button onClick={() => handleTabClick('search')}>Search</button>
//         <button onClick={() => handleTabClick('tables')}>Tables</button>
//       </div>

//       {activeTab === 'home' && <Home />}
//       {activeTab === 'search' && <Search />}
//       {activeTab === 'tables' && <Tables />}
//     </div>
//   );
// }

// export default App;