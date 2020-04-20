import React from "react";
import Sheet from "../Sheet/sheet";
import "./book.css"


class Book extends React.Component {

    _startTime: Date = new Date();
    _endTime: Date = new Date();
    _sheetArray: Sheet[] = [];


    // constructor
    constructor(props: any) {
        super(props);
        // Bind functions
        this.handleEndDrag = this.handleEndDrag.bind(this);
        this.handleStartDrag = this.handleStartDrag.bind(this);
    }  


    // handle start drag
    handleStartDrag() {
        this._startTime = new Date();
    }


    // handle drag
    handleDrag(e: any) {
        // delegate start drag to each component
        this._sheetArray.forEach(sheet => {
            sheet.handleDrag(e);
        });
    }


    // handle end drag
    handleEndDrag() {
        this._endTime = new Date();
        const timeDIff: Number = this._endTime.getTime()- this._startTime.getTime();
        console.log(timeDIff);
        // delegate end drag to each component
        this._sheetArray.forEach(sheet => {
            sheet.handleEndDrag();
        });
    }


    // component did mount
    componentDidMount() {
        for (let sheetPos: number = 0; sheetPos < 10; sheetPos++) {
            this._sheetArray.push(new Sheet({pos:sheetPos}));
        }
    }


    // render
    render() {
        // Append all the sheets necessary
        let _sheetCollection: any[] = []
        for (let sheetPos: number = 0; sheetPos < 10; sheetPos++) {
           _sheetCollection.push(<Sheet pos={sheetPos}  key={"sheet"+sheetPos.toString()}/>);
        }
        return (

            <div>
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