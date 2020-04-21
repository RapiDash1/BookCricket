import React from "react";
import "./score.css";

class Score extends React.Component {

    constructor(props: any) {
        super(props);
    }


    render() {
        return (
            <div className="scoring-div">
                <div className="total-div">
                    <p className="scoring-key">Total :</p>
                    <p className="scoring-val">val</p>
                </div>
                <div className="total-div">
                    <p className="scoring-key">Opponent :</p>
                    <p className="scoring-val">val</p>
                </div>
            </div>
        );
    }
}

export default Score;