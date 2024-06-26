import React from 'react';
import { useEffect, useRef } from "react";
import "@nightingale-elements/nightingale-sequence";

function Home() {
  return (
    <>
      <header className="app-header">
        <div className="logo">Dynamic Structural Proteome Atlas</div>
        <nav className="topnav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/search">Search</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <h1>Welcome to Our Atlas</h1>
        <p>Explore our comprehensive database.</p>
      </main>
    </>
  );
}

export default Home;
