import React from "react";
import Sheet from "../Sheet/sheet";
import "./book.css";
import App from "../../App";

interface customBookProps {
    appCallBack: (currentSheetScore: number) => void;
}


class Book extends React.Component<customBookProps> {

    // get the start time for calculating score
    _startTime: Date = new Date();
    // get the end time for calculating score
    _endTime: Date = new Date();
    // Hold all the sheet instances to manipulate sheet elements
    _sheetArray: Sheet[] = [];
    // Time diff translates into score
    _timeDiff: number = 0;
    // Score after each book turn
    _currentScore: number = 0;


    // constructor
    constructor(props: any) {
        super(props);
        // Bind functions
        this.handleEndDrag = this.handleEndDrag.bind(this);
        this.handleStartDrag = this.handleStartDrag.bind(this);
    }  


    // handle start drag
    handleStartDrag() {
        // start time checkpoint
        this._startTime = new Date();
    }


    // handle drag
    handleDrag(e: any) {
        // delegate start drag to each component
        this._sheetArray.forEach(sheet => {
            sheet.handleDrag(e);
            // timer stop
            if (this.shouldTimerBeStopped(sheet)) {
                // end time checkpoint
                this._endTime = new Date();
                const timeDIff: number = this._endTime.getTime() - this._startTime.getTime();
                this._timeDiff = timeDIff;
                // take only the last digit of time diff
                // that's how book cricket scores are calculated
                this._currentScore = Number(timeDIff.toString().slice(-1));
                // force rerender of the component to upodate the page values on each sheet
                this.forceUpdate();
                // reset timer stop bool so that the above calculatio is done only once
                sheet.resetTimerStopBool();
            }
        });
    }


    // should timer be stopped
    shouldTimerBeStopped(currentSheet: Sheet) {
        // We have to delegate part of the responisibility to the sheet
        // We need to calculate the time diff only once,
        // Hence check if _timeDIff has its original value, only then
        // Calculate the time diff
        return (currentSheet.shouldTimerBeStopped() && this._timeDiff == 0);
    }


    // reset time diff bool
    // resetting is important to update time on opening the book again
    resetTimeDiffBool() {
        this._timeDiff = 0;
    }


    // handle end drag
    handleEndDrag() {
        // delegate end drag to each component
        this._sheetArray.forEach(sheet => {
            sheet.handleEndDrag();
        });
        this.resetTimeDiffBool();
        // Set totalScore in app using callback
        this.props.appCallBack(this._currentScore);
    }


    // component did mount
    componentDidMount() {
        // Add sheet instances to manipulate later
        for (let sheetPos: number = 0; sheetPos < 10; sheetPos++) {
            this._sheetArray.push(new Sheet({pos:sheetPos}));
        }
    }


    // render
    render() {
        // Append all the sheets necessary
        let _sheetCollection: any[] = []
        for (let sheetPos: number = 0; sheetPos < 10; sheetPos++) {
           _sheetCollection.push(<Sheet pos={sheetPos}  key={"sheet"+sheetPos.toString()} pageNumber={this._timeDiff}/>);
        }
        return (

            <div className="complete-book">
                {/* Invisible button */}
                {/* When dragged translates distance into sheet opening angle*/}
                <button className="drag-button"  draggable="true" onDragStart={this.handleStartDrag} onDrag={this.handleDrag.bind(this)} onDragEnd={this.handleEndDrag}>DragMe</button>
                <div className="book">
                    {_sheetCollection}
                </div>
            </div>
        );
    }
}

export default Book;