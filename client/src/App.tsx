import React from 'react';
import logo from './logo.svg';
import './App.css';
import Book from "./components/Book/book";
import Navbar from "./components/Navbar/navbar";

function App() {
  return (
    <div className="App">
      <Navbar parentCallback={() => {}} />
      <Book /> 
    </div>
  );
}

export default App;
