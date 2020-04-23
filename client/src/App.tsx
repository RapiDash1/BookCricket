import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Book from "./components/Book/book";
import Navbar from "./components/Navbar/navbar";
import Score from "./components/score/score";
import Out from "./components/out/out";
import io from "socket.io-client";

class App extends React.Component<{}, {opponentScore: number}> {

  _totalScore: number = 0;
  _isOut: boolean = false;

  constructor(props: any) {
    super(props);

    this.state = {
      opponentScore: 0
    }

    this.bookCallBack = this.bookCallBack.bind(this);
    this.resetTotalScore = this.resetTotalScore.bind(this);
  }

  // toggle out window
  toggleOutWindow() {
    const outComponent = new Out({});
    outComponent.toggleOutWindow();
  }

  // Handkle book call back
  // Sccore is updated here everytime drag is ended
  bookCallBack(currentSheetScore: number) {
    if (currentSheetScore == 0) {
      setTimeout(() => {
        this._isOut = true;
        this.toggleOutWindow();
        this.forceUpdate();
        // dont reset score before toggling window
        // it'll update the reset value to score
        this.resetTotalScore();
      }, 1800);
    } else {
      this._totalScore += currentSheetScore;
      // Total time for book opoen position hold and close aniation is 1.9s + 1.5s = 3.4s
      // Timeout for 2.5s so that we give enough time for the book
      // to close partially, so that page number wont be visible when
      // we reset it
      setTimeout(()=>{
        this.forceUpdate();
      }, 2500);
    }
  }


  // reset total score
  resetTotalScore() {
    this._totalScore = 0;
    // reset the value of player score element
    // const scoringELement = document.querySelector(".scoring-val") as HTMLElement;
    // scoringELement.innerText = "0";
  }


  componentDidMount() {
    const socket = io("http://localhost:3000/");
    socket.on("opponentScore", (message: string) => {
      this.setState({
        opponentScore: Number(message)
      });
    });
  }


  // render
  render() {
    return(
        <div className="App">
          <Out finalScore={this._totalScore}/>
          <Navbar parentCallback={() => {}} />
          <div className="body-container">
            <div className="first-row">
              <Book appCallBack={this.bookCallBack} /> 
              <Score playerScore={this._totalScore} opponentScore={this.state.opponentScore}/>
            </div>
          </div>
        </div>
    );
  }
}

export default App;
