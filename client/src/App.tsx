import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Book from "./components/Book/book";
import Navbar from "./components/Navbar/navbar";
import Score from "./components/score/score";
import Out from "./components/out/out";
import Sheet from "./components/Sheet/sheet";
import EnterCode from "./components/EnterCode/enterCode";
import socketIo from "socket.io-client";

class App extends React.Component<{}, {opponentScore: number}> {

  _totalScore: number = 0;
  _isOut: boolean = false;
  socket = socketIo("http://localhost:3000/");
  _customPlayerCode: string = "";

  constructor(props: any) {
    super(props);

    this.state = {
      opponentScore: 0
    }
    
    // binding functions
    this.bookCallBack = this.bookCallBack.bind(this);
    this.resetTotalScore = this.resetTotalScore.bind(this);
    this.sendPlayerScore = this.sendPlayerScore.bind(this);
    this.codeCallBack = this.codeCallBack.bind(this);
    this.getCustomPlayerCode = this.getCustomPlayerCode.bind(this);
  }

  // toggle out window
  toggleOutWindow() {
    const outComponent = new Out({});
    outComponent.toggleOutWindow();
  }


  // Handkle book call back
  // Sccore is updated here everytime drag is ended
  bookCallBack(currentSheetScore: number) {
    // send player score to opponent after each turn 
    this.sendPlayerScore(currentSheetScore);
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

  // get custom pleayer code
  // used to return updated customPlayerCode in sheet
  getCustomPlayerCode() {
    return this._customPlayerCode;
  }


  // reset total score
  resetTotalScore() {
    this._totalScore = 0;
    // reset the value of player score element
    // const scoringELement = document.querySelector(".scoring-val") as HTMLElement;
    // scoringELement.innerText = "0";
  }


  // send player score
  sendPlayerScore(currScore: number) {
    this.socket.emit("playerScore", {score: currScore.toString(), customCode: this._customPlayerCode});
  }


  // code call back
  // handles sending game initial code to server
  codeCallBack(code: string) {
    this.socket.emit("customCommonCode", code);
  }


  // component did mount
  componentDidMount() {
    this.socket.on("opponentScore", (message: string) => {
      console.log(message);
      this.setState({
        opponentScore: Number(message)
      });
    });

    // set player codes
    this.socket.on("playerCode", (playerCode: string) => {
      // setting player code that is given back by the server
      // this playerCode is used to tie players and opponents together
      this._customPlayerCode = playerCode;
    });

    // open book wile opponent is animating
    this.socket.on("openBookWithOpponentAngle", (sheetInfo: any) => {
      console.log("oppening book");
      // rotate the sheet of .sheetInfo.sheetCoverPos class bt sheetInfo.sheetAngle angle 
      const sheetCover = document.querySelector("."+sheetInfo.sheetCoverPos) as HTMLElement;
      sheetCover.style["transform"] = "rotateY(" + sheetInfo.sheetAngle + "deg" +")";
    })

    // player book closing animation
    // triggered by opponent
    this.socket.on("opponentBookStopOpeningAnimation", () => {
      // handle sheet closing animation per sheet
      for (let sheetPos: number = 0; sheetPos < 10; sheetPos++) {
        const sheet = new Sheet({pos:sheetPos});
        sheet.handleEndDrag();
      }
    });


    // TODO: show opponent score to player when opponent opens book

  }


  // render
  render() {
    return(
      <div className="App">
        <Out finalScore={this._totalScore}/>
        <EnterCode parentCallBack={this.codeCallBack} />
        <Navbar parentCallback={() => {}} />
        <div className="body-container">
          <div className="first-row">
            <Book appCallBack={this.bookCallBack} socket={this.socket} customPlayerCode={this.getCustomPlayerCode} /> 
            <Score playerScore={this._totalScore} opponentScore={this.state.opponentScore}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
