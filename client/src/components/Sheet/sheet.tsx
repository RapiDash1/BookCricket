import React from "react";
import "./sheet.scss";

interface CustomInputProps {
    pos: number;
    key: string
  }


class Sheet extends React.Component <CustomInputProps> {

    _sheetPos: number = 0;
    _sheetCoverStr : string;

    // constructor 
    constructor(props : any) {
        super(props);
        this._sheetPos = props.pos;
        this._sheetCoverStr = "sheet-cover" + this._sheetPos;
        // Bind functions
        this.handleEndDrag = this.handleEndDrag.bind(this);
        this.handleStartDrag = this.handleStartDrag.bind(this);
    }


    // add component did mount and change the background color based on the position
    // Also add a box shadow

    componentDidMount() {
        const sheetCover = document.querySelector("."+this._sheetCoverStr)  as HTMLElement;
        if (this._sheetPos == 0 || this._sheetPos == 9) {sheetCover.style.backgroundColor = "green";}
        else {sheetCover.style.backgroundColor = "white";}
        sheetCover.style.boxShadow = "3px 5px 5px";
    }


    // Convert rotation to number
    // A string like rotateY(50deg) to 50
    // xOry indicates if the string is either in the form of rotateX() or rotateY()
    convertRoataionToNumber(rotVal: string, xOry: boolean = true) {
        const startPos = (xOry) ? 8 : 7;
        return Number(rotVal.slice(startPos, -4));
    }


    // handle start drag
    // Set start time
    handleStartDrag() {
    }


    // covert transklation to rotation
    translationToRotation(relativeDist: number) {
        // the angle the sheets should turn is based on the sheetPos
        // This is done so that the sheets move at a different rate,
        // which looks better
        return relativeDist/(5 - this._sheetPos*0.15);
    }


    // handle drag
    // Translate the sheet based on relative mouse position
    handleDrag(e: any) {
        // x position of the bottom right corner of the sheet
        const originX = window.innerWidth*0.6;
        const sheetCover = document.querySelector("."+this._sheetCoverStr) as HTMLElement;
        const currentYRot = this.convertRoataionToNumber(sheetCover.style.transform, true);
        //  Below formula emulates a good fit for drag movement to sheet angle
        const newYRot = this.translationToRotation(e.screenX - originX);
        // new angle is being restricted to -155deg, this offers good tradeoff between,
        // dragging distance and duration
        if (currentYRot >= newYRot && newYRot >= -155 + this.sheetAngleOffset()) {
            sheetCover.style["transform"] = "rotateY(" + newYRot.toString() + "deg" +")";
        }
        
    }


    // sheet offset angle
    // Give an offset to every sheet
    // THe sheets should be clustered around the beginning and the end for better visibility of score
    sheetAngleOffset() {
        return (this._sheetPos > 4) ? (9 - this._sheetPos)*5 : (155 - this._sheetPos*10) 
    }


    // Handle End drag
    // Set end time and reset sheet
    handleEndDrag() {
        this.resetsheet();
    }


    // resetsheet
    // Reset the sheet back to its original state with a 2s animation
    resetsheet() {
        const sheetCover = document.querySelector("."+this._sheetCoverStr) as HTMLElement;
        // Hold the page open for 1.5s to view the score
        setTimeout(() => {
            sheetCover.classList.toggle("sheet-cover-close"); // Starts the closing sheet animation
            // Wait for the sheet to close, then reset them toggle back the animation class
            setTimeout(() => {
                sheetCover.style["transform"] = "rotateY(0deg)";
                sheetCover.classList.toggle("sheet-cover-close"); 
            }, 1900);
        }, 1500);
    }

    // render
    render() {
        return (
            <div className={this._sheetCoverStr}></div> 
        );
    }
}

export default Sheet;



