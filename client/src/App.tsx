import React from 'react';
import logo from './logo.svg';
import './App.css';
import Book from "./components/Book/book";
import Navbar from "./components/Navbar/navbar";
import Score from "./components/score/score";

function App() {
  return (
    <div className="App">
      <Navbar parentCallback={() => {}} />
      <div className="body-container">
        <div className="first-row">
          <Book /> 
          <Score />
        </div>
      </div>
    </div>
  );
}

export default App;
