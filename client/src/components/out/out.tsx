import React from "react";
import "./out.scss";

interface customOutInterface {
    finalScore: number
}

class Out extends React.Component<customOutInterface> {

    // constructor
    constructor(props: any) {
        super(props);
    }


    // toggle out window on and off
    toggleOutWindow() {
        const outElement = document.querySelector(".out-div") as HTMLElement;
        outElement.classList.toggle("remove-out-div");
    }

    // render
    render() {
        return (
            <div className="out-div remove-out-div">
                <div className="display-out">
                    <p className="out-text">You are out</p>
                    <p className="score-text">{this.props.finalScore}</p>
                    <button className="exit-button" onClick={this.toggleOutWindow}>Exit</button>
                </div>
            </div>
        );
    }
}

export default Out;