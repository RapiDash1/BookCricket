import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Book from "./components/Book/book";
import Navbar from "./components/Navbar/navbar";
import Score from "./components/score/score";

class App extends React.Component {

  _totalScore: number = 0;

  constructor(props: any) {
    super(props);
    this.bookCallBack = this.bookCallBack.bind(this);
  }

  // Handkle book call back
  // Sccore is updated here everytime drag is ended
  bookCallBack(currentSheetScore: number) {
    this._totalScore += currentSheetScore;
    // Total time for book opoen position hold and close aniation is 1.9s + 1.5s = 3.4s
    // Timeout for 2.5s so that we give enough time for the book
    // to close partially, so that page number wont be visible when
    // we reset it
    setTimeout(()=>{
      this.forceUpdate();
    }, 2500);
  }


  // render
  render() {
    return(
        <div className="App">
          <Navbar parentCallback={() => {}} />
          <div className="body-container">
            <div className="first-row">
              <Book appCallBack={this.bookCallBack} /> 
              <Score playerScore={this._totalScore} opponentScore={0}/>
            </div>
          </div>
        </div>
    );
  }
}

export default App;
