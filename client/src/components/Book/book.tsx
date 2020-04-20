import React from "react";
import "./book.css";


class Book extends React.Component {
    constructor(props : any) {
        super(props);
    }


    // Convert rotation to number
    // A string like rotateY(50deg) to 50
    // xOry indicates if the string is either in the form of rotateX() or rotateY()
    convertRoataionToNumber(rotVal: string, xOry: boolean = true) {
        const startPos = (xOry) ? 8 : 7;
        return Number(rotVal.slice(startPos, -4));
    }


    // Translate the book based on relative mouse position
    handleDrag(e: any) {
        // x position of the bottom right corner of the book
        const originX = window.innerWidth*0.6;
        const bookCover = document.querySelector(".book-cover") as HTMLElement;
        const currentYRot = this.convertRoataionToNumber(bookCover.style.transform, true);
        //  Below formula emulates a good fit for drag movement to book angle
        const newYRot = (originX - e.screenX)/4;
        // Making sure the book dosen't move back 
        // Limiting maximum angle to 145deg
        if (currentYRot < newYRot && newYRot <= 145) {
            bookCover.style["transform"] = "rotateY(" + newYRot.toString() + "deg" +")";
        }
        
    }

    // Reset the book back to its original state with a 2s animation
    resetBook() {
        const bookCover = document.querySelector(".book-cover") as HTMLElement;
        // Hold the page open for 1.5s to view the score
        setTimeout(() => {
            bookCover.classList.toggle("book-cover-close"); // Starts the closing book animation
            // Wait for the book to close, then reset them toggle back the animation class
            setTimeout(() => {
                bookCover.style["transform"] = "rotateY(0deg)";
                bookCover.classList.toggle("book-cover-close"); 
            }, 1900);
        }, 1500);
    }

    render() {
        return (
            <div className="book">
                {/* Invisible button */}
                {/* When dragged translates distance into book opening angle*/}
                <button className="drag-button"  draggable="true" onDrag={this.handleDrag.bind(this)} onDragEnd={this.resetBook}>DragMe</button>
                <div className="book-cover"></div> 
            </div>
        );
    }
}

export default Book;



